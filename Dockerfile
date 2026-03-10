FROM node:24-alpine
WORKDIR /usr/home/frontend

COPY package*.json ./
RUN npm install
RUN npm cache clean --force

COPY . .

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_JWT_SECRET

ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_JWT_SECRET=${NEXT_PUBLIC_JWT_SECRET}

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"] 