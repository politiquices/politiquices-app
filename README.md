### __1. SPARQL endpoint__

  git clone https://github.com/politiquices/SPARQL-endpoint
  make sparql


### __2. API for graphical interface__

  git clone https://github.com/politiquices/politiquices-api
  make cache
  make images
  make build 
  make production
    
  # ToDo: --env sparql_endpoint='http://jena_sparql:3030' pass the correct SPARQL IP+PORT
  docker run -dit --env SPARQL_ENDPOINT='http://127.0.0.1:3030' --name politiquices-api -p 127.0.0.1:8000:8000 politiquices-api
    
  # ToDo: get the SPARQL IP+PORT from the docker network
  docker run -dit --env SPARQL_ENDPOINT='http://172.17.0.2:3030' --name politiquices-api -p 127.0.0.1:8000:8000 politiquices-api

  docker run --rm -it --entrypoint bash --env sparql_endpoint='http://jena_sparql:3030' --name politiquices-api --net politiquices -p 127.0.0.1:8000:8000 politiquices-api

  # all in one command
  docker container stop politiquices-api && docker container rm politiquices-api && PROTOCOL="HTTP://"  IP_ADDRESS=`docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' happy_cartwright` && PORT="3030" && PROTOCOL_IP="$PROTOCOL$IP_ADDRESS:$PORT" && docker run -dit --env SPARQL_ENDPOINT=$PROTOCOL_IP --name politiquices-api -p 127.0.0.1:8000:8000 politiquices-api


## 3. __Start politiquices-app__

  local:  
      npm run build && scp -r build politiquices.pt:.
  
  remote: 
      cd build
      sudo cp -rv * /var/www/html/politiquices_beta/

  npm run build && scp -r build politiquices.pt:. && ssh politiquices.pt 'cd build && sudo cp -rv * /var/www/html/politiquices_beta/'
  npm run build && rsync -avz --delete build/ politiquices.pt:/var/www/html/politiquices_beta/

