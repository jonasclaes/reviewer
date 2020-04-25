FROM node:12-slim

# Jump to working directory;
WORKDIR /usr/src/app

# Install packages;
RUN npm install -g http-server

# Copy files;
COPY . ./

# Run the app;
CMD ["http-server"]