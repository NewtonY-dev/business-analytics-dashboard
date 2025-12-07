# Business Analytics Dashboard

A full-stack web application that helps small and medium businesses track sales performance, analyze trends, and manage products through an intuitive dashboard interface.

## Project Purpose / Problem It Solves

Small and medium businesses often struggle to make data-driven decisions because they lack affordable analytics tools. This dashboard solves that by providing:

- **Real-time insights** into sales performance and trends
- **Product management** capabilities without expensive software
- **Visual analytics** to quickly understand business health
- **Role-based access** for secure team collaboration

Instead of relying on spreadsheets or expensive enterprise solutions, businesses can use this dashboard to track KPIs, identify top-performing products, and manage inventory—all in one place.

## Features

- **Key Performance Indicators (KPIs)**: Track revenue, sales count, and other critical metrics
- **Sales Trend Analysis**: Visualize sales performance over time with interactive charts
- **Top Products**: Identify best-selling products and their performance
- **Product Management** (Admin): Create, read, update, and delete products
- **Sales Management** (Admin): Add, edit, and manage sales records
- **Data Export**: Export analytics data for external analysis
- **User Authentication**: Secure login and signup with role-based access control
- **Protected Routes**: Dashboard access restricted to authenticated users
- **Admin Panel**: Dedicated interface for administrative tasks

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Relational database (via mysql2)
- **JWT** (jsonwebtoken) - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **Material-UI** - Component library
- **Recharts** - Charting library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management for authentication

## System Overview

The application follows a client-server architecture:

1. **Frontend** (React + Vite) runs on `http://localhost:5173` and handles the user interface
2. **Backend** (Express + Node.js) runs on `http://localhost:5000` and provides RESTful APIs
3. **Database** (MySQL) stores users, products, sales, and analytics data
4. **Authentication Flow**: Users sign up/login → receive JWT token → token stored in Context → used for protected API calls
5. **Admin Flow**: Admin users can access `/admin` route to manage products and sales
6. **Analytics Flow**: Dashboard fetches aggregated data from backend → displays charts and KPIs

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` directory (see Environment Variables section)

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=your_database_name

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here
```

**Important**: Replace all placeholder values with your actual MySQL credentials and generate a secure JWT secret.

## Running the Project

### Start Backend Server

From the `backend` directory:

```bash
npm start
```

The server will run on `http://localhost:5000`

### Start Frontend Development Server

From the `frontend` directory:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Access the Application

1. Open your browser and go to `http://localhost:5173`
2. Sign up for a new account or log in with existing credentials
3. Navigate the dashboard to view KPIs, sales trends, and top products
4. Admin users can access `/admin` to manage products and sales

## Folder Structure

```
business-analytics-dashboard/
├── backend/
│   ├── controllers/     # Business logic handlers
│   ├── db/             # Database configuration
│   ├── middlewares/    # Authentication & authorization
│   ├── routes/         # API route definitions
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── contexts/   # React Context (Auth)
    │   ├── pages/      # Page components
    │   ├── services/   # API service functions
    │   └── App.jsx     # Main app component
    └── vite.config.js  # Vite configuration
```

## License

MIT License - See LICENSE file for details

```

```
