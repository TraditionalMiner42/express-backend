# Build the express app
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /room-booking-express

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies (including development dependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Production
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /room-booking-express

# Copy only the necessary files from the build stage
COPY --from=build /room-booking-express /room-booking-express

# Install only production dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 4000

# Define the command to run the application
# CMD ["node", "./api/index.js"]

CMD [ "npm", "start" ]