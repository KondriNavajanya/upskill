# LeetCode Platform - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (already configured)
- Git

### 1. Backend Setup

```bash
cd backend
npm install
```

#### Required Environment Variables (.env)

Create/update `backend/.env` with:

```env
PORT=5000
MONGO_URI=mongodb+srv://pradeepnagalla523_db_user:360d548owZIqB92B@hack.748dy3w.mongodb.net/
JWT_SECRET=super_secret_jwt_key
JUDGE0_API_KEY=your_judge0_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
CLIENT_URL=http://localhost:5177
```

#### Judge0 API Setup (Required for Code Execution)

1. **Sign up at [Judge0](https://judge0.com/)**
   - Visit https://auth.judge0.com/users/sign_up
   - Create your free account
   - Verify your email

2. **Get Your API Key**
   - Login to Judge0 dashboard
   - Navigate to API keys section
   - Copy your API key and add to `.env` as `JUDGE0_API_KEY`

3. **Available Endpoints**
   - Free tier: 2,000 requests/month
   - Supported languages: 60+ (JavaScript, Python, C++, Java, etc.)

#### OpenAI API Setup (Optional - Required for AI Features)

1. **Sign up at [OpenAI](https://openai.com/api/)**
   - Visit https://platform.openai.com/signup
   - Create account and verify email
   - Set up billing

2. **Generate API Key**
   - Go to https://platform.openai.com/api-keys
   - Create new secret key
   - Copy and add to `.env` as `OPENAI_API_KEY`

3. **Cost Estimate**
   - Code review: ~$0.01 per request
   - Skill gap analysis: ~$0.02 per request
   - Roadmap generation: ~$0.05 per request

#### Start Backend Server

```bash
npm run dev
# or for production: npm start
```

Backend will start on http://localhost:5000

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on http://localhost:5177

---

## 📊 Database Schema Overview

### Core Collections

**Users**
- Email authentication with JWT
- Role-based access (admin/user)
- Verified email flag

**Problems**
- Coding problems with 3 difficulty levels
- Starter code in JavaScript/Python/C++
- Test cases (hidden from users)
- Examples (shown in UI)
- Tags for categorization

**Submissions**
- User code submissions with verdicts
- Supported languages: JavaScript, Python, C++, Java
- Verdict types: Accepted, WrongAnswer, TimeLimitExceeded, RuntimeError
- Runtime/memory metrics

**UserStats**
- Topic-wise statistics
- Difficulty breakdown (easy/medium/hard solved)
- Problem acceptance rate
- Coding streak tracking

**SkillAnalysis**
- AI-generated skill gap analysis
- Personalized 12-week upskilling roadmap
- Career path recommendations
- Analysis history for tracking progress

**Contests**
- Time-boxed competitive programming events
- Real-time leaderboard
- Contest-specific submissions
- Penalty-based scoring

**Discussions**
- Problem-specific discussion threads
- Nested comments with voting
- Admin pinning for important posts
- Category tags (Solution/Question/Tip)

---

## 🔌 API Endpoints Overview

### Authentication Endpoints
```
POST   /api/auth/signup          - User registration
POST   /api/auth/login           - User login
POST   /api/auth/logout          - User logout
GET    /api/auth/me              - Get current user (protected)
```

### Problem Endpoints
```
GET    /api/problems             - List all problems (with filters)
GET    /api/problems/tags        - Get all available tags
GET    /api/problems/:id         - Get problem details
POST   /api/problems             - Create problem (admin only)
PUT    /api/problems/:id         - Update problem (admin only)
DELETE /api/problems/:id         - Delete problem (admin only)
GET    /api/problems/difficulty/:difficulty - Filter by difficulty
```

### Code Execution Endpoints
```
POST   /api/submissions/run      - Run code against single test case
POST   /api/submissions/submit   - Submit code against all test cases
GET    /api/submissions          - Get user's submission history
GET    /api/submissions/:id      - Get submission details
```

### Contest Endpoints
```
GET    /api/contests             - List all active/upcoming contests
POST   /api/contests             - Create contest (admin only)
POST   /api/contests/:id/join    - Join a contest
GET    /api/contests/:id/leaderboard - Get real-time leaderboard
```

### Discussion Endpoints
```
POST   /api/discussions          - Create discussion thread
GET    /api/discussions          - List discussions for a problem
POST   /api/discussions/:id/comment - Add comment to discussion
POST   /api/discussions/:id/upvote - Upvote discussion
POST   /api/discussions/:id/downvote - Downvote discussion (admin)
POST   /api/discussions/:id/pin  - Pin discussion (admin only)
```

### AI Feature Endpoints
```
POST   /api/ai/code-review       - Get code review for submitted code
POST   /api/ai/skill-gap         - Generate skill gap analysis
POST   /api/ai/roadmap           - Generate personalized upskilling roadmap
POST   /api/ai/career-path       - Get career path recommendations
GET    /api/ai/analysis/:userId  - Get user's AI analysis history
```

---

## 🧪 Testing the Platform

### 1. Create a Test User

Navigate to http://localhost:5177
- Click "Sign Up"
- Enter email, password, confirm password
- Verify email (check console for mock verification)

### 2. Test Code Execution

1. Go to "Problems" section
2. Click on any problem (after database seeding)
3. Write code in the editor
4. Click "Run" to test with one test case
5. Click "Submit" to run all test cases

### 3. Test AI Features

1. Make at least 5 problem submissions
2. Go to "Dashboard"
3. View your "Skill Analysis"
4. Check generated roadmap and career path

### 4. Test Contests

1. Admin creates a contest (via API or future admin panel)
2. Go to "Contests"
3. Join an active contest
4. Solve problems within time limit
5. Check real-time leaderboard

### 5. Test Discussions

1. Solve a problem or view problem details
2. View "Discussions" tab
3. Create new discussion thread
4. Comment on existing threads
5. Upvote helpful solutions

---

## 🌱 Database Seeding

### Option 1: Seed with Sample Problems

```bash
cd backend
npm run seed
```

This will populate the database with:
- 50 LeetCode-style problems
- Across Easy (15), Medium (25), Hard (10) difficulties
- Multiple tags (Array, String, DP, Graph, etc.)
- 3-5 test cases per problem
- Starter code templates in 3 languages

### Option 2: Manual Problem Creation

Use the API to create problems:

```bash
curl -X POST http://localhost:5000/api/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Two Sum",
    "description": "Given an array of integers nums...",
    "difficulty": "Easy",
    "tags": ["Array", "Hash Table"],
    "testCases": [...],
    "examples": [...],
    "starterCode": {...}
  }'
```

---

## 🔑 Key Configuration Notes

### Supported Languages for Code Execution

Judge0 supports 60+ languages. Most common:

| Language | Language ID |
|----------|-------------|
| JavaScript (Node.js) | 63 |
| Python 3 | 71 |
| C++ | 53 |
| Java | 62 |
| C | 50 |
| Ruby | 72 |
| Go | 60 |

See [Judge0 Languages List](https://judge0.com/index.html#languages) for complete list.

### Verdict Status Codes

```
Accepted              - All test cases passed ✅
WrongAnswer           - Output doesn't match expected
TimeLimitExceeded     - Code took too long to run ⏱️
RuntimeError          - Code crashed during execution 💥
CompilationError      - Code failed to compile
MemoryLimitExceeded   - Code used too much memory
```

### Time Limits

- Easy problems: 1-2 seconds per test case
- Medium problems: 2-3 seconds per test case
- Hard problems: 3-5 seconds per test case

---

## 📚 Frontend Routes

```
/                    - Home / Landing
/auth                - Login/Signup page
/dashboard           - Dashboard with stats and AI insights
/problems            - Browse all problems with filters
/problem/:id         - Problem details with code editor
/submissions         - View submission history
/contests            - Browse and join contests
/discussions         - Browse problem discussions
/profile             - User profile and settings
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use**
```bash
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**MongoDB connection failed**
- Verify `.env` has correct `MONGO_URI`
- Check MongoDB Atlas IP whitelist includes your current IP
- Ensure database user has proper permissions

**Judge0 API errors**
```
401 Unauthorized → API key is invalid or expired
429 Too Many Requests → Rate limit exceeded (upgrade plan)
500 Server Error → Judge0 experiencing issues
```

### Frontend Issues

**CORS errors**
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Restart backend after changing `.env`

**Tailwind CSS not loading**
```bash
cd frontend
npm run dev  # Rebuild CSS
```

**Components not rendering**
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors
- Verify all component imports in App.jsx

---

## 🚀 Deployment

### Backend (Heroku/Railway)

```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

Set environment variables in hosting panel:
- JUDGE0_API_KEY
- OPENAI_API_KEY
- MONGO_URI (production MongoDB)
- JWT_SECRET

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variable for API URL
VITE_API_URL=https://your-backend-url.com
```

---

## 📖 Next Steps

1. **Set up Judge0 API key** - Essential for code execution
2. **Run database seed** - Populate with sample problems
3. **Test code submission flow** - Verify end-to-end functionality
4. **(Optional) Add OpenAI key** - Enable AI features
5. **Create admin panel** - For managing problems and contests
6. **Implement real-time features** - WebSocket for live contests
7. **Add user messaging** - Community chat functionality
8. **Deploy to production** - Using Heroku/Vercel/AWS

---

## 📞 Support

For issues or questions:
- Check error logs: `backend/logs/error.log`
- Review API responses in browser DevTools
- Check MongoDB Atlas activity log
- Refer to [Judge0 Documentation](https://judge0.com/)
- Check [OpenAI API Docs](https://platform.openai.com/docs)

---

**Last Updated:** January 2025
**Platform Version:** 1.0 (LeetCode Upgrade)
