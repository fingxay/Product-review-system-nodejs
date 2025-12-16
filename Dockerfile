# 1. Dùng Node.js LTS
FROM node:18

# 2. Tạo thư mục làm việc trong container
WORKDIR /app

# 3. Copy package.json trước (tối ưu cache)
COPY package*.json ./

# 4. Cài dependencies
RUN npm install

# 5. Copy toàn bộ source code
COPY . .

# 6. Expose port backend
EXPOSE 3000

# 7. Chạy server
CMD ["node", "project/server.js"]
