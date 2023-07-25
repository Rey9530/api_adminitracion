FROM node:18-alpine
WORKDIR /usr/src/app 
COPY . .
RUN yarn install
RUN npx prisma generate
RUN yarn run tsc
RUN cp -r src/html build/src
RUN mkdir build/src/helpers/pdfs_x_borra
EXPOSE 4000
CMD [ "node", "build/index.js" ]