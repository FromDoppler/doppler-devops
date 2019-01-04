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

4. Sigo el [tutorial de Swarm](https://docs.docker.com/engine/swarm/swarm-tutorial/), aunque con 2 servidores en lugar de 3 y apuntando a la imagen de _doppler-reports-api_ ([andresmoschini/doppler-reports-api](https://cloud.docker.com/repository/docker/andresmoschini/doppler-reports-api)) que se genera cuando se hacen los merges a master en el repo [doppler-reports-api](https://github.com/MakingSense/doppler-reports-api) **_[INCOMPLETO]_**

5. 

