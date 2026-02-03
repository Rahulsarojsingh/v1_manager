# Project Manager App

This is a full-stack project management application with a Next.js frontend and a FastAPI backend.

## Structure

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Shadcn UI
- **Backend**: FastAPI, SQLite, SQLAlchemy

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.10 or higher)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   python main.py
   ```
   The backend will start at `http://127.0.0.1:8000`.

## Frontend Setup

1. Navigate to the project root (if not already there):
   ```bash
   cd ..
   # or just stay in root
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:3000`.

## Features

- **Authentication**: User signup and login with JWT.
- **Project Management**: Create, update, delete projects.
- **Master Data**: Manage Team Members, Contractors, Suppliers, etc.
- **Data Persistence**: All data is stored in a local SQLite database (`backend/sql_app.db`).

## API Documentation

Once the backend is running, you can access the interactive API docs at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
