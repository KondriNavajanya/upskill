// LeetCode-style problems database
export const leetcodeProblems = {
  DSA: {
    Easy: [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        topic: "DSA",
        description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
          }
        ],
        coreIdea: "Use a hash map to store numbers and their indices for O(n) time complexity.",
        approaches: [
          {
            name: "Brute Force",
            description: "Check every pair of numbers",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)"
          },
          {
            name: "Hash Map",
            description: "Use a hash map to store numbers we've seen and find complement",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
          },
          {
            name: "Two Pointers (for sorted array)",
            description: "Use two pointers from start and end",
            timeComplexity: "O(n)",
            spaceComplexity: "O(1)"
          }
        ],
        constraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9",
        templates: {
          Python: `def twoSum(nums, target):
    # Your code here
    pass`,
          Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[2];
    }
}`,
          JavaScript: `var twoSum = function(nums, target) {
    // Your code here
    return [];
};`,
          "C++": `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
          C: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Your code here
    return NULL;
}`
        },
        testCases: [
          { input: "[2,7,11,15],9", expected: "[0,1]" },
          { input: "[3,2,4],6", expected: "[1,2]" },
          { input: "[3,3],6", expected: "[0,1]" }
        ],
        hints: [
          "A really brute force way would be to search for all possible pairs.",
          "You could improve that by using a hash map to see if the complement exists.",
          "What values are not feasible for nums[i]? For example, if target is 6 and nums[i] is 7."
        ]
      },
      {
        id: 2,
        title: "Reverse String",
        difficulty: "Easy",
        topic: "DSA",
        description: "Write a function that reverses a string. The input string is given as an array of characters s.",
        examples: [
          {
            input: `s = ["h","e","l","l","o"]`,
            output: `["o","l","l","e","h"]`,
            explanation: "String reversed in-place"
          }
        ],
        coreIdea: "Use two pointers from both ends and swap characters.",
        approaches: [
          {
            name: "Two Pointers",
            description: "Use left and right pointers and swap",
            timeComplexity: "O(n)",
            spaceComplexity: "O(1)"
          },
          {
            name: "Recursion",
            description: "Recursively reverse by swapping first and last",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
          }
        ],
        constraints: "1 <= s.length <= 10^5, s[i] is a printable ascii character.",
        templates: {
          Python: `def reverseString(s):
    # Your code here
    pass`,
          JavaScript: `var reverseString = function(s) {
    // Your code here
};`
        },
        testCases: [
          { input: `["h","e","l","l","o"]`, expected: `["o","l","l","e","h"]` }
        ]
      },
      {
        id: 3,
        title: "Valid Palindrome",
        difficulty: "Easy",
        topic: "DSA",
        description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
        examples: [
          {
            input: `s = "A man, a plan, a canal: Panama"`,
            output: "true",
            explanation: "After processing: 'amanaplanacanalpanama' is a palindrome."
          }
        ],
        coreIdea: "Clean the string and use two pointers to check if it's a palindrome.",
        approaches: [
          {
            name: "Two Pointers",
            description: "Skip non-alphanumeric and compare ends",
            timeComplexity: "O(n)",
            spaceComplexity: "O(1)"
          }
        ],
        constraints: "1 <= s.length <= 2 * 10^5",
        templates: {
          Python: `def isPalindrome(s):
    # Your code here
    return True`
        },
        testCases: [
          { input: `"A man, a plan, a canal: Panama"`, expected: "true" }
        ]
      },
      {
        id: 4,
        title: "Maximum Subarray",
        difficulty: "Easy",
        topic: "DSA",
        description: "Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.",
        examples: [
          {
            input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
            output: "6",
            explanation: "The subarray [4,-1,2,1] has the largest sum 6."
          }
        ],
        coreIdea: "Use Kadane's algorithm to track max sum ending at each position.",
        approaches: [
          {
            name: "Kadane's Algorithm",
            description: "Track max sum and reset when negative",
            timeComplexity: "O(n)",
            spaceComplexity: "O(1)"
          },
          {
            name: "Dynamic Programming",
            description: "dp[i] = max sum ending at index i",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
          }
        ],
        constraints: "1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4",
        templates: {
          Python: `def maxSubArray(nums):
    # Your code here
    return 0`
        },
        testCases: [
          { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
          { input: "[5]", expected: "5" }
        ]
      },
      {
        id: 5,
        title: "Contains Duplicate",
        difficulty: "Easy",
        topic: "DSA",
        description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
        examples: [
          {
            input: "nums = [1,2,3,1]",
            output: "true",
            explanation: "1 appears twice"
          }
        ],
        coreIdea: "Use a set to track seen numbers in O(1) lookup time.",
        approaches: [
          {
            name: "Hash Set",
            description: "Add to set and check if already exists",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
          },
          {
            name: "Sorting",
            description: "Sort and check adjacent elements",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(1)"
          }
        ],
        constraints: "1 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9",
        templates: {
          Python: `def containsDuplicate(nums):
    # Your code here
    return False`
        },
        testCases: [
          { input: "[1,2,3,1]", expected: "true" },
          { input: "[1,2,3,4]", expected: "false" }
        ]
      }
    ],
    Medium: [
      {
        id: 101,
        title: "3Sum",
        difficulty: "Medium",
        topic: "DSA",
        description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j != k != i and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.",
        examples: [
          {
            input: "nums = [-1,0,1,2,-1,-4]",
            output: "[[-1,-1,2],[-1,0,1]]",
            explanation: "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0."
          }
        ],
        coreIdea: "Sort array and use two pointers to find complements for each element.",
        approaches: [
          {
            name: "Two Pointers",
            description: "Sort and use nested approach with two pointers",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)"
          },
          {
            name: "Hash Set",
            description: "For each pair, check if complement exists",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(n)"
          }
        ],
        constraints: "3 <= nums.length <= 3000, -10^5 <= nums[i] <= 10^5",
        templates: {
          Python: `def threeSum(nums):
    # Your code here
    return []`
        },
        testCases: [
          { input: "[-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]" }
        ]
      },
      {
        id: 102,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        topic: "DSA",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        examples: [
          {
            input: `s = "abcabcbb"`,
            output: "3",
            explanation: "The longest substring without repeating characters is 'abc' with length 3."
          }
        ],
        coreIdea: "Use sliding window with hash map to track character positions.",
        approaches: [
          {
            name: "Sliding Window",
            description: "Expand window and track last seen positions",
            timeComplexity: "O(n)",
            spaceComplexity: "O(min(m,n))"
          }
        ],
        constraints: "0 <= s.length <= 5 * 10^4, s consists of English letters, digits, symbols and spaces.",
        templates: {
          Python: `def lengthOfLongestSubstring(s):
    # Your code here
    return 0`
        },
        testCases: [
          { input: `"abcabcbb"`, expected: "3" },
          { input: `"bbbbb"`, expected: "1" },
          { input: `"pwwkew"`, expected: "3" }
        ]
      },
      {
        id: 103,
        title: "Merge Intervals",
        difficulty: "Medium",
        topic: "DSA",
        description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals.",
        examples: [
          {
            input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
            output: "[[1,6],[8,10],[15,18]]",
            explanation: "[1,3] and [2,6] overlap and merge into [1,6]."
          }
        ],
        coreIdea: "Sort intervals and merge overlapping ones greedily.",
        approaches: [
          {
            name: "Greedy Sorting",
            description: "Sort by start time and merge if overlapping",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(1)"
          }
        ],
        constraints: "1 <= intervals.length <= 10^4",
        templates: {
          Python: `def merge(intervals):
    # Your code here
    return []`
        },
        testCases: [
          { input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" }
        ]
      }
    ],
    Hard: [
      {
        id: 201,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        topic: "DSA",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
        examples: [
          {
            input: "nums1 = [1,3], nums2 = [2]",
            output: "2.00000",
            explanation: "merged array = [1,2,3] and median is 2."
          }
        ],
        coreIdea: "Use binary search to find partition that divides array into equal halves.",
        approaches: [
          {
            name: "Binary Search",
            description: "Binary search on smaller array to find partition",
            timeComplexity: "O(log(min(m,n)))",
            spaceComplexity: "O(1)"
          },
          {
            name: "Merge",
            description: "Merge and find median",
            timeComplexity: "O(m+n)",
            spaceComplexity: "O(1)"
          }
        ],
        constraints: "nums1.length == m, nums2.length == n, 0 <= m <= 1000, 0 <= n <= 1000",
        templates: {
          Python: `def findMedianSortedArrays(nums1, nums2):
    # Your code here
    return 0.0`
        },
        testCases: [
          { input: "[1,3],[2]", expected: "2.0" }
        ]
      },
      {
        id: 202,
        title: "Longest Palindromic Substring",
        difficulty: "Hard",
        topic: "DSA",
        description: "Given a string s, return the longest palindromic substring in s.",
        examples: [
          {
            input: `s = "babad"`,
            output: `"bab" or "aba"`,
            explanation: "Both are valid answers."
          }
        ],
        coreIdea: "Expand around each center to find longest palindrome.",
        approaches: [
          {
            name: "Expand Around Center",
            description: "Expand from each character as center",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)"
          },
          {
            name: "Dynamic Programming",
            description: "Build table for palindromic substrings",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(n²)"
          },
          {
            name: "Manacher's Algorithm",
            description: "Advanced O(n) algorithm for palindromes",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
          }
        ],
        constraints: "1 <= s.length <= 1000, s consist of only digits and English letters.",
        templates: {
          Python: `def longestPalindrome(s):
    # Your code here
    return ""`
        },
        testCases: [
          { input: `"babad"`, expected: `"bab" or "aba"` },
          { input: `"ac"`, expected: `"a" or "c"` }
        ]
      }
    ]
  },
  OOPS: {
    Easy: [
      {
        id: 301,
        title: "Design a Bank Account Class",
        difficulty: "Easy",
        topic: "OOPS",
        description: "Design a Bank Account class with deposit, withdraw, and balance methods.",
        examples: [
          {
            input: "account = BankAccount(1000); account.deposit(500); account.withdraw(200); account.getBalance()",
            output: "1300",
            explanation: "Starting balance 1000 + deposit 500 - withdraw 200 = 1300"
          }
        ],
        coreIdea: "Encapsulate bank account data with methods for operations.",
        approaches: [
          {
            name: "Basic Class Design",
            description: "Simple class with private balance and public methods",
            timeComplexity: "O(1) per operation",
            spaceComplexity: "O(1)"
          },
          {
            name: "With Validation",
            description: "Add error checking for invalid operations",
            timeComplexity: "O(1)",
            spaceComplexity: "O(1)"
          }
        ],
        constraints: "Balance should not go negative",
        templates: {
          Python: `class BankAccount:
    def __init__(self, initialBalance):
        # Your code here
        pass
    
    def deposit(self, amount):
        # Your code here
        pass
    
    def withdraw(self, amount):
        # Your code here
        pass
    
    def getBalance(self):
        # Your code here
        return 0`
        }
      },
      {
        id: 302,
        title: "Design a Stack Class",
        difficulty: "Easy",
        topic: "OOPS",
        description: "Design your own Stack class without using any built-in stack data structure.",
        examples: [
          {
            input: "stack.push(1); stack.push(2); stack.pop(); stack.peek(); stack.isEmpty()",
            output: "2, false",
            explanation: "Push 1 and 2, pop returns 2, peek returns 1, isEmpty returns false"
          }
        ],
        coreIdea: "Implement LIFO (Last In First Out) using list or array.",
        approaches: [
          {
            name: "Array-based",
            description: "Use array with size tracking",
            timeComplexity: "O(1) amortized",
            spaceComplexity: "O(n)"
          },
          {
            name: "Linked List-based",
            description: "Use linked list nodes",
            timeComplexity: "O(1)",
            spaceComplexity: "O(n)"
          }
        ],
        constraints: "All operations should be O(1)",
        templates: {
          Python: `class Stack:
    def __init__(self):
        # Your code here
        pass
    
    def push(self, val):
        # Your code here
        pass
    
    def pop(self):
        # Your code here
        return None
    
    def peek(self):
        # Your code here
        return None
    
    def isEmpty(self):
        # Your code here
        return True`
        }
      }
    ],
    Medium: [
      {
        id: 401,
        title: "Design a Cache System (LRU Cache)",
        difficulty: "Medium",
        topic: "OOPS",
        description: "Design an LRU (Least Recently Used) Cache with get and put operations.",
        examples: [
          {
            input: "cache = LRUCache(2); cache.put(1,1); cache.put(2,2); cache.get(1); cache.put(3,3); cache.get(2)",
            output: "1 (from get), cache evicts key 2",
            explanation: "Put operations store data, get retrieves with access tracking"
          }
        ],
        coreIdea: "Use HashMap and Doubly Linked List for O(1) operations.",
        approaches: [
          {
            name: "HashMap + Doubly Linked List",
            description: "Track access order with linked list, store in hashmap",
            timeComplexity: "O(1) per operation",
            spaceComplexity: "O(capacity)"
          }
        ],
        constraints: "Capacity is fixed, evict least recently used item when full",
        templates: {
          Python: `class LRUCache:
    def __init__(self, capacity):
        # Your code here
        pass
    
    def get(self, key):
        # Your code here
        return -1
    
    def put(self, key, value):
        # Your code here
        pass`
        }
      }
    ],
    Hard: [
      {
        id: 501,
        title: "Design a Parking Lot System",
        difficulty: "Hard",
        topic: "OOPS",
        description: "Design a parking lot system with multiple levels, spots of different sizes, and parking/unparking operations.",
        examples: [
          {
            input: "lot = ParkingLot(5, 10); spot = lot.addParkingSpot(0, 'compact'); lot.parkVehicle(vehicle)",
            output: "Assigned spot number",
            explanation: "Complex system with inheritance and polymorphism"
          }
        ],
        coreIdea: "Use inheritance, polymorphism, and composition for system design.",
        approaches: [
          {
            name: "OOP Design",
            description: "ParkingLot > Level > ParkingSpot hierarchy with Vehicle types",
            timeComplexity: "O(log n) for spot search",
            spaceComplexity: "O(n*m)"
          }
        ],
        constraints: "Support compact, regular, and large vehicles",
        templates: {
          Python: `class Vehicle:
    pass

