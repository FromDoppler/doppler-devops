# Deploy Webhook

Flow for automated deployment:

* Configure Docker Hub to call this service via webhook when a new image is available.
* Configure and deploy this service to Docker Swarm.

## Configuration
The `config.json` file defines each environment.
Inside each environment config is the name of an image and tag to listen for, and the service that should be updated to run it:
	```
    {
      "production": {
		"dariosw/doppler-webapp:int-v1": {
			"service": "WEBAPP-INT"
		},
		"dariosw/doppler-webapp:qa-v1": {
			"service": "WEBAPP-QA"
		},
		"dariosw/doppler-webapp:prod-v1": {
			"service": "WEBAPP"
		}
      }
    }
	```
In the `index.js` file are the docker commands. It should be noted that there are two types of this files, the one that does the image pulling and the service update on the manager node and the other does the image pulling on worker nodes.

## Build image and create service to Docker Swarm

* Build Image (on managers and workers nodes)
	```
	docker build {DeployWebhookPath} -t {ImageName}
	```
* Create service (on managers and workers nodes):
    ```
    docker service create --name {ServiceName} --publish={ManagerPort}:{ManagerPort} --mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
    -e PORT={ManagerPort} -e CONFIG="production" -e TOKEN={Token} -e USERNAME={DockerHubUserName} -e PASSWORD={DockerHubPW} \
	-e constraint:node=={NodeName} {ImageName}
    ```

## Configure Docker Hub to use Webhook

The URL to specify for the webhook in Docker Hub will be `${Server}/webhook/${Token}`. There should be one webhook for each node.

## Testing

To test with the example payload:

    curl -v -H "Content-Type: application/json" --data @payload.json {Server}/webhook/{Token}
