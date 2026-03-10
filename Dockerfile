FROM node:24.14-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 4000

CMD ["npm", "start"]