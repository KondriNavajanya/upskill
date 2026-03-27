# 🎓 AI-Powered Student Learning Platform

A comprehensive, production-ready MERN stack application for personalized learning, skill assessment, and career guidance.

## 🚀 Features

### Core Learning System
- **MCQ-Based Assessment**: 30+ carefully curated questions across 5 topics
- **Multi-Topic Support**: DSA, OOPS, Frontend, Backend, Database
- **Difficulty Levels**: Easy, Medium, Hard
- **Auto-Evaluation**: Instant score calculation and detailed feedback

### AI Integration
- **Smart Explanations**: Concept breakdowns with algorithms and complexity analysis
- **Career Suggestions**: AI-powered career path recommendations based on performance
- **Learning Resources**: YouTube video recommendations for deeper learning
- **Code Editor**: Multi-language code submission (Python, Java, C++, JavaScript)

### Performance Tracking
- **Score Analytics**: Track progress across topics and difficulty levels
- **Performance Charts**: Visual representation of learning metrics
- **Leaderboards**: Compare performance with other learners
- **Progress Reports**: Detailed performance breakdowns

### User Features
- **User Authentication**: Secure JWT-based authentication
- **Problem Solving**: LeetCode-style coding problems
- **Bookmarks**: Save favorite problems for later
- **Discussions**: Community forums for problem discussions
- **Contests**: Time-based competitive challenges

## 📋 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data persistence
- **Mongoose** for schema management
- **JWT** for authentication
- **CORS** for cross-origin requests

### Frontend
- **React 18** with hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Recharts** for analytics visualization
- **Lucide Icons** for UI icons

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-skill-platform
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
JUDGE0_API_KEY=optional_judge0_api_key
OPENAI_API_KEY=optional_openai_api_key
```

5. **Start backend server**
```bash
npm run dev
```

Backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## 🚀 Running the Project

### Using npm scripts

**Backend (Terminal 1)**:
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2)**:
```bash
cd frontend
npm run dev
```

### Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

## 📚 Learning Platform Usage

### 1. Dashboard
- View your learning statistics
- Access recent test results
- See upcoming challenges

### 2. Learning Lab
- **Select Topic**: Choose from DSA, OOPS, Frontend, Backend, or Database
- **Choose Difficulty**: Easy, Medium, or Hard
- **Start Test**: Take a timed MCQ test (5-10 questions)
- **Get Explanation**: View detailed concept explanations with video links

### 3. Test System
- **Timer**: 10-minute countdown starts at test beginning
- **Answer Selection**: Choose from 4 options per question
- **Navigation**: Move between questions using Previous/Next buttons
- **Question Status**: Quick access buttons to jump to any question

### 4. Results
- **Score Display**: Visual representation of your score
- **Grade**: A, B, C, or F based on performance
- **Detailed Review**: Question-by-question breakdown
- **Explanations**: Why correct answers are correct

### 5. Explanations
Get comprehensive breakdowns including:
- Concept explanation
- Learning approaches
- Time complexity
- Space complexity
- Real-world examples
- YouTube video recommendations

## 🔌 API Endpoints

### Learning Routes (`/api/learn`)

**Get MCQ Questions**
```
GET /api/learn/mcq?category=DSA&difficulty=Easy
```

**Get Topic Explanation**
```
GET /api/learn/explain?topic=DSA
```

**Check Answers & Get Score**
```
POST /api/learn/check-answers
Body: {
  category: "DSA",
  difficulty: "Easy",
  answers: [{ selectedOption: 0 }, { selectedOption: 1 }]
}
```

**Save Test Result**
```
POST /api/learn/save-result
Body: {
  topic: "DSA",
  difficulty: "Easy",
  score: 85,
  totalQuestions: 5,
  timeSpent: 300
}
```

**Get Performance Statistics**
```
GET /api/learn/performance-stats
```

**Get All Categories**
```
GET /api/learn/categories
```

## 📁 Project Structure

```
upskill-main/
├── backend/
│   ├── routes/
│   │   ├── learningRoutes.js      # Learning system routes
│   │   ├── authRoutes.js          # Authentication routes
│   │   ├── problemRoutes.js       # Problem management
│   │   └── ...other routes
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Result.js              # Test results schema
│   │   ├── Problem.js             # Problem schema
│   │   └── ...other models
│   ├── utils/
│   │   └── mockQuestions.js       # Mock MCQs and explanations
│   ├── middleware/
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LearningPage.jsx   # Main learning dashboard
│   │   │   ├── DashboardPage.jsx  # User dashboard
│   │   │   └── ...other pages
│   │   ├── components/
│   │   │   ├── MCQTest.jsx        # MCQ test component
│   │   │   ├── ExplanationModal.jsx
│   │   │   ├── ResultsModal.jsx
│   │   │   └── ...other components
│   │   ├── services/
│   │   │   └── api.js             # API client configuration
│   │   └── App.jsx                # Main app component
│   └── vite.config.js
│
└── README.md
```

## 🎯 Learning Paths

### DSA Mastery Path
1. **Easy**: Basic array and list operations
2. **Medium**: Sorting, searching, trees
3. **Hard**: Dynamic programming, graphs

### OOPS Fundamentals
1. **Easy**: Classes, objects, inheritance
2. **Medium**: Polymorphism, design patterns
3. **Hard**: SOLID principles

### Frontend Development
1. **Easy**: HTML, CSS, DOM
2. **Medium**: React fundamentals
3. **Hard**: Advanced React patterns

### Backend Development
1. **Easy**: REST APIs, routing
2. **Medium**: Middleware, authentication
3. **Hard**: Scaling, optimization

### Database Mastery
1. **Easy**: SQL basics, relationships
2. **Medium**: Indexing, normalization
3. **Hard**: Query optimization, transactions

## 📊 Performance Analytics

Track your progress with:
- **Score History**: All test attempts and scores
- **Topic Mastery**: Average scores per topic
- **Difficulty Progress**: Performance across all difficulty levels
- **Time Analytics**: How quickly you complete tests
- **Leaderboard Position**: Your rank among all learners

## 🔒 Authentication

The platform uses JWT (JSON Web Tokens) for secure authentication:
- **Token Storage**: Stored in localStorage (frontend)
- **Token Refresh**: Automatic refresh on each request
- **Protected Routes**: All learning features require authentication
- **Role-Based Access**: Admin access for problem management

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Build your frontend**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

### Backend Deployment (Render/Railway)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Enhanced AI-powered learning platform"
git push origin main
```

