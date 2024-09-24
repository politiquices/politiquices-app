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


## 3. __Start politiquices-app__

Build webapp locally:
  
	npm install

Will install the needed modules, creating `node_modules` and `package-lock.json`. Check if the app runs:

	npm start

If it looks ok build it to send it to the remove server. Make sure `REACT_APP_POLITIQUICES_API=http://politiquices.pt:8000` in the `.env`

	echo "REACT_APP_POLITIQUICES_API=http://politiquices.pt:8000" >> .env
	npm run build
	cp htaccess build/.htaccess
	rsync -avz --delete build/ politiquices.pt:/var/www/html/politiquices_beta/

Or in a single command:

	echo "REACT_APP_POLITIQUICES_API=http://politiquices.pt:8000" >> .env && npm run build && rsync -avz --delete build/ politiquices.pt:/var/www/html/politiquices/
