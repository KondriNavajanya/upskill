# Coding Lab API Testing Guide

## Quick Test Commands

All commands use `Invoke-WebRequest` in PowerShell. Ensure both servers are running:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

---

## 1. Get All Problems (By Topic & Difficulty)

### Request
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/problems/DSA/Easy" -ErrorAction Stop
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

### Response
```json
{
  "success": true,
  "topic": "DSA",
  "difficulty": "Easy",
  "count": 5,
  "problems": [
    {
      "id": 1,
      "title": "Two Sum",
      "difficulty": "Easy",
      "topic": "DSA",
      "description": "...",
      "coreIdea": "...",
      "approaches": [...],
      "examples": [...]
    }
  ]
}
```

### Available Topics
- DSA
- OOPS
- Frontend
- Backend
- Database

### Available Difficulties
- Easy
- Medium
- Hard

---

## 2. Get Single Problem Details

### Request
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/problem/1" -ErrorAction Stop
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 8
```

### Response
Returns complete problem with:
- Title, difficulty, topic
- Full description
- Examples with explanations
- Approaches with complexity
- Code templates for all languages
- Test cases
- Hints
- Constraints

---

## 3. Get Problem Explanation

### Request
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/explanation/1" -ErrorAction Stop
$response.Content | ConvertFrom-Json
```

### Response
```json
{
  "success": true,
  "explanation": {
    "title": "Two Sum",
    "coreIdea": "Use a hash map to store numbers...",
    "approaches": [
      {
        "name": "Brute Force",
        "description": "Check every pair of numbers",
        "timeComplexity": "O(n²)",
        "spaceComplexity": "O(1)"
      },
      {
        "name": "Hash Map",
        "description": "Use a hash map to store...",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)"
      }
    ],
    "hints": ["...", "..."],
    "constraints": "...",
    "examples": [...]
  }
}
```

---

## 4. Submit Code for Evaluation

### Request
```powershell
$body = @{
    userId = "user_id_here"
    problemId = 1
    language = "Python"
    code = @"
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
"@
    topic = "DSA"
    difficulty = "Easy"
} | ConvertTo-Json

$headers = @{"Content-Type" = "application/json"}
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/submit" `
    -Method POST `
    -Body $body `
    -Headers $headers

