Online Service Booking Platform

A full-stack MERN application that enables users to book services online with secure role-based access control for Users, Service Providers, and Admins.

Overview

This platform provides a complete service-booking workflow:

Users can browse services, make bookings, and leave reviews

Service Providers manage assigned bookings

Admins control users, services, and system data

Built with scalability, security, and clean architecture in mind.

Core Features

JWT-based Authentication & Authorization

Role-based access (User, Provider, Admin)

Service booking with status tracking

Review and rating system

Admin dashboard for full system management

Responsive UI using modern frontend tools

Tech Stack

Frontend

React (Vite)

Tailwind CSS

React Router

Backend

Node.js

Express.js

MongoDB (Mongoose)

Authentication

JSON Web Tokens (JWT)

Project Structure
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
├── frontend
│   ├── src
│   ├── package.json
│   └── vite.config.js
└── README.md

Getting Started
Backend Setup
cd backend
npm install
npm start


Create .env:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development

Frontend Setup
cd frontend
npm install
npm run dev


Create .env:

VITE_API_URL=http://localhost:5000/api

User Roles
User

Register & login

View and book services

Track booking status

Add and manage reviews

Service Provider

View assigned bookings

Update booking status

Admin

Manage users and providers

Create, update, and delete services

View all bookings

Security

Password hashing with bcrypt

JWT-protected routes

Role-based authorization

Environment-based configuration
