# 📊 SheetSavvy – Excel Analytical Platform

**SheetSavvy** is a modern full-stack web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) that lets users upload Excel files, visualize data with dynamic charts, and receive AI-powered insights.

---

## 🚀 Features

- 🔐 **Authentication**: Secure login/register with role-based access (Admin/User)
- 📁 **Excel Upload**: Upload `.xlsx` or `.csv` files with preview
- 📊 **Charts**: Auto-generate 2D and 3D charts using Chart.js and Plotly.js
- 🤖 **AI Insights**: Ask AI questions about your uploaded Excel data (powered by OpenRouter/OpenAI)
- 📚 **History**: View and manage uploaded files, insights, and charts
- ⚙️ **Admin Panel**: Dashboard to manage users, files, and view analytics
- 🌗 **Dark/Light Mode**: Fully responsive and theme-aware UI

---

## 🧰 Tech Stack

### 🔧 Frontend
- React.js (Vite)
- Chart.js, Plotly.js
- Tailwind CSS
- Axios, React Router

### 🔧 Backend
- Node.js + Express
- MongoDB + Mongoose
- Multer for file uploads
- OpenRouter/OpenAI for AI insights
- JWT-based Authentication

---

## 🗂️ Project Structure

```text
SheetSavvy-Excel-Analytical-Platform/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── App.jsx
│ └── ...
│
├── server/ # Node.js backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── middleware/
│ └── server.js
│
├── README.md
└── .gitignore
```

---

## 📦 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Subha-P-coder/SheetSavvy-Excel-Analytical-Platform.git
cd SheetSavvy-Excel-Analytical-Platform
```

2️⃣ Install frontend dependencies

```bash
cd client
npm install
npm run dev
```

3️⃣ Install backend dependencies

```bash
cd ../server
npm install
npm run server
```

---

## 🔐 Environment Variables

Create a .env file inside the server/ folder:

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

OPENROUTER_API_KEY=your_openrouter_or_openai_api_key

Tip: Never commit .env files to GitHub. Use a .gitignore.

## 📝 .env.example
You can create a .env.example like this to help contributors set up the project:


# .env.example
MONGO_URI=your_mongo_db_uri_here
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key

---

## 📈 Admin Dashboard

The admin panel includes:

Total users, files, charts, insights

Recent uploads and activity logs

User and file management (delete, view)

Analytics dashboard with visual charts

---

## 🌐 Deployment Suggestions

You can deploy the app using:

Frontend: Vercel or Netlify

Backend: Render, Railway, or Cyclic

Database: MongoDB Atlas

---

## 📷 Screenshots (Coming Soon)

You can add UI screenshots or demo GIFs here to showcase features.

---

🛡 License

This project is licensed under the MIT License.
Feel free to fork and enhance it for your own use.
