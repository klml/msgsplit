FROM python:alpine

WORKDIR /app
COPY . /app

EXPOSE 8080
CMD [ "python3", "msgsplit.py" ]
