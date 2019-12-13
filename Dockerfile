# Create node image
FROM node:12.13.0-alpine

# Create app directory
WORKDIR /app

# Copy file to /app directory
COPY . /app
RUN mkdir /app/cache
RUN mkdir /app/cache/pangan

# install dependencies
RUN npm install pm2 -g

# compile typescript
RUN npm run tsc

# Remove dev dependencies
RUN npm prune --production --silent

# Remove unused file/folder
RUN rm -rf src
RUN rm tsconfig.json
RUN rm Dockerfile
RUN rm .dockerignore

# set environtment
ENV NODE_ENV=production

# Expose port 5000
EXPOSE 5000

# run node dist/server.js
# CMD [ "node", "dist/server.js" ]
CMD [ "pm2-runtime", "dist/server.js" ]