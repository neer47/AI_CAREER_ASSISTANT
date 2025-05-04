# AI CAREER ASSISTANT

---

```markdown
# AI Career Assistant 🎯

Welcome to **AI Career Assistant** — a smart career preparation tool that helps users practice for job interviews by generating personalized questions based on their resumes. This full-stack project features a responsive React frontend and a secure Node.js/Express backend, integrated with MongoDB and deployed on Render.

---

## 📑 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📌 Overview
The AI Career Assistant simplifies interview prep by leveraging OpenAI's API to:
- Extract content from resumes (PDF).
- Generate customized interview questions.
- Evaluate user responses.
- Rate answers and provide ideal responses.

✨ **Includes:**
- Resume upload
- Real-time question generation
- Interactive chat interface
- Authentication (Signup/Login/Logout)
- Secure backend with JWT & cookie handling

---

## 🚀 Features
- ✅ Secure user authentication with cookie-based sessions (HTTPOnly)
- 📄 Resume parsing and question generation using OpenAI API
- 💬 Interactive chat interface to answer and evaluate questions
- 📊 Backend rating of answers + expected responses
- 📱 Fully responsive UI with Tailwind CSS
- 🔐 JWT-authentication and CORS with credentials

---

## 🛠️ Tech Stack

### 🔷 Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Axios, React Router, React Toastify

### 🔶 Backend
- Node.js + Express
- MongoDB + Mongoose
- OpenAI API
- JWT + Cookie-parser
- Multer (for PDF uploads)

### 🔥 Realtime & Deployment
- Render (Backend & optionally frontend)
- Vercel (recommended for frontend)

---

## 🧩 Installation

### ⚙️ Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- Git
- OpenAI API Key

---

### 🔧 Clone the Repository
```bash
git clone https://github.com/your-username/ai-career-assistant.git
cd ai-career-assistant
```

---

### 🔙 Backend Setup
```bash
cd backend
npm install
```

#### ➕ Create a `.env` file in `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
OPENAI_API_KEY=your_openai_api_key
PROD_CLIENT_URL=http://localhost:5173
```

#### ▶️ Start Backend
```bash
npm start
```

---

### 🔜 Frontend Setup
```bash
cd ../frontend
npm install
```

#### ➕ Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

#### ▶️ Start Frontend
```bash
npm run dev
```

---

## 💡 Usage
1. Navigate to `http://localhost:5173`
2. Sign up or log in.
3. Upload your resume (PDF).
4. Get questions, answer them, and receive evaluations.
5. View results or logout.

---

## 🌐 Deployment

### 🚀 Backend (Render)
1. Push backend to GitHub.
2. On [Render](https://render.com), create a new **Web Service**.
   - Set **start command**: `npm start`
   - Add required **Environment Variables**
3. Note your backend URL, e.g., `https://ai-career-backend.onrender.com`

---

### 🚀 Frontend (Vercel or Render)
1. Push frontend to GitHub.
2. Deploy via:
   - **Vercel** (recommended for Vite + React)
   - Or **Render** (Static Site)

   Use these settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Env Var: `VITE_API_URL=https://your-backend-url/api/v1`

---

## 🛡️ Production Notes
- Set `NODE_ENV=production`
- Use `secure: true` and `sameSite: none` in cookies
- Ensure backend and frontend use HTTPS
- Monitor logs on Render/Vercel for debugging

---

## 🤝 Contributing
```bash
# Steps to contribute
1. Fork this repo
2. Create a new branch: git checkout -b feature-name
3. Commit changes: git commit -m "Added feature"
4. Push branch: git push origin feature-name
5. Open a Pull Request
```

---

## 📄 License
This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for more info.

---

## 📬 Contact

- **Author**: [Your Name]
- **Email**: your.email@example.com
- **GitHub**: [@your-username](https://github.com/your-username)
- **Issues / Suggestions**: [Create an Issue](https://github.com/your-username/ai-career-assistant/issues)

---

### 🖼️ Screenshots

![image](https://github.com/user-attachments/assets/ec81d289-5b4f-4e30-8097-b88fef4302fd)
![image](https://github.com/user-attachments/assets/33aa3492-d0ef-4a71-8d21-4d4971c622b0)
![image](https://github.com/user-attachments/assets/37cbe8ed-67d7-4fba-9e53-c4fa252cc98d)

---

> ✨ Feel free to star ⭐ the repo if you found this project helpful!

