# Use full Node + Chrome base image
FROM browserless/chrome:latest

# Install dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Copy your Puppeteer script
COPY wolt-login.js ./
COPY profile ./profile

# Run script
CMD ["node", "wolt-login.js", "wolt@myqurater.com"]
