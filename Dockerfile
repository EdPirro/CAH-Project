FROM node:16.13-alpine as build

WORKDIR /front

COPY ./client .

RUN npm ci
RUN npm run build

FROM node:16.13-alpine

WORKDIR /app

COPY --from=build /front/build ./views
COPY ./server .

RUN npm ci

ENV PORT=$PORT

CMD ["npm", "start"]