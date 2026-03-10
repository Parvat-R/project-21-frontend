FROM node:20-alpine

WORKDIR /usr/home/frontend

COPY package*.json ./
RUN npm install

COPY . .

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

ENV NODE_ENV=production

RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=80

EXPOSE 80

CMD ["npm", "run", "start"]