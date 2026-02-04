# Project Manager App

This is a full-stack project management application with a Next.js frontend and a FastAPI backend.

## Structure

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Shadcn UI
- **Backend**: FastAPI, PostgreSQL, SQLAlchemy

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.10 or higher)
- Docker & Docker Compose (optional, for containerized deployment)

## Docker Setup (Recommended)

To run the entire application (Frontend + Backend + Database) using Docker:

1.  **Ensure Docker Desktop is running.**
2.  Run the following command in the project root:
    ```bash
    docker-compose up --build
    ```
3.  The application will be available at:
    - Frontend: `http://localhost:3000`
    - Backend Docs: `http://localhost:8000/docs`

**Troubleshooting:**
If you see an error like `The system cannot find the file specified` or `error during connect`, it means **Docker Desktop is not running**. Please start Docker Desktop and try again.

## Local Development Setup

If you prefer to run locally without Docker:

### Backend Setup

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

4. Configure Database:
   - Make sure you have PostgreSQL running locally.
   - Update `.env` file with your local credentials.
   - Or, revert `database.py` to use SQLite if you prefer.

5. Run the server:
   ```bash
   python main.py
   ```
   The backend will start at `http://127.0.0.1:8000`.

### Frontend Setup

1. Navigate to the project root:
   ```bash
   cd ..
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
- **Data Persistence**: Data is stored in PostgreSQL (or SQLite if configured).

## API Documentation

Once the backend is running, you can access the interactive API docs at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
