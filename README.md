# Learning Management System (LMS)
---


A full-stack **Learning Management System (LMS)** built with the **MERN stack**.  
This platform allows students to purchase courses, track their progress, and interact with learning content, while instructors can manage courses and monitor learners.


![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-MERN-blue)
![Version](https://img.shields.io/badge/v-1.0.0-blue)

---

## 🚀 Tech Stack

**Frontend:** React.js (Vite), TailwindCSS, Redux, Shadcn UI, Vercel deployment  
**Backend:** Node.js, Express.js, MongoDB Atlas, Render deployment  
**Authentication:** JWT-based auth  
**File Storage (if used):** Cloudinary
**Database:** MongoDB Atlas

---

## 📋 Future Enhancements


- [ ] Certificate Generation after course completion

- [ ] Discussion Forum & Q&A for students

- [ ] Live Classes / Webinars Integration

- [ ] Multi-language Support for international learners


---
## ✨ Features

- 👨‍🎓 **Student Module**
    
    - Browse and purchase courses
        
    - Track course progress
        
    - Resume learning anytime
        
- 👩‍🏫 **Instructor Module**
    
    - Create, update, and delete courses
        
    - Upload video lectures and track payments
    - Admin Dashboard
        
- 🔐 **Authentication & Authorization**
    
    - JWT-based secure login/signup
        
    - Role-based access control (Student/Instructor)
        
- ⚡ **Other Features**
    
    - Payment Integration
        
    - Responsive UI with TailwindCSS and Shadcn UI
        
    - RESTful API structure
        

---

## 📂 Project Structure

```bash
lms-project/
│
├── client/             # React frontend (Vite)
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── server/             # Node.js backend (Express + MongoDB)
│   ├── src/
│   ├── .env
│   └── package.json
│
└── README.md           # Documentation
```
---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```js
PORT=8080 
MONGO_URI=your_mongodb_connection 
JWT_SECRET=your_jwt_secret 
CLOUDINARY_CLOUD_NAME=xxxx 
CLOUDINARY_API_KEY=xxxx 
CLOUDINARY_API_SECRET=xxxx 
FRONTEND_URL=http://localhost:5173  
```

### Frontend (`client/.env`)

`VITE_API_BASE_URL=http://localhost:8080/api/v1`

In production (Vercel settings → Environment Variables):

`VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1`

---

## 🛠️ Installation & Setup

### Clone the repository

`git clone https://github.com/yourusername/lms-project.git cd lms-project`

### Backend Setup

`cd server npm install npm run dev`

### Frontend Setup

`cd client npm install npm run dev`

---

## 🚀 Deployment

- **Backend:** Deployed on Render
    
- **Frontend:** Deployed on Vercel
    

---

## 📡 API Endpoints

Base URL:

`/api/v1`

Example routes:

- `POST /auth/signup` → Register user
    
- `POST /auth/login` → Login user
    
- `GET /courses` → Get all courses
    
- `POST /purchase` → Purchase a course
    
- `GET /progress/:courseId` → Track progress
    

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
    
2. Create a new branch: `git checkout -b feature/YourFeature`
    
3. Commit your changes: `git commit -m 'Add feature'`
    
4. Push to branch: `git push origin feature/YourFeature`
    
5. Open a Pull Request
    

---

  

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
