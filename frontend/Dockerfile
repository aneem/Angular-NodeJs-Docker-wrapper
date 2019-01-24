FROM node:10.14-alpine 

ENV HOME /var/www/frontend
WORKDIR $HOME

COPY $PWD/code/package.json $HOME

RUN npm install

COPY $PWD/code $HOME

EXPOSE 4200