FROM docker.io/library/golang:alpine AS builder-env
WORKDIR /app
COPY ./ /app
RUN CGO_ENABLED=0 go build ./msgsplit.go
RUN rm ./msgsplit.go

FROM scratch
WORKDIR /app
COPY --from=builder-env /app/ /app/

EXPOSE 8080
CMD [ "./msgsplit" ]
