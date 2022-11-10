FROM node:lts-buster-slim

# Create app directory
WORKDIR /opt/myapps/noderest01

COPY package.json /opt/myapps/noderest01/package.json
COPY package-lock.json /opt/myapps/noderest01/package-lock.json
RUN npm ci

COPY . /opt/myapps/noderest01

EXPOSE 3005

CMD [ "npm", "run", "start" ]