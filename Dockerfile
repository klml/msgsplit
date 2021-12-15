FROM python:3.10.1-alpine

WORKDIR /app
COPY . /app

EXPOSE 8080
CMD [ "python3", "msgsplit.py" ]
