# Use the official Node.js image as the base image
FROM node:20-alpine AS builder

RUN apk update && apk add git

# Set the working directory
WORKDIR /app

RUN mv meme-app/* .
RUN rm -rf meme-app
RUN ls -la
RUN pwd

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn

# Copy the rest of the application code
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /app

RUN mv env-example .env.local

COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 5555

# Start the Next.js application in development mode
CMD ["yarn", "dev"]