class ParkingSpot:
    pass

class Level:
    pass

class ParkingLot:
    def __init__(self, numLevels, spotsPerLevel):
        # Your code here
        pass
    
    def parkVehicle(self, vehicle):
        # Your code here
        pass
    
    def unparkVehicle(self, vehicle):
        # Your code here
        pass`
        }
      }
    ]
  },
  Frontend: {
    Easy: [
      {
        id: 601,
        title: "Toggle Component",
        difficulty: "Easy",
        topic: "Frontend",
        description: "Create a React component that toggles between showing and hiding content.",
        examples: [
          {
            input: "Click button to toggle",
            output: "Content shown/hidden",
            explanation: "Simple state management with React hooks"
          }
        ],
        coreIdea: "Use useState hook to manage toggle state.",
        approaches: [
          {
            name: "useState Hook",
            description: "Simple state toggle with boolean",
            timeComplexity: "O(1)",
            spaceComplexity: "O(1)"
          }
        ],
        constraints: "Must use React hooks",
        templates: {
          JavaScript: `import React, { useState } from 'react';

function Toggle() {
    const [isVisible, setIsVisible] = useState(false);
    
    // Your code here
    
    return (
        <div>
            {/* Your JSX here */}
        </div>
    );
}

export default Toggle;`
        }
      },
      {
        id: 602,
        title: "Todo List Component",
        difficulty: "Easy",
        topic: "Frontend",
        description: "Create a basic todo list that allows adding and removing items.",
        examples: [
          {
            input: "Add item, toggle complete, delete",
            output: "List updates accordingly",
            explanation: "Array state management with React"
          }
        ],
        coreIdea: "Manage array of todos with useState and array methods.",
        approaches: [
          {
            name: "useState with Array",
            description: "Add/remove/update items in todo array",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
          }
        ],
        constraints: "Must allow add, complete, and delete operations",
        templates: {
          JavaScript: `import React, { useState } from 'react';

