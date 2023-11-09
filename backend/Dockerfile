# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle backend source inside the Docker image
COPY . .

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3001

# Define environment variable for MongoDB connection
ENV MONGODB_URI=mongodb://mongo:27017/stock_market?replicaSet=myReplicaSet
ENV PORT=3001

# Run the backend when the container launches
CMD ["node", "index.js"]
