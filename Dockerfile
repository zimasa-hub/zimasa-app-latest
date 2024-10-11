# Use the official Node.js 18 image as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your app's source code
COPY . .

# Build your Next.js app (temporarily disable ESLint)
RUN npm run build -- --no-lint

# Expose the port Next.js runs on
EXPOSE 3000

# Run the app
CMD ["npm", "start"]