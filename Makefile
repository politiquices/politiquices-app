build:
	docker build -t politiquices-app .

production:
	echo 'REACT_APP_POLITIQUICES_API=http://172.19.0.3:8000' > .env && docker run --name politiquices-app --net politiquices -p 3000:3000 politiquices-app

develop:
	echo 'REACT_APP_POLITIQUICES_API=http://127.0.0.1:8000' > .env && npm start
