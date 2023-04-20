FROM node:16-alpine

# Set the Node environment to development to ensure all packages are installed
ENV NODE_ENV development

# Change our current working directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY  package*.json ./

# install all dependencies
RUN npm install

# Expose port 3000 for the SvelteKit app and 24678 for Vite's HMR
EXPOSE 5173
EXPOSE 24678