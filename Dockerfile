FROM node:18

ARG ARCH=amd64
WORKDIR /tmp
RUN wget -qO /tmp/dapr.tgz "https://github.com/dapr/cli/releases/latest/download/dapr_linux_$ARCH.tar.gz" \
  && tar -xf /tmp/dapr.tgz \
  && chmod +x /tmp/dapr \
  && mv /tmp/dapr /usr/bin/dapr

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app

CMD ["npm", "run", "start"]
