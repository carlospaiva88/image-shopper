FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY robotic-epoch-433814-e0-dea78bee005a.json /app/robotic-epoch-433814-e0-dea78bee005a.json

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV production

CMD ["node", "dist/app.js"]
