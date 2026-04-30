<div align="center">
  <img src="https://img.shields.io/badge/KanuTech-Pro-00A8E8?style=for-the-badge&logo=react" alt="KanuTech Pro Logo" />
  <h1>🚀 KanuTech Pro</h1>
  <p><strong>The Enterprise Work OS & Next-Generation Collaborative Project Management Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>
</div>

<hr />

## 🌟 Overview

**KanuTech Pro** is an elite, full-stack project management platform engineered to mirror the complexity, scalability, and aesthetic polish of enterprise software like Jira, Asana, and Monday.com. 

Built with a heavy emphasis on a premium **Glassmorphism UI** and **dynamic micro-animations**, it provides teams with a stunning, real-time environment to track tasks, manage workflows, and analyze performance.

## ✨ Key Features

- **⚡ Real-Time Kanban Boards**: Drag-and-drop task management powered by `@dnd-kit` and instantly synchronized across all connected clients via `Socket.io`.
- **📊 Advanced Analytics**: Visual charting of task distributions, project progress, and efficiency trends with one-click exports to PDF and PNG.
- **🛡️ Secure Authentication**: Robust JWT-based authentication system with secure HttpOnly refresh cookies and encrypted password storage.
- **🔐 Role-Based Access Control (RBAC)**: Comprehensive permission tiers (Super Admin, Org Admin, Project Manager, Member, Guest).
- **🎛️ Dedicated Admin Console**: A secure portal for super-administrators to monitor system health (API, DB, WebSockets), manage users, and review activity logs.
- **🎨 Premium UI/UX**: Designed with a sleek dark mode, frosted glass components (glassmorphism), interactive onboarding tours, and highly responsive Framer Motion animations.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit (RTK)
- **Styling**: Tailwind CSS & Framer Motion
- **Drag & Drop**: dnd-kit
- **Charts**: Recharts

### Backend (Server)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas & Mongoose
- **Real-Time Engine**: Socket.io
- **Security**: JWT, bcrypt, Helmet, CORS
- **Validation**: Zod

---

## 🚀 Getting Started

Follow these steps to run KanuTech Pro locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Kenenisaboru/Project-Management-Platform_codealpha.git
cd Project-Management-Platform_codealpha
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```
Start the frontend development server:
```bash
npm run dev
```

**The application will now be running at `http://localhost:3000`!**

---

## 📸 Screenshots

Here is a look at the KanuTech Pro premium interface in action:

### Landing Page & Features
![Landing Page & Features](./screenshots/landing-hero.png)
<br/>
![Features Detail](./screenshots/landing-features.png)

### Dashboard Overview
![Dashboard Overview](./screenshots/dashboard.png)

### My Tasks
![My Tasks](./screenshots/my-tasks.png)

### Settings & Profile
![Settings](./screenshots/settings.png)

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Kenenisaboru/Project-Management-Platform_codealpha/issues).

## 📄 License
This project is licensed under the MIT License.

---
<div align="center">
  <i>Built with passion to dominate the portfolio space.</i>
</div>
