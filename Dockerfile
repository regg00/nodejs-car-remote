FROM ubuntu
LABEL maintainer="regis tremblay lefrancois"

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y nodejs npm
RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN npm install

EXPOSE 80
COPY config.js .
COPY app.js .
CMD ["npm", "start"]