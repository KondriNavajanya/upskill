# 🚀 AI-Powered LeetCode Platform

A production-ready, competitive coding platform with AI-driven evaluation, skill analysis, and personalized learning paths.

## ✨ Features

### Core Features (Retained)
- ✅ JWT Authentication with password hashing
- ✅ AI-powered test generation (MCQs + coding)
- ✅ Dashboard with analytics and charts
- ✅ Performance tracking and leaderboard
- ✅ Career suggestion system
- ✅ Dark mode support
- ✅ Bookmarking and favorites

### New LeetCode Features
- ✅ **Problem Repository** - 1000+ curated problems with multiple difficulty levels
- ✅ **Online Code Editor** - JavaScript, Python, C++ support
- ✅ **Code Execution Engine** - Judge0 API integration for instant feedback
- ✅ **Submission System** - Track all submissions with test results
- ✅ **Contest System** - Create and participate in time-based contests
- ✅ **Discussion Forum** - Community-driven solutions and discussions
- ✅ **Bookmarks & Notes** - Save problems with personal notes
- ✅ **AI Code Review** - Get instant feedback on code quality
- ✅ **Skill Gap Analysis** - AI identifies weak topics
- ✅ **Upskilling Roadmap** - Personalized 12-week learning plan
- ✅ **AI Career Intelligence** - Role recommendations based on performance
- ✅ **Advanced Analytics** - Heatmaps, streak tracking, difficulty stats

## 🏗️ Architecture

### Tech Stack
- **Backend**: Node.js + Express.js + MongoDB
- **Frontend**: React 18 + Tailwind CSS
- **Code Execution**: Judge0 API
- **AI**: OpenAI API (for reviews and analysis)
- **Authentication**: JWT + bcryptjs
- **Database**: MongoDB Atlas

### Project Structure
```
hack/
├── backend/
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Business logic
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, error handling
│   ├── services/           # External API calls
│   ├── config/             # Database setup
│   └── server.js           # Express app
├── frontend/
│   ├── src/
│   ├── pages/              # Page components
│   ├── components/         # Reusable components
│   ├── services/           # API calls
│   ├── context/            # State management
│   └── App.jsx             # Routing
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Judge0 API key (optional, demo available)
- OpenAI API key (optional, for AI features)

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
# Add your environment variables:
# PORT=5000
# MONGO_URI=mongodb+srv://...
# JWT_SECRET=your_secret_key
# JUDGE0_API_KEY=your_judge0_key
# OPENAI_API_KEY=your_openai_key
# CLIENT_URL=http://localhost:5177

# Install additional packages for code execution
npm install axios dotenv

# Start server
npm start
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5177
```

## 📚 API Endpoints

### Problems
- `GET /api/problems` - Get all problems (with filters)
- `GET /api/problems/:id` - Get problem details
- `GET /api/problems/tags` - Get all tags
- `GET /api/problems/difficulty/:difficulty` - Filter by difficulty

### Code Execution
- `POST /api/submissions/run` - Run code with test input
- `POST /api/submissions/submit` - Submit code solution
- `GET /api/submissions` - Get user's submissions
- `GET /api/submissions/:id` - Get submission details

### AI Features
- `POST /api/ai/code-review` - Get AI code review
- `POST /api/ai/skill-gap` - Generate skill gap analysis
- `POST /api/ai/roadmap` - Generate upskilling roadmap
- `POST /api/ai/career-path` - Get career recommendations
- `GET /api/ai/analysis` - Get detailed skill analysis

### Contests
- `GET /api/contests` - Get all contests
- `POST /api/contests` - Create contest (admin)
- `POST /api/contests/:id/join` - Join contest
- `GET /api/contests/:id/leaderboard` - Get leaderboard

### Discussions
- `GET /api/discussions` - Get all discussions
- `POST /api/discussions` - Create discussion
- `POST /api/discussions/:id/comment` - Add comment
- `POST /api/discussions/:id/upvote` - Upvote discussion

## 🎮 Usage

### For Students
1. **Register/Login** - Create your account
2. **Browse Problems** - Filter by difficulty, tags, topics
3. **Practice** - Write code in the editor, test with samples
4. **Submit** - Get instant feedback on your solution
5. **Review Code** - Use AI to review your approach
6. **Track Progress** - View your analytics dashboard
7. **Follow Roadmap** - Complete your personalized learning path

### For Admins
1. Create problems through API
2. Create contests for competitions
3. Monitor leaderboards in real-time
4. Manage discussions and community

## 📊 Database Models

### User
- Extends existing user model with contributions, ratings

### Problem
- title, slug, difficulty, tags
- description, constraints, examples
- testCases (hidden and visible)
- starterCode (multi-language)
- acceptanceRate, submissions, solved count

### Submission  
- userId, problemId, code, language
- status (Accepted/WrongAnswer/TLE/RuntimeError)
- runtime, memory, test results
- timestamp

### UserStats
- totalProblems, solvedProblems
- difficulty-wise breakdown
- topicStats with accuracy and speed
- streak tracking

### SkillAnalysis
- weakTopics with proficiency scores
- strongTopics list
- upskillRoadmap (12-week plan)
- careerPath recommendation
- analysisHistory for tracking

### Contest
- problems array, dates, duration
- participants with scores and penalties
- real-time leaderboard
- status tracking

### Discussion
- problemId reference
- userId (author)
- title, content, code snippets
- comments with threading
- upvotes/downvotes, views

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
JUDGE0_API_KEY=your_judge0_api_key
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:5177
DATABASE_NAME=ai-skill-platform
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Heroku/Railway for Backend
```bash
# Add Procfile
web: npm start

# Push to deploy
git push heroku main
```

### Vercel for Frontend
```bash
npm run build
# Deploy build folder to Vercel
```

## 📈 Performance Optimizations

- **Lazy Loading** - Problems and submissions load on demand
- **Code Splitting** - React components split by route
- **API Caching** - Cache problem data and leaderboard
- **Database Indexing** - Indexes on frequently queried fields
- **Rate Limiting** - Prevent abuse on code execution endpoint

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs for secure storage
- **CORS Configuration** - Restricted API access
- **Input Validation** - Sanitize all inputs
- **Code Sandboxing** - Judge0 provides secure execution
- **Rate Limiting** - Code execution rate limited per user

## 🎯 Future Enhancements

- [ ] Real-time collaborative coding
- [ ] Video tutorials integration
- [ ] Machine learning-based difficulty prediction
- [ ] Gamification (achievements, badges)
- [ ] Mobile app (React Native)
- [ ] Company-specific interview prep tracks
- [ ] Weekly leaderboard with prizes
- [ ] Mentorship system with top coders
- [ ] Integration with job platforms
- [ ] Streaming support for contests

## 🤝 Contributing

We welcome contributions! Please:
1.Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

MIT License - feel free to use this project

## 📞 Support

For issues and questions:
- Email: support@aiplatform.com
- Discord: [Join our server]
- Docs: [Full documentation]

---

**Made with ❤️ for the coding community**
