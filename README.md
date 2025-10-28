# 🎬 Favorite Movies & TV Shows Web Application

A full-stack web application to manage your favorite movies and TV shows with features like add, edit, delete, and infinite scroll.

---

## 🧠 Project Overview

This project consists of two main parts:
1. **Backend** - Node.js + Express + MySQL + Prisma + Zod  
2. **Frontend** - React + Vite + TypeScript + TailwindCSS

---

## 📁 Folder Structure


favorite-movies/
│
├── backend/ # Node.js backend (API + Prisma + MySQL)
├── frontend/ # React + Vite frontend (UI + Infinite Scroll)
└── README.md # Combined root documentation


---

## 🚀 Live Demos (if deployed)
- Frontend: [https://your-frontend-demo-link.com](#)
- Backend API: [https://your-backend-demo-link.com](#)

---

## 🧩 Tech Stack

**Frontend:**
- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios
- Toast Notifications

**Backend:**
- Node.js + Express
- Prisma ORM
- MySQL
- Zod Validation
- TypeScript

---

## 🧰 Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/<your-username>/favorite-movies.git
cd favorite-movies


cd backend
npm install
# configure .env file for MySQL
DATABASE_URL="mysql://username:password@localhost:3306/movies_db"

npx prisma generate
npx prisma migrate dev --name init
npm run dev


cd ../frontend
npm install
npm run dev



---

## 🌍 Step 3: Create the GitHub Repo

1. Go to [https://github.com/new](https://github.com/new)
2. **Repository name:** `favorite-movies`
3. **Description:** `Full-stack web app for managing favorite movies and TV shows (React + Node + MySQL)`
4. Set to **Public**
5. Don’t initialize with README or .gitignore (we already have them)
6. Click **Create repository**

---

## 💻 Step 4: Initialize Git and Push Code

Open a terminal in your `favorite-movies` folder and run:

```bash
# Initialize Git
git init

# Add remote origin (replace <your-username>)
git remote add origin https://github.com/<your-username>/favorite-movies.git

# Stage all files
git add .

# Commit changes
git commit -m "Initial commit - Favorite Movies & TV Shows full-stack app"

# Push to GitHub main branch
git branch -M main
git push -u origin main
