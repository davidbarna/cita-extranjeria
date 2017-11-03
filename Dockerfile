FROM alekzonder/puppeteer:latest

# copy the package.json and yarn.lock file
COPY package.json /app

# install the dependencies
RUN npm install

# copy source code
COPY . /app

CMD [ "npm" , "start" ]
