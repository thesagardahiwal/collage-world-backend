# Collage World Backend

## 📌 Project Overview
Collage World Backend is a Node.js and Express-based backend server designed for handling authentication, media uploads, and real-time communication using WebSockets.

## 🚀 Features
- User authentication with JWT
- Secure password hashing using bcryptjs
- MongoDB database connection with Mongoose
- File uploads via Multer & Cloudinary
- Real-time communication with Socket.io
- CORS enabled for secure API requests

## 🛠️ Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **Cloudinary** (for media uploads)
- **Multer** (for handling file uploads)
- **JWT** (for authentication)
- **Socket.io** (for real-time communication)

## 📦 Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/collage-world-backend.git
   cd collage-world-backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## 🚀 Running the Server

Start the development server with Nodemon:
```sh
npm start
```

## 🤝 Contributing
Feel free to submit pull requests and issues. Contributions are welcome!

## 📝 License
This project is licensed under the ISC License.

---
🚀 Happy Coding!

