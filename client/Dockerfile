# # pull official base image
# FROM node:12.8.1

# # set working directory
# WORKDIR /client

# # add `/client/node_modules/.bin` to $PATH
# ENV PATH /client/node_modules/.bin:$PATH

# # install app dependencies
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install --silent
# RUN npm install react-scripts@3.4.1 -g --silent

# # add app
# COPY . ./

# # start app
# CMD ["npm", "start"]

FROM python:alpine3.7

COPY . /client
WORKDIR /client
RUN pip install flask
EXPOSE 8000
ENTRYPOINT [ "python" ]
CMD [ "sample.py" ]
