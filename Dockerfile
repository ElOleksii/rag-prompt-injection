FROM node:22-slim

# onnxruntime-node (via @huggingface/transformers) needs libgomp at runtime
RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]