# 🚀 Coding Lab Quick Start Guide

## What is the Coding Lab?

The Coding Lab is a LeetCode-style problem-solving platform integrated into UPSKILL. It allows you to:
- ✅ Practice coding problems across 5 topics
- ✅ Write code in 5 different programming languages
- ✅ Get automatic evaluation and scoring
- ✅ Access detailed problem explanations
- ✅ Track your progress and statistics

---

## Getting Started (5 Minutes)

### Step 1: Ensure Both Servers Are Running

**Backend Server:**
```bash
cd backend
npm start
```
✓ Should print: "Server running on port 5000"

**Frontend Server (new terminal):**
```bash
cd frontend
npm run dev
```
✓ Should show: "Local: http://localhost:5173/"

### Step 2: Login to the Application

1. Open `http://localhost:5173` in your browser
2. Login with your credentials (or create an account)
3. You should see the Dashboard

### Step 3: Access Coding Lab

1. Look for **"Coding Lab"** in the left sidebar
2. Click on it
3. You'll see the problem selection page

---

## How to Use Coding Lab

### 📚 Browsing Problems

1. **Select a Topic**: Click on one of 5 topics:
   - **DSA** (Data Structures & Algorithms)
   - **OOPS** (Object-Oriented Programming)
   - **Frontend** (React, HTML, CSS)
   - **Backend** (Node.js, APIs)
   - **Database** (MongoDB, SQL)

2. **Choose Difficulty**:
   - 🟢 **Easy**: Basic fundamentals
   - 🟡 **Medium**: Intermediate challenges
   - 🔴 **Hard**: Advanced problems

3. **View Problem Preview**:
   - Title and difficulty badge
   - Problem description summary
   - Core idea explanation
   - Available solution approaches
   - Number of test cases

### 💻 Solving a Problem

1. Click **"Solve"** on any problem
2. You'll see the **Code Editor Page** with:
   - **Left Pane**: Full problem description, examples, constraints
   - **Right Pane**: Code editor

#### Write Your Code

1. **Select Language**: Choose from Python, JavaScript, Java, C++, or C
2. **Copy Template**: A code template loads automatically
3. **Write Solution**: Replace the template with your code
4. **Submit**: Click "Submit" button

#### View Results

After submission, you'll see:
- ✅ or ❌ Acceptance status
- 📊 Score percentage (0-100%)
- 🧪 Tests passed (e.g., 3/3)
- ⏱️ Time Complexity
- 💾 Space Complexity

### 📖 Understanding Problems

1. Click **"Explanation"** button at top
2. A modal opens showing:
   - **Core Idea**: Main concept explained
   - **Multiple Approaches**: Different solution strategies
   - **Complexity Analysis**: Time and space complexity for each approach
   - **Hints**: Helpful tips for solving
   - **Examples**: Sample inputs and outputs

---

## Features Explained

### Statistics Dashboard

At the top of Coding Lab, you see:
- **Total Solved**: How many problems you've completed
- **Attempted**: How many unique problems you've tried
- **Submissions**: Total code submissions made
- **Avg Score**: Your average submission score

### Problem Information Cards

Each problem shows:
```
1. Two Sum
   [Easy Badge]

   Given an array of integers nums and an integer target,
   return the indices of the two numbers that add up to target.

   Core Idea: Use a hash map to store numbers and their indices

   Approaches:
   • Brute Force: O(n²) time, O(1) space
   • Hash Map: O(n) time, O(n) space
   • Two Pointers: O(n) time, O(1) space

   Examples: 2 test cases
   [SOLVE BUTTON]
```

### Code Editor Interface

```
┌─ PROBLEM DESCRIPTION ────────┬─ CODE EDITOR ──────────────┐
│                              │                            │
│ Problem Title                │ Language: [Python ▼]       │
│ [Easy Badge]                 │                            │
│                              │ ┌────────────────────────┐ │
│ Full description             │ │ def twoSum(nums,...):  │ │
│                              │ │     # Your code here   │ │
│ Examples:                    │ │                        │ │
│ Input: [2,7,11,15], 9       │ │                        │ │
│ Output: [0,1]               │ │                        │ │
│                              │ └────────────────────────┘ │
│ Constraints:                 │                            │
│ • 2 <= nums.length <= 10^4   │ [Submit Button]            │
│                              │                            │
│ Hints:                       │ [Result if submitted]      │
│ 1. Check all pairs...        │                            │
│ 2. Use hash map...           │                            │
└──────────────────────────────┴────────────────────────────┘
```

---

## Available Languages

### Python
```python
def twoSum(nums, target):
    # Your code here
    pass
```

### JavaScript
```javascript
var twoSum = function(nums, target) {
    // Your code here
    return [];
};
```

### Java
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[2];
    }
}
```

### C++
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};
```

### C
```c
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Your code here
    return NULL;
}
```

---

## Topics & Difficulty Breakdown

