# 💧 API for Water Tracker App

## 🚀 Team Project

This is the backend for the Water Tracker App. The API handles user authentication, water intake tracking, and statistics retrieval, allowing users to add, edit, delete their water intake portions, and manage personal information like avatars and daily water intake goals.

### 🚀 Features

- 🔐 **User authentication**: Register, Login and logout functionality with JWT.
- 👤 **User operations**: Update user information, including name, email and password.
- 🥤 **Update daily water goal**: Change the target for daily water intake.
- 🛠️ **Cloud storage**: Upload and manage user avatars using Cloudinary.
- 💦 **Track water intake**: Add, edit, or delete water intake portions.
- 📊 **Water statistics**: Retrieve daily and monthly statistics for water intake.
- 🔄 **Error handling**: Manage HTTP errors and validation with Joi.
- 📜 **Swagger UI**: API documentation available through Swagger UI for easy integration and testing.

### 🛠️ Technologies

- **bcrypt** - For hashing passwords securely
- **cloudinary** - For storing user avatars in the cloud
- **cors** - To enable Cross-Origin Resource Sharing
- **dotenv** - For managing environment variables
- **express** - Web framework for building the API
- **http-errors** - For creating standardized error responses
- **joi** - For request validation
- **jsonwebtoken** - For handling JSON Web Tokens (JWT) authentication
- **moment** - For date and time formatting
- **mongoose** - MongoDB object modeling
- **multer** - For handling file uploads
- **pino-http** - For logging HTTP requests and responses
- **swagger-ui-express** - For serving Swagger API documentation

### 🌍 Live Pages

- **Backend**: [Live API backend](https://project-group-05-backend.onrender.com/)
- **API Documentation**: [API Documentation](https://project-group-05-backend.onrender.com/api-docs/)
- **Frontend**: [Live frontend](https://water-tracker-dusky.vercel.app/)

## 👥 Team

- **👩‍💻 Mariia Ostapets** - Role: Team lead, Backend Developer (server, database, utils, middlewares, swagger)
- **👨‍💻 Anatolii Don** - Role: Backend Developer (auth, user operations)
- **👨‍💻 SSovelich** - Role: Backend Developer (water operations)
