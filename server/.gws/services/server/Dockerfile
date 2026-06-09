FROM node:20-alpine
WORKDIR /deps
COPY package.json ./
RUN npm install
WORKDIR /app
EXPOSE 5000
ENV HOST=0.0.0.0
ENV PORT=5000
ENV NODE_PATH=/deps/node_modules
CMD ["sh", "-c", "ln -sf /deps/node_modules /app/node_modules 2>/dev/null; /deps/node_modules/.bin/nodemon --watch /app/src src/index.js"]
