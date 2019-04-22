# doppler-devops
Doppler's Docker infrastructure



### Log

1. Preparo mi acceso a los severs por ssh key

    1. En mi máquina genero una key (con passphrase)

        ```console
        $ ssh-keygen
        Generating public/private rsa key pair.
        Enter file in which to save the key (/home/andres/.ssh/id_rsa):
        Enter passphrase (empty for no passphrase):
        Enter same passphrase again:
        Your identification has been saved in /home/andres/.ssh/id_rsa.
        Your public key has been saved in /home/andres/.ssh/id_rsa.pub.
        The key fingerprint is:
        b2:ad:a0:80:85:ad:6c:16:bd:1c:e7:63:4f:a0:00:15 andres@host
        The key's randomart image is:
        +---[RSA 2048]----+
        |           . o + |
        |         = X * . |
        |      . O @ = . .|
        |     + o X O . + |
        |   . = S * = o   |
        | . ..o . . o .   |
        |     + .o. E     |
        |      + ...o.    |
        |     . . ooo+.   |
        +----[SHA256]-----+
        ```

    2. Copio la key a cada uno de los servers a los que quiero tener acceso (`moschini.noip.me`, `docker.fromdoppler.com`, `ubuntu-01`, `ubuntu-02`)

        ```console
        $ ssh-copy-id pi@moschini.noip.me -p10022
        /usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/Users/ms/.ssh/id_rsa.pub"
        /usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
        /usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
        pi@moschini.noip.me's password:
        
        Number of key(s) added:        1
        
        Now try logging into the machine, with:   "ssh -p '10022' 'pi@moschini.noip.me'"
        and check to make sure that only the key(s) you wanted were added.
        
        $ ssh-copy-id root@docker.fromdoppler.com
        /usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/Users/ms/.ssh/id_rsa.pub"
        /usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
        /usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
        root@docker.fromdoppler.com's password:
        
        Number of key(s) added:        1
        
        Now try logging into the machine, with:   "ssh 'root@docker.fromdoppler.com'"
        and check to make sure that only the key(s) you wanted were added.
        
        $ ssh-copy-id root@142.93.180.201
        /usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/Users/ms/.ssh/id_rsa.pub"
        /usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
        /usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
        root@142.93.180.201's password:
        
        Number of key(s) added:        1
        
        Now try logging into the machine, with:   "ssh 'root@142.93.180.201'"
        and check to make sure that only the key(s) you wanted were added.
        
        $ ssh-copy-id root@142.93.70.243
        /usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/Users/ms/.ssh/id_rsa.pub"
        /usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
        /usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
        root@142.93.70.243's password:
        
        Number of key(s) added:        1
        
        Now try logging into the machine, with:   "ssh 'root@142.93.70.243'"
        and check to make sure that only the key(s) you wanted were added.
        ```

