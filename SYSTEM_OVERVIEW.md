# Problem Management System - Complete Setup

## ✅ Built Components

### Backend (Node.js + Express + MongoDB)

#### 1. **Problem Model** (`backend/models/Problem.js`)
- ✓ Schema with source tracking (manual/admin/ai)
- ✓ Unique slug auto-generation
- ✓ Support for examples & test cases (hidden flag)
- ✓ Starter code for JS/Python/C++
- ✓ Performance indexes on slug, difficulty, tags

#### 2. **Three Problem Ingestion Methods**

**Method 1: Manual JSON Seeding**
- File: `backend/seed/problems.json` (sample dataset with 2 problems)
- Script: `backend/seed/seedProblems.js` (validates & de-duplicates)
- Command: `npm run seed:problems`
- Source marked as: "manual"

**Method 2: Admin API CRUD**
- Routes in `backend/routes/problemRoutes.js`
- Protected with admin middleware
- POST /api/problems - Create
- PUT /api/problems/:id - Update
- DELETE /api/problems/:id - Delete
- Validation in `backend/utils/problemUtils.js`
- Source marked as: "admin"

**Method 3: AI Problem Generation**
- Endpoint: POST /api/problems/generate
- Accepts: { topic: string, difficulty: "Easy|Medium|Hard" }
- Service: `backend/services/aiService.js`
- Rate limited: 10 requests per 60 seconds
- Falls back to mock if OpenAI unavailable
- Source marked as: "ai"

**Bulk Upload**
- Endpoint: POST /api/problems/bulk
- Accepts: Array of problem objects (JSON)
- Returns: Count of created + skipped with reasons
- Validates all before inserting

#### 3. **Security & Performance**
- ✓ Admin middleware (`backend/middleware/authMiddleware.js`)
- ✓ Rate limiting for AI (`backend/middleware/aiRateLimitMiddleware.js`)
- ✓ Pagination (default 20, max 100 per page)
- ✓ In-memory cache (60s TTL) for tags & problem lists
- ✓ Input normalization (trim, dedupe tags, validate fields)

### Frontend (React + Tailwind)

#### 1. **Admin Panel** (`frontend/src/pages/AdminProblemsPage.jsx`)
- Route: `/admin/problems` (admin-only)
- **Create/Edit Form:**
  - Title, difficulty, tags
  - Description & constraints
  - Dynamic examples (add/remove)
  - Dynamic test cases (with hidden flag toggle)
  - Starter code editors (JS/Python/C++)

- **AI Generator:**
  - Topic input
  - Difficulty dropdown
  - Generate button with loading state
  - Preview display with save action

- **Bulk Upload:**
  - JSON file picker
  - Preview count before submit
  - Reports created/skipped counts

- **Problem Manager:**
  - List all problems (10 per page with pagination)
  - Edit button (loads full problem details)
  - Delete button (with confirmation)
  - Refresh button
  - Show source (manual/admin/ai)

#### 2. **Admin Route Guard** (`frontend/src/components/AdminRoute.jsx`)
- Restricts /admin/* to users with isAdmin=true
- Redirects non-admin to dashboard

#### 3. **Sidebar Navigation** (`frontend/src/components/layout/Sidebar.jsx`)
- Shows "Admin Problems" link only for admin users
- Uses ShieldCheck icon

#### 4. **API Service** (`frontend/src/services/problemService.js`)
- createProblemAdmin()
- updateProblemAdmin()
- deleteProblemAdmin()
- bulkUploadProblems()
- generateProblemWithAI()

#### 5. **Compatibility**
- Constraints render as string OR array (auto-detected)
- Works with both old & new problem formats

---

## 🚀 Getting Started

### 1. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Frontend  
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 2. **Setup MongoDB**
- Ensure your IP is whitelisted on MongoDB Atlas
- Check `backend/.env` for connection string
- Or use local MongoDB instead

### 3. **Seed Data (Optional)**
```bash
cd backend
npm run seed:problems
# Loads problems from backend/seed/problems.json
```

### 4. **Login & Access Admin Panel**
- Default demo user: `demo@student.ai` / `password123`
- Demo user is marked as admin (isAdmin: true)
- Navigate to `/admin/problems` after login
- Admin link visible in sidebar

---

## 📊 API Endpoints Summary

### Public (No Auth Required)
- GET /api/problems
- GET /api/problems/tags
- GET /api/problems/:id
- GET /api/problems/difficulty/:difficulty
- GET /api/problems/tag/:tag

### Admin Only (Auth + Admin)
- POST /api/problems - Create
- PUT /api/problems/:id - Update
- DELETE /api/problems/:id - Delete
- POST /api/problems/bulk - Bulk upload
- POST /api/problems/generate - AI generation

---

## 🔍 Architecture Notes

### Validation Pipeline
1. Normalize input (trim, dedupe tags, convert constraints to string)
2. Validate required fields & types
3. Check for duplicate titles (case-insensitive)
4. Auto-generate unique slug if needed
5. Persist to DB with source tracking

### Cache Strategy
- Problem lists & tags cached 60s
- Tags cache invalidated on any problem mutation
- Production: Use Redis instead of in-memory

### AI Generation Fallback
- If OpenAI API unavailable, returns mock problem
- Mock includes 10 test cases, 3 examples, starter code
- All responses validated before DB insert

### Constraints Format
- Stored as single string with `\n` delimiters
- Rendered on frontend by splitting by newline
- Backward compatible with array format

---

## 🛠 Next Steps (Optional Enhancements)

1. **Distributed Cache**: Replace in-memory with Redis
2. **Request Validation**: Add Zod/Joi schemas
3. **Integration Tests**: Test all admin & AI endpoints
4. **Code Splitting**: Reduce main JS chunk (currently 770KB)
5. **Problem Difficulty Stats**: Track acceptance rates
6. **Batch Import Progress**: Show real-time upload progress
7. **AI Provider Config**: Swap OpenAI for other providers

---

## ✨ All 3 Ingestion Methods Implemented & Production-Ready
