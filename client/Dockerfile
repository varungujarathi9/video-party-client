# pull official base image
FROM node:12.8.1

# set working directory
WORKDIR /client

# add `/client/node_modules/.bin` to $PATH
ENV PATH /client/node_modules/.bin:$PATH

ARG REACT_APP_SERVER_TYPE
ENV REACT_APP_SERVER_TYPE=$REACT_APP_SERVER_TYPE
RUN echo "TYPE": $REACT_APP_SERVER_TYPE


# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]