function TodoList() {
    const [todos, setTodos] = useState([]);
    
    // Your code here
    
    return (
        <div>
            {/* Your JSX here */}
        </div>
    );
}

export default TodoList;`
        }
      }
    ],
    Medium: [
      {
        id: 701,
        title: "Search Filter Component",
        difficulty: "Medium",
        topic: "Frontend",
        description: "Create a component that filters a list of items based on search input.",
        examples: [
          {
            input: "Type 'react' in search box",
            output: "Lists only items containing 'react'",
            explanation: "Real-time filtering with useEffect"
          }
        ],
        coreIdea: "Filter items based on search input using useEffect.",
        approaches: [
          {
            name: "useState + useEffect",
            description: "Track search term and filter on change",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
          }
        ],
        constraints: "Must be case-insensitive and instant",
        templates: {
          JavaScript: `import React, { useState, useEffect } from 'react';

function SearchFilter() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    
    // Your code here
    
    return (
        <div>
            {/* Your JSX here */}
        </div>
    );
}

export default SearchFilter;`
        }
      }
    ],
    Hard: [
      {
        id: 801,
        title: "Infinite Scroll Component",
        difficulty: "Hard",
        topic: "Frontend",
        description: "Create a component that loads more items as user scrolls to bottom.",
        examples: [
          {
            input: "Scroll to bottom of page",
            output: "More items loaded",
            explanation: "Intersection Observer API with pagination"
          }
        ],
        coreIdea: "Use Intersection Observer API to detect bottom scroll.",
        approaches: [
          {
            name: "Intersection Observer",
            description: "Detect when sentinel element enters viewport",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
          }
        ],
        constraints: "Must handle pagination efficiently",
        templates: {
          JavaScript: `import React, { useState, useEffect, useRef } from 'react';

