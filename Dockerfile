# Stage 1: Install dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app

# Copy only the package files to install dependencies
COPY package*.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from the previous stage
COPY --from=dependencies /app/node_modules ./node_modules
# Copy the rest of your application code
COPY . .

# Temporarily disable ESLint during the build process
RUN npm run build -- --no-lint

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app ./

# Expose the port Next.js runs on
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
