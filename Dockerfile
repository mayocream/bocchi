FROM golang:1.23 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o twitter .

# Final stage
FROM alpine

RUN apk --no-cache add ca-certificates

WORKDIR /app

COPY --from=builder /app/twitter .

EXPOSE 8080

CMD ["./twitter", "server"]