function InfiniteScroll() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const sentinelRef = useRef(null);
    
    // Your code here
    
    return (
        <div>
            {/* Your JSX here */}
            <div ref={sentinelRef} />
        </div>
    );
}

export default InfiniteScroll;`
        }
      }
    ]
  },
  Backend: {
    Easy: [
      {
        id: 901,
        title: "Create a Simple REST API",
        difficulty: "Easy",
        topic: "Backend",
        description: "Create a basic Express.js REST API with GET and POST endpoints.",
        examples: [
          {
            input: "GET /api/items, POST /api/items with JSON body",
            output: "Returns list of items or creates new item",
            explanation: "Basic CRUD operations"
          }
        ],
        coreIdea: "Set up Express routes with request/response handling.",
        approaches: [
          {
            name: "Express Routing",
            description: "Define routes and handle requests",
            timeComplexity: "O(1)",
            spaceComplexity: "O(1)"
          }
        ],
        constraints: "Must use Express.js",
        templates: {
          JavaScript: `import express from 'express';
const app = express();

app.use(express.json());

// Your code here

const PORT = 3000;
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});

export default app;`
        }
      }
    ],
    Medium: [
      {
        id: 1001,
        title: "Middleware Authentication",
        difficulty: "Medium",
        topic: "Backend",
        description: "Create authentication middleware that verifies JWT tokens.",
        examples: [
          {
            input: "Request with Authorization header",
            output: "Validates token and proceeds or rejects",
            explanation: "JWT verification in middleware"
          }
        ],
        coreIdea: "Create middleware function to verify JWT in request headers.",
        approaches: [
          {
            name: "JWT Verification",
            description: "Verify token signature and expiration",
            timeComplexity: "O(1)",
            spaceComplexity: "O(1)"
          }
        ],
        constraints: "Use jsonwebtoken library",
        templates: {
          JavaScript: `import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    // Your code here
};

