FROM node:alpine

WORKDIR /app

COPY src/ ./src/
COPY public/ ./public/
COPY pack*.json ./
COPY tsconfig.json .
COPY create-env-file.sh ./create-env-file.sh

RUN npm i

# Add as many arguments as you want to pass environment variables 
#   and use an ARG command for each one, so Dockerfile context will grab it from --build-arg

ARG REACT_APP_ENV
ARG REACT_APP_BACKEND_URL

RUN sh create-env-file.sh "REACT_APP_ENV=$REACT_APP_ENV" "REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL"

# If you want to debug the .env file, uncomment the following line
CMD ["cat", ".env"]

RUN npm run build

RUN npm i -g serve

EXPOSE 3000

CMD ["serve", "-s", "build"]