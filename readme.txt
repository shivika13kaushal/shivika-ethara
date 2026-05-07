Team Task Manager (MERN Stack)
==============================

This project is a Full-Stack Team Task Manager built with MongoDB, Express.js, React, and Node.js. 
It features a customized, premium vanilla CSS design (no Tailwind) and is configured for deployment on Railway.

Features
--------
- Role-Based Access Control (Admin vs Member)
- Admins can create projects and assign tasks
- Members can update their assigned task statuses (Pending -> In Progress -> Completed)
- JWT Authentication and password hashing
- Custom built, glassmorphism-inspired UI
- Express-based static server for robust frontend deployment on platforms like Railway

Directory Structure
-------------------
/backend:
  Node.js API running Express and Mongoose.
  Contains all the data models, routes, and authentication middleware.

/frontend:
  React Application built with Vite.
  Uses a global AuthContext and an Axios interceptor for managing sessions.

Local Development
-----------------
To run this project locally on your machine:

1. MongoDB Setup:
   Ensure you have a MongoDB instance running locally (mongodb://localhost:27017/ethara_mern)
   or paste your MongoDB Atlas URI into the backend/.env file.

2. Start the Backend:
   cd backend
   npm install
   npm run dev
   (The backend will start on http://localhost:5000)

3. Start the Frontend:
   cd frontend
   npm install
   npm run dev
   (The frontend will start on http://localhost:5173)

Railway Deployment
------------------
This repository is configured for two separate service deployments on Railway.

1. Backend Service:
   - Connect Railway to this repository and set the Root Directory to /backend.
   - Set the Environment Variables: MONGO_URI (your database connection string) and JWT_SECRET.
   - Railway will automatically detect the start script and run it.

2. Frontend Service:
   - Connect Railway to this repository and set the Root Directory to /frontend.
   - Ensure baseURL in frontend/src/api/axios.js points to your deployed backend URL.
   - Railway will build the React app and launch the custom Express server to serve the frontend.
