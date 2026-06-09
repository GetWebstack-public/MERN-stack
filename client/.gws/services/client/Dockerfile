FROM node:20-slim
WORKDIR /deps
COPY package.json ./
RUN npm install
WORKDIR /app
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
ENV CI=false
ENV NODE_PATH=/deps/node_modules
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true
ENV FAST_REFRESH=false
ENV GENERATE_SOURCEMAP=false
CMD ["sh", "-c", "ln -sf /deps/node_modules /app/node_modules 2>/dev/null; node /deps/node_modules/.bin/react-scripts start"]
