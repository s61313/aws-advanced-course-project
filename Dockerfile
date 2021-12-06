FROM node:12
ARG serverid sqs_queue_url
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

RUN sed -i "s/replaced_this_with_a_server_id/${serverid}/g" views/elb_stickiness.ejs
RUN sed -i "s|replaced_this_with_a_sqs_queue_url|${sqs_queue_url}|g" .env
EXPOSE 8080
CMD [ "node", "start.js" ]