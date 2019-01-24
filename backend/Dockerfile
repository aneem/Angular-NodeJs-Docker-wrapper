FROM node:10.14-alpine

ENV HOME /usr/local/api
WORKDIR $HOME

COPY $PWD/entrypoint.dev.sh $HOME

COPY $PWD/code/package.json $HOME
RUN npm install

COPY $PWD/code $HOME

EXPOSE 3000

ENTRYPOINT ["sh", "entrypoint.dev.sh"]