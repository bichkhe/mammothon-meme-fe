# Use the official Node.js image as the base image
FROM node:20-alpine AS builder

RUN apk update && apk add git && apk add openssh

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
# COPY package*.json ./

# Install dependencies

# Copy the rest of the application code
COPY . .
RUN yarn
# RUN yarn build

# FROM node:20-alpine
# WORKDIR /app

# COPY --from=builder /app ./

RUN mv env-example .env.local

# Expose the port the app runs on
EXPOSE 5555

# Start the Next.js application in development mode
CMD ["yarn", "dev"]
