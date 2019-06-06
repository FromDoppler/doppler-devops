/**
 * A service for automated deployment from Docker Hub to Docker Swarm
 * https://docs.docker.com/docker-hub/webhooks/
 */
process.env.PORT = process.env.PORT || 3000

const express = require('express')
const bodyParser = require('body-parser')
const child_process = require('child_process')
const app = express()
const Package = require('./package.json')
const services = require(`./config.json`)[process.env.CONFIG || 'production']

if (!process.env.TOKEN || !process.env.USERNAME || !process.env.PASSWORD)
  return console.error("Error: You must set a TOKEN, USERNAME and PASSWORD as environment variables.")

const token = process.env.TOKEN || ''
const dockerCommand = process.env.DOCKER || '/usr/bin/docker'
const username = process.env.USERNAME || ''
const password = process.env.PASSWORD || ''

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/webhook/:token', (req, res) => {
  if (!req.params.token || req.params.token != token) {
    console.log("Webhook called with invalid or missing token.")
    return res.status(401).send('Access Denied: Token Invalid\n').end()
  }

  // Send response back right away if token was valid
  res.send('OK')

  const payload = req.body
  const image = `${payload.repository.repo_name}:${payload.push_data.tag}`

  if (!services[image]) return console.log(`Received updated for "${image}" but not configured to handle updates for this image.`)

  const service = services[image].service
  
  // Make sure we are logged in to be able to pull the image
  child_process.exec(`${dockerCommand} login -u "${username}" -p "${password}"`,
    (error, stdout, stderr) => {
      if (error) return console.error(error)

      // Pull the image and remove old ones
      console.log(`Removing Old images and pulling ${image}`)
      child_process.exec(`${dockerCommand} container prune -f && ${dockerCommand} image prune -f`,
        (error, stdout, stderr) => {
        if (error) {
          console.error(`Error on removing unused containers and images`)
          return console.error(error)
        }
    })
	  child_process.exec(`${dockerCommand} pull ${image}`,
		(error, stdout, stderr) => {
		if (error) {
			console.error(`Error on pulling new ${image}`)
			return console.error(error)
		}
	  console.log(`Old images removed and new image pulled successfully`)
	})
  })
})

app.all('*', (req, res) => {
  res.send('')
})

app.listen(process.env.PORT, err => {
  if (err) throw err
  console.log(`Listening for webhooks on http://localhost:${process.env.PORT}/webhook/${token}`)
})
