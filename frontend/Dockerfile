# Stage 1: Building the code
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the app using node
FROM node:18


WORKDIR /app

# Copy over the built artifacts from the builder stage
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

# Expose the port server is running on
EXPOSE 3000

# Define environment variable for connecting to the backend
ENV BACKEND_URL=http://backend:3001

# Start the app
CMD ["npm", "run", "start"]
