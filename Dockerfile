FROM node:12
ARG sqs_queue_url is_queue_on
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN sed -i "s|replaced_this_with_a_sqs_queue_url|${sqs_queue_url}|g" .env
RUN sed -i "s|replaced_this_with_is_queue_on|${is_queue_on}|g" .env
RUN cat .env
EXPOSE 8080
CMD [ "node", "start.js" ]