2. **Deploy on Render**
- Connect GitHub repository
- Set environment variables
- Deploy from main branch

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB if stopped
Start-Service MongoDB

# For local MongoDB
mongod
```

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Frontend Not Loading
```bash
# Clear node_modules and reinstall
cd frontend
rm -r node_modules
npm install
npm run dev
```

## 📝 Configuration Files

### .env.example
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-skill-platform
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
JUDGE0_API_KEY=
OPENAI_API_KEY=
```

### Tailwind Configuration
The project uses Tailwind CSS v3 with PostCSS for styling. Configuration is in `frontend/tailwind.config.js`.

## 🎓 Learning Resources

### Recommended YouTube Courses
- DSA: Complete Data Structures Course
- OOPS: Object-Oriented Programming Masterclass
- React: React Hooks & Patterns
- Node.js: Complete Node.js Backend Development
- MongoDB: MongoDB University Courses

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@upskill.com
- Join our Discord community

## 🎉 Acknowledgments

- OpenAI for AI capabilities
- Judge0 for code execution
- Tailwind CSS for styling
- React and Vue communities
- All contributors and users

## 📊 Version History

### v1.0.0 (Current)
- ✅ Complete learning system
- ✅ MCQ-based assessment
- ✅ AI explanations
- ✅ Performance tracking
- ✅ User authentication
- ✅ Responsive UI
- ✅ Multiple programming languages
- ✅ Career suggestions
- ✅ Discussion forums
- ✅ Problem library

---

**Happy Learning! 🚀**

Made with ❤️ by the Upskill Team
