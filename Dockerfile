# Stage 1 - Build
FROM node:10 as build

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY ./ /usr/src/app/

WORKDIR /usr/src/app/services/backend

RUN npm install
RUN npm run build

# Stage 2 - Execute
FROM node:10

RUN apt update
RUN apt-get -y install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Create app directory and copy assets from prev stage
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app

WORKDIR /usr/src/app/services/backend

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD node build/backend/src/index.js