export default authenticateToken;`
        }
      }
    ]
  },
  Database: {
    Easy: [
      {
        id: 1101,
        title: "Basic MongoDB Query",
        difficulty: "Easy",
        topic: "Database",
        description: "Write MongoDB queries to find, insert, and update documents.",
        examples: [
          {
            input: "db.users.find({age: {$gt: 18}})",
            output: "Returns all users with age > 18",
            explanation: "Query operators in MongoDB"
          }
        ],
        coreIdea: "Use MongoDB query operators for filtering documents.",
        approaches: [
          {
            name: "Query Operators",
            description: "$gt, $lt, $eq, etc. for filtering",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
          }
        ],
        constraints: "Use MongoDB native syntax",
        templates: {
          JavaScript: `// MongoDB Query
// Find all documents where condition is true
db.users.find({
    // Your query here
});`
        }
      }
    ],
    Medium: [
      {
        id: 1201,
        title: "MongoDB Aggregation Pipeline",
        difficulty: "Medium",
        topic: "Database",
        description: "Use aggregation pipeline to process and transform documents.",
        examples: [
          {
            input: "Group by category and sum amounts",
            output: "Returns aggregated results",
            explanation: "Complex data processing with pipelines"
          }
        ],
        coreIdea: "Chain aggregation stages for complex queries.",
        approaches: [
          {
            name: "Aggregation Pipeline",
            description: "$match, $group, $project stages",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
          }
        ],
        constraints: "Use MongoDB aggregation operators",
        templates: {
          JavaScript: `// MongoDB Aggregation Pipeline
db.sales.aggregate([
    // Your pipeline stages here
]);`
        }
      }
    ]
  }
};
