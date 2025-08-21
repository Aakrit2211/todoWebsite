# Full Stack Todo App with Authentication

## Complete Setup Guide

### 1. Database Setup (PostgreSQL)

First, install PostgreSQL on your system, then run these queries:

```sql
-- Create database
CREATE DATABASE todoapp;

-- Connect to the database
\c todoapp;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create todos table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_todos_user_id ON todos(user_id);
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add these redirect URIs:
   - `http://localhost:3000/auth/google/callback`
7. Copy your Client ID and Client Secret

### 3. Environment Variables

Create a `.env` file in your project root:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=todoapp
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Session Secret (use any random string)
SESSION_SECRET=your_super_secret_session_key_here
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

**Start Backend Server:**
```bash
npm run server
```

**Start Frontend (in another terminal):**
```bash
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
 Backend API: http://localhost:3000

## Features

- ✅ Google OAuth authentication
- ✅ Local email/password authentication  
- ✅ Password hashing with bcrypt
- ✅ PostgreSQL database with pg.Client()
- ✅ Session management
- ✅ Protected API routes
- ✅ User-specific todos
- ✅ CRUD operations for todos

## API Endpoints

### Authentication
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/register` - Register with email/password
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout
- `GET /auth/user` - Get current user

### Todos
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## Useful PostgreSQL Commands

```sql
-- View all users
SELECT * FROM users;

-- View all todos with user information
SELECT t.*, u.name as user_name, u.email 
FROM todos t 
JOIN users u ON t.user_id = u.id;

-- Count todos per user
SELECT u.name, u.email, COUNT(t.id) as todo_count 
FROM users u 
LEFT JOIN todos t ON u.id = t.user_id 
GROUP BY u.id, u.name, u.email;

-- Delete all todos for a specific user
DELETE FROM todos WHERE user_id = 1;

-- Delete a user and all their todos (CASCADE will handle todos)
DELETE FROM users WHERE id = 1;

-- Update todo completion status
UPDATE todos SET completed = TRUE WHERE id = 1;

-- Find incomplete todos
SELECT * FROM todos WHERE completed = FALSE;

-- Drop tables (if needed to reset)
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS users;
```

## Troubleshooting

### Common Issues:

1. **Database connection error**: Check your PostgreSQL is running and credentials in `.env` are correct
2. **Google OAuth not working**: Verify your Google Client ID/Secret and redirect URI
3. **CORS errors**: Make sure both frontend (5173) and backend (5000) are running
4. **Session issues**: Check your SESSION_SECRET is set in `.env`

### Reset Database:
```sql
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS users;
-- Then run the CREATE TABLE commands again
```