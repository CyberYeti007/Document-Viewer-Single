# Test Users for MTM-MS Application

## 🚀 Quick Start

The app is currently running at: **http://localhost:3001**

## 👥 Test User Credentials

Three test users have been created with different access levels:

### 1. Admin User
- **Email:** admin@test.com
- **Password:** admin123
- **Role:** System Administrator
- **Access Level:** 1 (Highest)
- **Can Approve:** Yes

### 2. Regular User
- **Email:** user@test.com
- **Password:** user123
- **Role:** Quality Analyst
- **Access Level:** 3 (Medium)
- **Can Approve:** No

### 3. Approver User
- **Email:** approver@test.com
- **Password:** approver123
- **Role:** Quality Manager
- **Access Level:** 2 (High)
- **Can Approve:** Yes

## 📋 Features to Test

With these users, you can test:
- Different access levels and permissions
- Document approval workflow (admin and approver can approve)
- Document viewer with security classifications
- File upload and management
- Team and folder organization

## 🔄 Re-create Users

If you need to recreate the test users:

```bash
node create-user.js
```

## 📊 View Database

To view and manage users in the database:

```bash
npx prisma studio
```

This will open a web interface at http://localhost:5555 where you can:
- View all users
- Edit user details
- Create new users manually
- View other database tables

## ⚠️ Note

- The app is using SQLite for quick testing (no PostgreSQL needed)
- MongoDB features (file storage) will work if MongoDB is running, but are optional for basic testing
- The development server is running on port 3001 (port 3000 was busy)