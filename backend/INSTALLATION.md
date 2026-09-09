# ⚙️ Backend Installation

## 📋 Prerequisites

Make sure you have:

* Node.js 20 or later
* npm
* PostgreSQL

## 📥 Clone the Repository

```bash
git clone https://github.com/Dheerendra69/LLD-Practice-Platform.git
```

Navigate to the project:

```bash
cd LLD-practice-platform
```

Navigate to the backend:

```bash
cd backend
```

## 📦 Install Dependencies

```bash
npm install
```

## ⚙️ Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env

PORT=3001
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=
DB_PASSWORD=
DB_NAME=lld_practice_platform
GEMINI_API_KEY=
GEMINI_MODEL_PRIMARY=
GEMINI_MODEL_FALLBACK=
GEMINI_MODEL_FINAL=

```


## 🗄️ Database Setup

Create a PostgreSQL database:

```text
lld_practice_platform
```

Update the database credentials in your `.env` file.

## 🚀 Start Development Server

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3001
```

## 📚 API Documentation

If Swagger is enabled, open:

```text
http://localhost:3001/api
```

## 🏗️ Build the Application

```bash
npm run build
```

## ▶️ Run Production Build

```bash
npm run start:prod
```
