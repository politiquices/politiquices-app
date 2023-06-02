build:
	docker build -t politiquices-app .

production:
	IP=`docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' politiquices-api` && echo REACT_APP_POLITIQUICES_API=$IP > .env
	docker run --name politiquices-app --net politiquices -p 3000:3000 politiquices-app

develop:
	echo 'REACT_APP_POLITIQUICES_API=http://127.0.0.1:8000' > .env && npm start
