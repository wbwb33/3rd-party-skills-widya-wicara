# Create node image
FROM node:10

# Create app directory
WORKDIR /app

# Copy file to /app directory
COPY . /app

# Copy ormconfig-prod.json to replace the ormconfig for dev
COPY ormconfig-prod.json /app/ormconfig.json

# Install app dependencies
RUN npm install

# compile typescript
RUN npm run build:docker

# create folder /cache
RUN mkdir /app/cache

# Expose port 5000
EXPOSE 5000

# run node dist/server.js
CMD [ "node", "dist/server.js" ]