### DSA (Data Structures & Algorithms)
- **Easy** (5): Two Sum, Reverse String, Palindrome, Max Subarray, Duplicates
- **Medium** (3): 3Sum, Longest Substring, Merge Intervals
- **Hard** (2): Median, Palindromic Substring

### OOPS (Object-Oriented Programming)
- **Easy** (2): Bank Account, Stack
- **Medium** (1): LRU Cache
- **Hard** (1): Parking Lot System

### Frontend
- **Easy** (2): Toggle Component, Todo List
- **Medium** (1): Search Filter
- **Hard** (1): Infinite Scroll

### Backend
- **Easy** (1): REST API
- **Medium** (1): Middleware Auth

### Database
- **Easy** (1): MongoDB Queries
- **Medium** (1): Aggregation Pipeline

**Total: 25+ real-world problems**

---

## Understanding Results

### Scoring

- **100%** ✅ All tests passed
- **70-99%** ⚠️ Partial success
- **Below 70%** ❌ Code needs fixing

### Complexity Metrics

**Time Complexity** (Speed)
- O(1) - Constant, fastest
- O(log n) - Logarithmic
- O(n) - Linear
- O(n²) - Quadratic
- O(2^n) - Exponential, slowest

**Space Complexity** (Memory)
- O(1) - Uses fixed space
- O(n) - Uses space proportional to input

### Approaches Comparison

Problems show multiple solution approaches:
1. **Brute Force**: Simple, often slower
2. **Optimized**: Uses data structures
3. **Advanced**: Uses advanced algorithms

Each approach shows its complexity to help you compare.

---

## Tips for Success

### 🎯 Best Practices

1. **Start with Easy**: Build confidence with basic problems
2. **Read Full Description**: Understand all examples and constraints
3. **Review Approaches**: Learn different solution strategies
4. **Check Complexity**: Understand the efficiency of your solution
5. **Read Hints**: Get guidance without giving away the answer
6. **Test Locally First**: Verify your code before submitting
7. **Try Different Languages**: Practice polyglottism

### 📊 Track Progress

- Check your stats regularly
- Aim to solve problems by difficulty
- Try different approaches to the same problem
- Review explanations for problems you struggled with

### 🚀 Level Up

1. **Easy** → **Medium** → **Hard** progression
2. Try **multiple topics** to build diverse skills
3. Revisit **previously solved** problems to optimize
4. Aim for **100% on all problems**

---

## Troubleshooting

### Problems Not Loading?
1. Refresh the page (Ctrl+R or Cmd+R)
2. Check browser console (F12) for errors
3. Ensure both servers are running
4. Try a different topic

### Code Won't Submit?
1. Check code is not empty
2. Select a language
3. Try a simpler example first
4. Check server logs for errors

### Results Not Showing?
1. Wait a moment for evaluation
2. Try submitting again
3. Check browser console
4. Restart servers if persistent

### Can't Access Coding Lab?
1. Ensure you're logged in
2. Check URL is `/coding`
3. Verify both frontend and backend running
4. Check sidebar shows "Coding Lab" link

---

## API Integration (Advanced)

Want to integrate with the API directly?

### Get Problems
```bash
GET http://localhost:5000/api/coding/problems/DSA/Easy
```

### Get Problem Details
```bash
GET http://localhost:5000/api/coding/problem/1
```

### Submit Code
```bash
POST http://localhost:5000/api/coding/submit
Body: {
  userId: "your_user_id",
  problemId: 1,
  language: "Python",
  code: "your code here",
  topic: "DSA",
  difficulty: "Easy"
}
```

### Get Your Stats
```bash
GET http://localhost:5000/api/coding/stats/your_user_id
```

See [CODING_API_TESTING.md](CODING_API_TESTING.md) for full API documentation.

---

## Next Steps

1. ✅ **Try your first problem** (Start with Easy DSA)
2. ✅ **Read explanations** to understand approaches
3. ✅ **Solve across topics** to build comprehensive skills
4. ✅ **Check your stats** to track progress
5. ✅ **Challenge yourself** with Medium and Hard problems

---

## Need Help?

- 📖 **Read the explanation** for any problem
- 💡 **Check the hints** for guidance
- 🔍 **Review examples** to understand expected behavior
- 📚 **See documentation**: [CODING_LAB_IMPLEMENTATION.md](CODING_LAB_IMPLEMENTATION.md)

---

**Happy Coding! 🎉**

Remember: The best way to learn programming is by practice. Start with easy problems and gradually increase difficulty. Every submission, even unsuccessful ones, teaches you something valuable.

---

**Quick Links:**
- 🏠 [Back to Dashboard](/dashboard)
- 📚 [Learning Lab](/learning)
- 🧪 [AI Test](/test)
- 📊 [Results](/results)
- 📖 [Documentation](CODING_LAB_IMPLEMENTATION.md)
