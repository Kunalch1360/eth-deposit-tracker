# Use the official Node.js image.
FROM node:18

# Create and change to the app directory.
WORKDIR /app

# Install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build the Next.js application.
RUN npm run build

# Expose port 3000 and start the Next.js server.
EXPOSE 3000
CMD ["npm", "start"]
