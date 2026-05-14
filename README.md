# 🎓 Smart Event Management System

> A web-based platform to streamline college event planning, registration, and management — built with React, Node.js, Express.js, and JWT.

---

## 📌 About The Project

The **Smart Event Management System** is a full-stack web application developed as a college micro project. It provides a centralized digital platform for students, event organizers, and administrators to manage the entire lifecycle of college events — from creation and registration to attendance tracking and certificate generation.

This system eliminates the need for manual paperwork, notice boards, and scattered spreadsheets by bringing everything under one smart, unified platform.

---

## 🎯 Objectives

- Simplify the process of creating and publishing college events
- Enable students to discover and register for events online
- Provide administrators with a powerful dashboard for oversight
- Automate notifications, attendance tracking, and certificate generation
- Maintain a complete digital record of all college events

---

## ✨ Key Features

- 🗓️ **Event Creation & Management** — Create, edit, and publish events with full details
- 📝 **Online Registration** — Students can register for events with one click
- 👥 **Role-Based Access Control** — Separate portals for Admin, Organizer, and Student
- 🔐 **JWT Authentication** — Secure login and session management
- 📊 **Admin Dashboard** — Real-time statistics and event analytics
- 📢 **Notifications** — Email alerts for registrations and event reminders
- 🏷️ **Event Categories** — Filter by Cultural, Technical, Sports, Workshop, and more
- 📋 **Feedback System** — Collect and view post-event feedback and ratings
- 📅 **Calendar View** — Visual calendar of all upcoming events
- 🖨️ **Certificate Generation** — Auto-generate participation certificates as PDF

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — Component-based UI
- **CSS3 / Tailwind CSS** — Styling and responsive design
- **Axios** — API communication

### Backend
- **Node.js** — Runtime environment
- **Express.js** — RESTful API framework
- **JWT (JSON Web Tokens)** — Authentication & authorization

### Database
- **MySQL / MongoDB** — Data storage *(to be finalized)*

### Dev Tools
- **Git & GitHub** — Version control
- **Postman** — API testing
- **VS Code** — Code editor
- **Chart.js** — Dashboard analytics
- **jsPDF** — Certificate generation

---

## 👥 User Roles

### 🔴 Admin
- Full access to the system
- Manage users, events, and categories
- View analytics, reports, and feedback
- Approve or reject event proposals

### 🟡 Organizer / Faculty
- Create and manage their own events
- View and export participant lists
- Send announcements to registered students

### 🟢 Student
- Browse, search, and filter events
- Register and unregister for events
- Submit feedback after events
- Download participation certificates

---

## 📁 Project Structure

```
Smart-Event-Management-System/
│
├── frontend/                   # React Application
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route-level pages
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Events.jsx
│       │   └── Profile.jsx
│       ├── context/            # Auth context (JWT)
│       ├── services/           # API calls (Axios)
│       ├── App.jsx
│       └── main.jsx
│
├── backend/                    # Node.js + Express API
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── users.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── config/
│   │   └── db.js
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🗃️ Database Schema

### Users
| Column | Type | Description |
|--------|------|-------------|
| user_id | INT (PK) | Unique user ID |
| name | VARCHAR | Full name |
| email | VARCHAR | College email |
| password | VARCHAR | Hashed password |
| role | ENUM | admin / organizer / student |
| department | VARCHAR | Department name |

### Events
| Column | Type | Description |
|--------|------|-------------|
| event_id | INT (PK) | Unique event ID |
| title | VARCHAR | Event title |
| description | TEXT | Event details |
| date | DATETIME | Event date & time |
| venue | VARCHAR | Location |
| capacity | INT | Max participants |
| category | VARCHAR | Event category |
| organizer_id | INT (FK) | Linked organizer |
| status | ENUM | upcoming / ongoing / completed |

### Registrations
| Column | Type | Description |
|--------|------|-------------|
| reg_id | INT (PK) | Registration ID |
| event_id | INT (FK) | Linked event |
| user_id | INT (FK) | Linked student |
| registered_at | TIMESTAMP | Registration time |
| attendance | BOOLEAN | Attended or not |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- MySQL or MongoDB
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Parusa123/Smart-Event-Management-System.git
cd Smart-Event-Management-System

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Fill in your DB credentials and JWT secret in .env

# 3. Setup Frontend
cd ../frontend
npm install

# 4. Setup Database
mysql -u root -p < database/schema.sql

# 5. Run Backend
cd ../backend
npm run dev

# 6. Run Frontend (in a new terminal)
cd ../frontend
npm run dev
```

Visit: `http://localhost:5173` (Frontend) and `http://localhost:3000` (Backend API)

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event (Organizer) |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/:id/register` | Register for event |
| GET | `/api/events/:id/participants` | Get participants list |
| DELETE | `/api/events/:id/register` | Cancel registration |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/role` | Update user role |

---

## 🔮 Future Enhancements

- [ ] QR Code-based attendance check-in
- [ ] Mobile App (React Native)
- [ ] AI-powered event recommendations
- [ ] Online payment integration for paid events
- [ ] Live event streaming support
- [ ] Integration with college ERP/LMS

---

## 👨‍💻 Team Members

| Name | Roll No. | Role |
|------|----------|------|
| Member 1 | — | Frontend Developer |
| Member 2 | — | Backend Developer |
| Member 3 | — | Database Designer |
| Member 4 | — | UI/UX & Documentation |

> *Update with your actual names and roll numbers*

---

## 🏫 Project Info

| Field | Details |
|-------|---------|
| Institution | *Your College Name* |
| Department | *Computer Science / IT* |
| Subject | *Micro Project — [Subject]* |
| Academic Year | 2025–2026 |
| Guide / Mentor | *Prof. Name* |

---

## 📄 License

This project is developed purely for **academic purposes**. Not intended for commercial use.

---

## 🙏 Acknowledgements

- Our project mentor for guidance and feedback
- The open-source community for the amazing tools and libraries
- Our college for providing the opportunity to build this project

---


