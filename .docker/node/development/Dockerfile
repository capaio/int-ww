FROM node:16.13.1-alpine

RUN apk add git tzdata
ENV TZ=Europe/Rome
# Clean APK cache
RUN rm -rf /var/cache/apk/*

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN mkdir -p /usr/src/kmon-api
WORKDIR /usr/src/kmon-api

RUN chown -R 1000:1000 /usr/src/kmon-api

EXPOSE 8080

USER 0

RUN apk add --no-cache \
    bash \
    curl \
    git \
    make

USER 1000
