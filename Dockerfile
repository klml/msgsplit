FROM python:3.6

WORKDIR /app
COPY . /app

# Install app dependencies
RUN pip install -r requirements.txt

EXPOSE 8080
CMD [ "python3", "msgsplit.py" ]
