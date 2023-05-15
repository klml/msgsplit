FROM docker.io/library/golang:1.19-alpine AS builder-env
WORKDIR /app
COPY ./index.html /app
COPY ./msgsplit.go /app
COPY ./static /app/static
RUN CGO_ENABLED=0 go build ./msgsplit.go
RUN rm ./msgsplit.go

FROM scratch
WORKDIR /app
COPY --from=builder-env /app/ /app/

EXPOSE 8080
CMD [ "./msgsplit" ]
