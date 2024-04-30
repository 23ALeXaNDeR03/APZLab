FROM node:latest

RUN mkdir -p /cinema/src/app/
WORKDIR /cinema/src/app/

COPY . /cinema/src/app/
RUN npm install

EXPOSE 3000
CMD ["node", "app.js"]
