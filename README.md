# 📚 Student Task Manager API

A RESTful API for managing student tasks with JWT-based authentication. Built with Node.js, Express, and MongoDB.

**🌐 Live API:** [https://student-task-manager-api-1.onrender.com](https://student-task-manager-api-1.onrender.com)

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)

---

## 🚀 Getting Started (Run Locally)

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/DeShyam01/student-task-manager-api.git
cd student-task-manager-api

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

Server will start at `http://localhost:3000`

---

## 📡 API Endpoints

### Base URL
```
https://student-task-manager-api-1.onrender.com
```

> **Note:** All `/tasks` routes require a valid JWT token in the `Authorization` header:
> ```
> Authorization: Bearer <your_token>
> ```

---

### 🔐 Auth Routes — `/api/v1/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/user/register` | ❌ | Register a new user |
| `POST` | `/api/v1/user/login` | ❌ | Login and get JWT token |
| `GET` | `/api/v1/user/profile` | ✅ | Get logged-in user's profile |

#### `POST /api/v1/user/register`
```json
// Request Body
{
  "name": "Shyam",
  "email": "shyam@example.com",
  "password": "yourpassword"
}

// Response 201
{
  "message": "User registered successfully",
  "token": "<jwt_token>"
}
```

#### `POST /api/v1/user/login`
```json
// Request Body
{
  "email": "shyam@example.com",
  "password": "yourpassword"
}

// Response 200
{
  "token": "<jwt_token>"
}
```

#### `GET /api/v1/user/profile` 🔒
```json
// Response 200
{
  "_id": "64abc...",
  "name": "Shyam",
  "email": "shyam@example.com",
  "role": "student",
  "createdAt": "2025-03-01T00:00:00.000Z",
  "updatedAt": "2025-03-01T00:00:00.000Z"
}
```

---

### ✅ Task Routes — `/api/v1/tasks`

All task routes are **protected** — include the JWT token in every request.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/tasks` | ✅ | Get all tasks for logged-in user |
| `GET` | `/api/v1/tasks/:id` | ✅ | Get a specific task by ID |
| `POST` | `/api/v1/tasks` | ✅ | Create a new task |
| `PUT` | `/api/v1/tasks/:id` | ✅ | Update a task |
| `PATCH` | `/api/v1/tasks/:id/complete` | ✅ | Mark a task as complete |
| `DELETE` | `/api/v1/tasks/:id` | ✅ | Delete a task |

#### `GET /api/v1/tasks` 🔒
```json
// Response 200
[
  {
    "_id": "64xyz...",
    "title": "Complete DSA assignment",
    "description": "Solve linked list problems",
    "dueDate": "2025-03-10T00:00:00.000Z",
    "priority": 1,
    "status": "Pending",
    "userId": "64abc...",
    "createdAt": "2025-03-01T00:00:00.000Z",
    "updatedAt": "2025-03-01T00:00:00.000Z"
  }
]
```

#### `POST /api/v1/tasks` 🔒
```json
// Request Body
{
  "title": "Complete DSA assignment",
  "description": "Solve linked list problems",
  "dueDate": "2025-03-10",
  "priority": 1
}
// priority: 1 = High, 2 = Medium, 3 = Low

// Response 201
{
  "_id": "64xyz...",
  "title": "Complete DSA assignment",
  "description": "Solve linked list problems",
  "dueDate": "2025-03-10T00:00:00.000Z",
  "priority": 1,
  "status": "Pending",
  "userId": "64abc...",
  "createdAt": "2025-03-01T00:00:00.000Z",
  "updatedAt": "2025-03-01T00:00:00.000Z"
}
```

#### `PUT /api/v1/tasks/:id` 🔒
```json
// Request Body (all fields optional)
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2025-03-15",
  "priority": 2
}

// Response 200
{
  "_id": "64xyz...",
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2025-03-15T00:00:00.000Z",
  "priority": 2,
  "status": "Pending",
  "userId": "64abc...",
  "createdAt": "2025-03-01T00:00:00.000Z",
  "updatedAt": "2025-03-05T00:00:00.000Z"
}
```

#### `PATCH /api/v1/tasks/:id/complete` 🔒
```json
// Response 200
{
  "_id": "64xyz...",
  "title": "Complete DSA assignment",
  "status": "completed",
  "updatedAt": "2025-03-05T00:00:00.000Z"
}
```

#### `DELETE /api/v1/tasks/:id` 🔒
```json
// Response 200
{
  "message": "Task deleted successfully"
}
```

---

## 📁 Project Structure

```
student-task-manager-api/
├── src/
│   ├── controllers/
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Tasks.js
│   │   └── Users.js
│   └── routes/
│       ├── taskRoutes.js
│       └── userRoutes.js
├── server.js
├── package.json
├── .env
└── .gitignore
```

---

## 🗃️ Data Models

### User
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | String | ✅ | |
| `email` | String | ✅ | Unique |
| `password` | String | ✅ | Stored hashed |
| `role` | String | ✅ | `"student"` (default) or `"admin"` |
| `createdAt` | Date | — | Auto-set |
| `updatedAt` | Date | — | Auto-set |

### Task
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | String | ✅ | |
| `description` | String | ✅ | |
| `dueDate` | Date | ✅ | |
| `priority` | Number | ✅ | `1` = High, `2` = Medium, `3` = Low |
| `status` | String | ✅ | `"Pending"` (default) or `"completed"` |
| `userId` | ObjectId | ✅ | Ref to User — auto-set from JWT |
| `createdAt` | Date | — | Auto-set |
| `updatedAt` | Date | — | Auto-set |

---

## 🔒 Authentication Flow

1. Register via `POST /api/v1/user/register` → receive JWT token
2. Login via `POST /api/v1/user/login` → receive JWT token
3. Include token in all protected requests:
   ```
   Authorization: Bearer <token>
   ```

