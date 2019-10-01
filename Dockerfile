# Create node image
FROM node:10

# Create app directory
WORKDIR /app

# Copy file to /app directory
COPY . /app

# Install app dependencies
RUN npm install --production

# compile typescript
RUN npm run build:docker

# create folder /cache
RUN mkdir /app/cache

# Expose port 5000
EXPOSE 5000

# run node dist/server.js
CMD [ "node", "dist/server.js" ]