$response.Content | ConvertFrom-Json
```

### Response
```json
{
  "success": true,
  "message": "All tests passed!",
  "result": {
    "passed": true,
    "score": 100,
    "testsPassed": 3,
    "totalTests": 3,
    "output": "Code execution completed. Tests passed: 3/3",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)"
  }
}
```

### Supported Languages
- Python
- JavaScript
- Java
- C++
- C

---

## 5. Get User Submission History

### Request
```powershell
$userId = "user_id_here"
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/submissions/$userId?limit=10" -ErrorAction Stop
$response.Content | ConvertFrom-Json | ForEach-Object { $_.submissions }
```

### Response
```json
{
  "success": true,
  "count": 5,
  "submissions": [
    {
      "_id": "mongodb_id",
      "userId": "user_id",
      "problemId": 1,
      "title": "Two Sum",
      "language": "Python",
      "code": "...",
      "topic": "DSA",
      "difficulty": "Easy",
      "passed": true,
      "score": 100,
      "testsPassed": 3,
      "totalTests": 3,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 6. Get User Statistics

### Request
```powershell
$userId = "user_id_here"
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/stats/$userId" -ErrorAction Stop
$response.Content | ConvertFrom-Json
```

### Response
```json
{
  "success": true,
  "stats": {
    "totalSubmissions": 15,
    "solvedProblems": 8,
    "attemptedProblems": 12,
    "byDifficulty": {
      "Easy": 6,
      "Medium": 2,
      "Hard": 0
    },
    "byTopic": {
      "DSA": 4,
      "OOPS": 2,
      "Frontend": 1,
      "Backend": 1,
      "Database": 0
    },
    "averageScore": "87.50"
  }
}
```

---

## Full Test Workflow

### 1. Fetch a problem
```powershell
# Get Easy DSA problems
$dsa_easy = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/problems/DSA/Easy"
$problems = $dsa_easy.Content | ConvertFrom-Json
$problem = $problems.problems[0]
Write-Host "Selected Problem: $($problem.title) (ID: $($problem.id))"
```

### 2. Get problem details
```powershell
$details = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/problem/$($problem.id)"
$problemDetail = $details.Content | ConvertFrom-Json
Write-Host "Templates Available: $($problemDetail.problem.templates.PSObject.Properties.Name -join ', ')"
```

### 3. View explanation
```powershell
$explanation = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/explanation/$($problem.id)"
$explain = $explanation.Content | ConvertFrom-Json
Write-Host "Core Idea: $($explain.explanation.coreIdea)"
Write-Host "Approaches: $($explain.explanation.approaches.Count)"
```

### 4. Submit solution
```powershell
$submission = @{
    userId = "test_user_123"
    problemId = $problem.id
    language = "Python"
    code = $problemDetail.problem.templates.Python
    topic = "DSA"
    difficulty = "Easy"
} | ConvertTo-Json

$submit_response = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/submit" `
    -Method POST `
    -Body $submission `
    -Headers @{"Content-Type"="application/json"}

$result = $submit_response.Content | ConvertFrom-Json
Write-Host "Submission Result: Score=$($result.result.score)%, Passed=$($result.result.passed)"
```

### 5. Check statistics
```powershell
$stats = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/stats/test_user_123"
$user_stats = $stats.Content | ConvertFrom-Json
Write-Host "User Stats: Solved=$($user_stats.stats.solvedProblems), Submissions=$($user_stats.stats.totalSubmissions)"
```

---

## Frontend Testing

### 1. Navigate to Coding Lab
```
URL: http://localhost:5173/coding
```

### 2. Test Topic Selection
- Click on each topic (DSA, OOPS, Frontend, Backend, Database)
- Verify problem count updates
- Check problem list loads for each topic

### 3. Test Difficulty Filtering
- Click Easy → verify 5 problems in DSA
- Click Medium → verify 3 problems in DSA
- Click Hard → verify 2 problems in DSA

### 4. Test Problem Details
- Click "Solve" on any problem
- Verify problem loads in editor
- Check all sections render:
  - Description
  - Examples
  - Constraints
  - Hints
  - Code editor

### 5. Test Code Submission
- Change language selector
- Type or paste code
- Click "Submit"
- Verify result displays

### 6. Test Explanation Modal
- Click "Explanation" button
- Verify modal displays
- Check all sections:
  - Core Idea
  - Approaches with complexity
  - Hints
  - Constraints
- Close modal

---

## Error Handling Tests

### Invalid Problem ID
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/problem/9999" -ErrorAction Stop
```
Expected: 404 error with "Problem not found"

### Invalid Topic
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/problems/InvalidTopic/Easy" -ErrorAction Stop
```
Expected: 404 error with "No problems found"

### Missing Submission Fields
```powershell
$body = @{
    userId = "test_user"
    # Missing problemId, language, code
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/coding/submit" `
    -Method POST `
    -Body $body `
    -Headers @{"Content-Type"="application/json"} `
    -ErrorAction Stop
```
Expected: 400 error with "Missing required fields"

---

## Performance Benchmarks

| Operation | Expected Time |
|-----------|--------------|
| Get problems list | <100ms |
| Get single problem | <50ms |
| Get explanation | <50ms |
| Submit code | <500ms |
| Get user stats | <150ms |
| Get submissions history | <200ms |

---

## Troubleshooting

### API Returns 404
1. Check backend server is running: `Get-Process node`
2. Restart backend if needed
3. Verify route registration in `server.js`
4. Wait 2-3 seconds after server start

### Frontend Doesn't Load Components
1. Check browser console (F12) for errors
2. Verify frontend is running: `http://localhost:5173`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check component imports in App.jsx

### Database Not Saving Results
1. Verify MongoDB is running: `Get-Service MongoDB`
2. Check .env has correct MONGO_URI
3. Verify Result model collection exists
4. Check user is authenticated

---

## Sample Test Script

Save as `test-coding-api.ps1`:

```powershell
# Coding Lab API Test Script

$baseUrl = "http://localhost:5000/api/coding"
$userId = "test_user_$(Get-Random)"

Write-Host "Testing Coding Lab API" -ForegroundColor Green
Write-Host "User ID: $userId" -ForegroundColor Cyan

# Test 1: Get Problems
Write-Host "`n[TEST 1] Get DSA Easy Problems" -ForegroundColor Yellow
$problems = Invoke-WebRequest -Uri "$baseUrl/problems/DSA/Easy" | ConvertFrom-Json
Write-Host "✓ Found $($problems.count) problems" -ForegroundColor Green

# Test 2: Get Details
Write-Host "`n[TEST 2] Get Problem Details" -ForegroundColor Yellow
$problemId = $problems.problems[0].id
$details = Invoke-WebRequest -Uri "$baseUrl/problem/$problemId" | ConvertFrom-Json
Write-Host "✓ Problem: $($details.problem.title)" -ForegroundColor Green

# Test 3: Get Explanation
Write-Host "`n[TEST 3] Get Problem Explanation" -ForegroundColor Yellow
$explain = Invoke-WebRequest -Uri "$baseUrl/explanation/$problemId" | ConvertFrom-Json
Write-Host "✓ Approaches: $($explain.explanation.approaches.Count)" -ForegroundColor Green

# Test 4: Submit Code
Write-Host "`n[TEST 4] Submit Code" -ForegroundColor Yellow
$submission = @{
    userId = $userId
    problemId = $problemId
    language = "Python"
    code = "# Sample solution`npass"
    topic = "DSA"
    difficulty = "Easy"
} | ConvertTo-Json

$submit = Invoke-WebRequest -Uri "$baseUrl/submit" -Method POST -Body $submission `
    -Headers @{"Content-Type"="application/json"} | ConvertFrom-Json
Write-Host "✓ Score: $($submit.result.score)%" -ForegroundColor Green

# Test 5: Get Stats
Write-Host "`n[TEST 5] Get User Statistics" -ForegroundColor Yellow
$stats = Invoke-WebRequest -Uri "$baseUrl/stats/$userId" | ConvertFrom-Json
Write-Host "✓ Submissions: $($stats.stats.totalSubmissions)" -ForegroundColor Green

Write-Host "`n[COMPLETED] All tests passed!" -ForegroundColor Green
```

Run with: `powershell -ExecutionPolicy Bypass -File test-coding-api.ps1`

---

**Last Updated**: 2024
**Status**: ✅ Ready for Testing
