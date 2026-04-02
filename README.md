# Task Management System

A full-stack task management system built with **React** and **ASP.NET Core Web API**, designed to manage projects, tasks, and comments with filtering, sorting, and real-time updates.

---

## 🚀 Features

### Project Management
- Create Project
- Edit Project
- Delete Project (cascade delete)

### Task Management
- Create Task
- Edit Task
- Delete Task
- Filter by status / assigned user
- Sort by multiple fields
- Auto refresh after operations

### Comment System
- Add Comment
- Delete Comment (only by owner)

### UX Features
- Auto-select newly created items
- Auto refresh after CRUD operations
- Loading / disabled states
- Overlay-based UI

---

## 🛠 Tech Stack

Frontend:
- React (Hooks)
- Vite
- Bootstrap

Backend:
- ASP.NET Core Web API
- Entity Framework Core

Database:
- SQL Server

---

## ⚡ Getting Started

### Backend
1. Open solution in Visual Studio
2. Configure connection string
3. Run API

### Frontend
cd frontend
npm install
npm run dev

---

## 🔐 Environment Variables

VITE_API_BASE_URL=http://localhost:5000/api

---

## 🧪 Demo Flow

1. Select project → tasks update
2. Create task → auto select
3. Edit task
4. Add comment
5. Delete comment
6. Filter / sort
7. Delete task
8. Create project → auto switch

---

## 🎯 Design Highlights

- RESTful API design
- Clean separation (Controller / Service / DTO)
- State-driven UI
- Consistent naming
- Overlay interaction
