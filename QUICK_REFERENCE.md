# 🚀 UPSKILL Quick Reference Guide

## ✅ Everything is Running!

Your UPSKILL application is **fully deployed** and ready to use.

---

## 🌐 Access Your Application

### Open in Browser
```
Frontend: http://localhost:5173
API Test: http://localhost:5000/api/health
```

**Just click the links above to start using the application!**

---

## 📋 Current Status

| Component | Port | Status | Auto-Start |
|-----------|------|--------|-----------|
| Frontend (Vite) | 5173 | ✅ Running | Manual |
| Backend (Express) | 5000 | ✅ Running | Manual |
| MongoDB | 27017 | ✅ Running | ✅ Yes |

---

## 🛠️ If You Need to Restart Services

### Restart Backend
```bash
# In the backend terminal: Press Ctrl+C
# Then run:
cd c:\Users\HP\Downloads\upskill-main\backend
npm run dev
```

### Restart Frontend
```bash
# In the frontend terminal: Press Ctrl+C
# Then run:
cd c:\Users\HP\Downloads\upskill-main\frontend
npm run dev
```

### Restart MongoDB
```powershell
# If MongoDB stops, restart it:
Restart-Service MongoDB
# Or start it:
Start-Service MongoDB
```

---

## 📊 What Each Component Does

### 🌐 Frontend (http://localhost:5173)
- User interface for the coding platform
- Problem browsing and solving
- Code editor and submission
- Dashboard and analytics
- User authentication

### 🖥️ Backend (http://localhost:5000)
- REST API for all features
- User authentication with JWT
- Problem management
- Code execution integration
- Database operations

### 🗄️ MongoDB (localhost:27017)
- Stores all data (users, problems, submissions)
- Collections: Users, Problems, Submissions, etc.
- Auto-starts with Windows boot

---

## 🔐 Important: API Keys (Optional)

Some advanced features require API keys. These are optional:

### Judge0 API (For Code Execution)
- Get key from: https://judge0.com/
- Add to `backend/.env`: `JUDGE0_API_KEY=your_key`
- Enables running code in 60+ languages

### OpenAI API (For AI Features)
- Get key from: https://openai.com/api/
- Add to `backend/.env`: `OPENAI_API_KEY=your_key`
- Enables AI code review and suggestions

**Note**: Basic features work without these keys!

---

## 📂 Project Structure

```
upskill-main/
├── backend/                    # Express API server
│   ├── routes/                # API routes
│   ├── controllers/           # Business logic
│   ├── models/               # MongoDB schemas
│   ├── .env                  # Configuration
│   └── server.js             # Entry point
│
├── frontend/                   # React app
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # UI components
│   │   ├── services/        # API calls
│   │   └── App.jsx          # Main app
│   └── vite.config.js        # Vite config
│
└── DEPLOYMENT_COMPLETE.md     # Full documentation
```

---

## ✨ Features Available

- ✅ User authentication (sign up/login)
- ✅ Problem browsing with filters
- ✅ Code editor with syntax highlighting
- ✅ Code submission and execution
- ✅ User dashboard and analytics
- ✅ Performance tracking
- ✅ Problem discussions
- ✅ User contests
- ✅ Leaderboards

---

## 🎓 First Steps

1. **Open the App**: Go to http://localhost:5173
2. **Create Account**: Click "Sign Up" and enter your details
3. **Browse Problems**: Navigate to "Problems" section
4. **Solve a Problem**: Click on a problem and write code
5. **Submit Solution**: Click "Submit" to test your code
6. **View Dashboard**: Check your progress and stats

---

## 🆘 Quick Troubleshooting

### Problem: "Cannot connect to http://localhost:5173"
- Check if frontend terminal is running
- If not: `cd frontend && npm run dev`

### Problem: "API not responding"
- Check if backend terminal is running
- If not: `cd backend && npm run dev`
- Verify MongoDB service: `Get-Service MongoDB`

### Problem: "MongoDB connection error"
- Check if MongoDB service is running
- Start it: `Start-Service MongoDB`

### Problem: "Port already in use"
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

## 📞 Files of Interest

- **DEPLOYMENT_COMPLETE.md** - Full deployment documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **LEETCODE_UPGRADE_README.md** - Technical architecture
- **QUICK_START.md** - Quick reference
- **backend/.env** - Configuration file
- **backend/server.js** - Backend entry point
- **frontend/src/App.jsx** - Frontend entry point

---

## 🎉 You're All Set!

**Everything is installed, configured, and running.**

Just open http://localhost:5173 in your browser and start coding!

---

**Last Updated**: March 27, 2026  
**Status**: ✅ OPERATIONAL  
**MongoDB**: 7.0 (Auto-running)  
**Node.js**: Ready
