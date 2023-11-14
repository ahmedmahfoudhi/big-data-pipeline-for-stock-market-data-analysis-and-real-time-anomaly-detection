
FROM node:latest


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 3001

# Define environment variable for MongoDB connection
ENV MONGODB_URI=mongodb://mongo:27017/stock_market?replicaSet=myReplicaSet
ENV PORT=3001


CMD ["node", "index.js"]
