FROM node:12-slim

# Jump to working directory;
WORKDIR /usr/src/app

# Add package.json to image;
COPY package*.json ./

# Install packages;
RUN npm install --only=production

# Copy files;
COPY . ./

# Run the app;
CMD ["node", "./dist/app.js"]