2. Preparo acceso de los servidores al repo de github

    1. En cada server genero una key (sin passphrase)

        ```console
        $ ssh-keygen
        Generating public/private rsa key pair.
        Enter file in which to save the key (/root/.ssh/id_rsa):
        Enter passphrase (empty for no passphrase):
        Enter same passphrase again:
        Your identification has been saved in /root/.ssh/id_rsa.
        Your public key has been saved in /root/.ssh/id_rsa.pub.
        The key fingerprint is:
        b2:ad:a0:80:85:ad:6c:16:bd:1c:e7:63:4f:a0:00:15 root@host
        The key's randomart image is:
        +---[RSA 2048]----+
        |           . o + |
        |         = X * . |
        |      . O @ = . .|
        |     + o X O . + |
        |   . = S * = o   |
        | . ..o . . o .   |
        |     + .o. E     |
        |      + ...o.    |
        |     . . ooo+.   |
        +----[SHA256]-----+
        $
        ```

    2. Agrego la key en las [Deploy keys del repo doppler-devops](https://github.com/MakingSense/doppler-devops/settings/keys)

    3. Descargo el repositorio en cada server de destino  (`moschini.noip.me`, `docker.fromdoppler.com`, `ubuntu-01`, `ubuntu-02`)

        ```console
        $ cd /var
        $ git clone git@github.com:MakingSense/doppler-devops.git
        $ cd doppler-devops
        $ # Para actualizar
        $ # git pull
        $ # Para actualizar forzando reset
        $ # git fetch --all && git reset --hard origin/master
        $ cat README.md
        # doppler-devops
        Doppler's Docker infrastructure
        
        
        
        ### Log
        
        1. Preparo mi acceso . . .
        ```

3. Instalo Docker en los servers
   
   Sigo los pasos del [tutorial de digital ocean](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04)

   ```
   $ sudo apt update && sudo apt install apt-transport-https ca-certificates curl software-properties-common
   $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   $ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
   $ sudo apt update
   $ apt-cache policy docker-ce
   $ sudo apt install docker-ce
   
   ```

4. Sigo el [tutorial de Swarm](https://docs.docker.com/engine/swarm/swarm-tutorial/), aunque con 2 servidores en lugar de 3 y apuntando a la imagen de _doppler-reports-api_ ([andresmoschini/doppler-reports-api](https://cloud.docker.com/repository/docker/andresmoschini/doppler-reports-api)) que se genera cuando se hacen los merges a master en el repo [doppler-reports-api](https://github.com/MakingSense/doppler-reports-api) 
 
    1. Primero abrimos los puertos en los servidores para habilitar las conecciones entre los nodos del swarm:
        - sudo ufw allow from [ServerIp] to any port 2377 proto tcp
        - sudo ufw allow from [ServerIp] to any port 7946 proto tcp
        - sudo ufw allow from [ServerIp] to any port 7946 proto udp
        - sudo ufw allow from [ServerIp] to any port 4789 proto udp
 
    2. Luego se crea el swarm (esto es solo a modo de guia ya que el token esta desactulizado)
        En ubuntu-01:
        ```
        sudo docker swarm init --advertise-addr [ServerIp]
        ```
        En ubuntu-02 lo unimos al swarm como worker:
        ```
        sudo docker swarm join --token SWMTKN-1-3r2339v5uhpcz97mmhsf1i8nex9d84femy4hrtgmnf9iyxlmtu-24q5mefbf9kdg4jg3teuwsjo5 [ServerIp]:2377
        ```
        Para obetener un token actualizado: sudo docker swarm join-token worker
        Para promover un nodo a manager desde el nodo manager: sudo docker node promote [ServerIp]
 
5. Creamos el servicio de la api/reports-webapp en el swarm

    1. Primero nos autenticamos en el repositorio de docker
        docker login (va a pedir username y password)
        Este paso hay que revisarlo con mas profundida porque los accesos a docker quedan guardados en un archivo json sin encriptacion, docker facilita algunas aplicaciones para guardar passwords encriptados pero se colgaba la consola y no se pudo encriptar.
    2. Luego traemos la imagen del repositorio:
        ```
        sudo docker pull andresmoschini/doppler-reports-api **Imagen de la api**
        sudo docker pull darosw/doppler-webapp:prod  **Imagen de webapp-reports** (en el caso de traer la imagen de int o qa cambiar por :int :qa)
        ```
    3. Creamos config de nginx, para servir https y redireccionar http a https. Solo en nodo manager:
        ```
        sudo nano site.conf
        server {
            listen      80 default_server;
            server_name app.fromdoppler.com;
            return  301 https://$server_name$request_uri;
        }
        server {
            listen              443 default_server ssl;
            server_name         app.fromdoopler.com;
            ssl_certificate     /run/secrets/site.crt;
            ssl_certificate_key /run/secrets/site.key;
            
            location / {
                root    /usr/share/nginx/html;
                index   index.html index.html;
            }
        }
        ```
        **Configuracion para prod**
        
        ```
        sudo nano site2.conf
        server {
            listen      8080 default_server;
            server_name app.fromdoppler.com;            
        }
        server {
            listen              443 default_server ssl;
            server_name         app.fromdoopler.com;
            ssl_certificate     /run/secrets/site.crt;
            ssl_certificate_key /run/secrets/site.key;
            erro_page   497     https://$host:4443$request_uri;
            
            location / {
                root    /usr/share/nginx/html;
                index   index.html index.html;
            }
        }
        ```
        **Configuracion para int**
        
    4. Convertimos los certificados para poder crear los docker secrets. Solo en nodo manager:
        ```
        openssl pkcs12 -in Doppler2018-2020.pfx  -nocerts -out key.pem -nodes
        openssl pkcs12 -in Doppler2018-2020.pfx -clcerts -nokeys -out cert.pem
        ```
    5. Creamos los docker secrets para luego asociar al servicio. Solo en nodo manager:
        ```
        docker secret create site.key key.pem
        docker secret create site.crt cert.pem
        docker secret create site.conf site.conf
        ```
        **Solo en el nodo manager, ya que al crear el servicio se replicara en los workers**
    6. Creamos el servicio:
        ```
        sudo docker service create --mode global --name [Nombre servicio] --update-delay 2m30s --publish published=80,target=80 --publish published=443,target=443 --secret site.key --secret site.crt --secret source=site.conf,target=/etc/nginx/conf.d/site.conf darosw/doppler-webapp:prod
        ```
        El commando --mode global hace referencia a que cada vez que se una un nodo se cree el servicio en el mismo, siempre que tenga la imagen.          
        Update-delay es el tiempo de delay en la actualizacion de cada nodo al hacer un docker service update [service_name] --force. Es necesario hacer un force del update ya que nuestro servicio esta constantemente corriendo.          
        Los secretos se replicaran en todos los nodos, no hace falta crearlos en los workers.          
        Published hace referencia a el puerto externo (o published-port segun docker)          
        target hace referencia a el puerto de la aplicacion (o container-port segun docker)

  6. TODO realizar docker pull darosw/doppler-webapp:prod/int/qa && docker service update [service_name] --force de manera automatica.
   Docker hub tiene implementado un webhook que podriamos usar.

