FROM python:3.9.6-alpine

WORKDIR /app
COPY . /app

EXPOSE 8080
CMD [ "python3", "msgsplit.py" ]
