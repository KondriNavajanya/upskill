// Mock MCQ questions data
export const mockQuestions = {
  DSA: {
    Easy: [
      {
        id: 1,
        question: "What is the time complexity of linear search?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 1,
        explanation: "Linear search checks each element sequentially"
      },
      {
        id: 2,
        question: "Which data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Array", "Tree"],
        correctAnswer: 1,
        explanation: "Stack follows Last In First Out (LIFO) principle"
      },
      {
        id: 3,
        question: "What is the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "Merge sort requires O(n) extra space for merging"
      },
      {
        id: 4,
        question: "Which sorting algorithm is most efficient for nearly sorted data?",
        options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Bubble Sort"],
        correctAnswer: 2,
        explanation: "Insertion sort performs best on nearly sorted data"
      },
      {
        id: 5,
        question: "What is a balanced binary search tree?",
        options: ["Height difference > 1", "Height difference ≤ 1", "All nodes have two children", "Sorted array"],
        correctAnswer: 1,
        explanation: "Balanced BST maintains height difference of at most 1"
      }
    ],
    Medium: [
      {
        id: 6,
        question: "What is the average time complexity of Quick Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 1,
        explanation: "Quick sort averages O(n log n) with good pivot selection"
      },
      {
        id: 7,
        question: "How do you detect a cycle in a linked list?",
        options: ["Hash table", "Floyd's cycle detection", "Two pointers", "All of above"],
        correctAnswer: 3,
        explanation: "All methods work; Floyd's algorithm is space-efficient"
      },
      {
        id: 8,
        question: "What is dynamic programming?",
        options: ["Fast sorting", "Memoization + recursion", "Garbage collection", "Memory allocation"],
        correctAnswer: 1,
        explanation: "DP combines recursion with memoization to avoid recalculation"
      }
    ],
    Hard: [
      {
        id: 9,
        question: "What is the time complexity of finding LCS using DP?",
        options: ["O(n)", "O(n²)", "O(n log n)", "O(2^n)"],
        correctAnswer: 1,
        explanation: "Longest Common Subsequence DP solution is O(m*n)"
      },
      {
        id: 10,
        question: "Explain the Kadane's algorithm purpose",
        options: ["Sorting", "Maximum subarray sum", "Path finding", "String matching"],
        correctAnswer: 1,
        explanation: "Kadane's algorithm finds max sum contiguous subarray in O(n)"
      }
    ]
  },
  OOPS: {
    Easy: [
      {
        id: 11,
        question: "What is encapsulation?",
        options: ["Hiding data", "Creating objects", "Inheritance", "Polymorphism"],
        correctAnswer: 0,
        explanation: "Encapsulation hides internal data and exposes only necessary methods"
      },
      {
        id: 12,
        question: "What is a class in OOP?",
        options: ["Function", "Blueprint for objects", "Variable", "Loop"],
        correctAnswer: 1,
        explanation: "A class is a template that defines object structure and behavior"
      },
      {
        id: 13,
        question: "What is inheritance?",
        options: ["Data hiding", "Code reuse through parent-child relationship", "Overriding methods", "Creating objects"],
        correctAnswer: 1,
        explanation: "Inheritance allows a class to inherit properties from another class"
      },
      {
        id: 14,
        question: "What is polymorphism?",
        options: ["One form", "Many forms", "No forms", "Infinite forms"],
        correctAnswer: 1,
        explanation: "Polymorphism means 'many forms' - methods with same name, different behavior"
      },
      {
        id: 15,
        question: "What is an interface?",
        options: ["Class implementation", "Contract defining methods", "Variable type", "Loop structure"],
        correctAnswer: 1,
        explanation: "Interface is a contract that defines methods to be implemented"
      }
    ],
    Medium: [
      {
        id: 16,
        question: "What is method overloading?",
        options: ["Same name, different parameters", "Same name, same parameters", "Different names", "No methods"],
        correctAnswer: 0,
        explanation: "Method overloading allows same method name with different signatures"
      },
      {
        id: 17,
        question: "What is an abstract class?",
        options: ["Fully implemented", "Partially implemented", "Not implemented", "Interface"],
        correctAnswer: 1,
        explanation: "Abstract class can have both abstract and concrete methods"
      }
    ],
    Hard: [
      {
        id: 18,
        question: "Explain SOLID principles in OOP",
        options: ["Storage", "Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion", "Memory management", "Code organization"],
        correctAnswer: 1,
        explanation: "SOLID are 5 design principles for maintainable, scalable code"
      }
    ]
  },
  Frontend: {
    Easy: [
      {
        id: 19,
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
        correctAnswer: 0,
        explanation: "HTML (Hyper Text Markup Language) is the standard markup language for web pages"
      },
      {
        id: 20,
        question: "What is CSS used for?",
        options: ["Structure", "Styling and layout", "Scripting", "Database"],
        correctAnswer: 1,
        explanation: "CSS (Cascading Style Sheets) is used for styling and layout"
      }
    ],
    Medium: [
      {
        id: 21,
        question: "What is the purpose of event delegation?",
        options: ["Create events", "Handle events on parent element", "Styling", "Animation"],
        correctAnswer: 1,
        explanation: "Event delegation handles events on a parent rather than individual children"
      }
    ],
    Hard: [
      {
        id: 22,
        question: "Explain React virtual DOM",
        options: ["Real DOM in memory", "Lightweight copy of real DOM", "Database", "Server-side rendering"],
        correctAnswer: 1,
        explanation: "Virtual DOM is a programming concept representing real DOM in memory"
      }
    ]
  },
  Backend: {
    Easy: [
      {
        id: 23,
        question: "What is a REST API?",
        options: ["Recursive Evaluation", "Representational State Transfer", "Remote Execution System", "Resource Encoding Standard"],
        correctAnswer: 1,
        explanation: "REST is an architectural style for designing networked applications"
      },
      {
        id: 24,
        question: "What HTTP method is used to create resources?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: 1,
        explanation: "POST method is used to create new resources on the server"
      }
    ],
    Medium: [
      {
        id: 25,
        question: "What is middleware in Express?",
        options: ["Database layer", "Function with access to request/response", "Routing", "Authentication"],
        correctAnswer: 1,
        explanation: "Middleware functions have access to request and response objects"
      }
    ],
    Hard: [
      {
        id: 26,
        question: "Explain the role of JWT in authentication",
        options: ["Password storage", "Stateless authentication token", "Database encryption", "Session management"],
        correctAnswer: 1,
        explanation: "JWT (JSON Web Token) provides stateless authentication without server-side sessions"
      }
    ]
  },
  Database: {
    Easy: [
      {
        id: 27,
        question: "What is a primary key?",
        options: ["Any column", "Unique identifier for each record", "Foreign key", "Index"],
        correctAnswer: 1,
        explanation: "A primary key uniquely identifies each record in a table"
      },
      {
        id: 28,
        question: "What is a foreign key?",
        options: ["Key from another country", "Reference to primary key in another table", "Index", "Constraint"],
        correctAnswer: 1,
        explanation: "Foreign key creates relationship between tables by referencing primary key"
      }
    ],
    Medium: [
      {
        id: 29,
        question: "What is database normalization?",
        options: ["Creating tables", "Organizing data to reduce redundancy", "Backup", "Encryption"],
        correctAnswer: 1,
        explanation: "Normalization organizes data efficiently and reduces redundancy"
      }
    ],
    Hard: [
      {
        id: 30,
        question: "Explain ACID properties",
        options: ["Data types", "Atomicity, Consistency, Isolation, Durability", "Security levels", "Backup types"],
        correctAnswer: 1,
        explanation: "ACID ensures reliable database transactions"
      }
    ]
  }
};

// Mock explanations
export const mockExplanations = {
  DSA: {
    concept: "Data Structures and Algorithms",
    explanation: "DSA is the foundation of computer science. It involves learning how to efficiently organize, store, and manipulate data.",
    approaches: [
      "Understand basic data structures (arrays, linked lists, trees)",
      "Learn fundamental algorithms (searching, sorting, dynamic programming)",
      "Practice time and space complexity analysis",
      "Solve problems progressively from easy to hard"
    ],
    timeComplexity: "Varies: O(1) to O(n!)",
    spaceComplexity: "Varies: O(1) to O(n)",
    realWorldExample: "Building efficient search engines, databases, and recommendation systems",
    videoLinks: [
      { title: "DSA Fundamentals", url: "https://www.youtube.com/watch?v=1xQy6PlMy50" },
      { title: "Complete DSA Course", url: "https://www.youtube.com/watch?v=kAylCH78SgA" }
    ]
  },
  OOPS: {
    concept: "Object-Oriented Programming",
    explanation: "OOP is a programming paradigm based on objects and classes. It promotes code reusability and modularity.",
    approaches: [
      "Learn core concepts: classes, objects, inheritance, polymorphism",
      "Understand encapsulation and abstraction",
      "Master design patterns",
      "Practice building real applications"
    ],
    timeComplexity: "Not applicable",
    spaceComplexity: "Depends on implementation",
    realWorldExample: "Building applications like Uber, Netflix, banking systems",
    videoLinks: [
      { title: "OOP Concepts", url: "https://www.youtube.com/watch?v=xoL6WDrfy2k" },
      { title: "Design Patterns", url: "https://www.youtube.com/watch?v=NU_1StN5Tkk" }
    ]
  },
  Frontend: {
    concept: "Frontend Development",
    explanation: "Frontend is about building user interfaces that users interact with directly. It involves HTML, CSS, and JavaScript.",
    approaches: [
      "Start with HTML and CSS basics",
      "Learn JavaScript fundamentals",
      "Master modern frameworks (React, Vue, Angular)",
      "Practice responsive design and accessibility"
    ],
    timeComplexity: "N/A",
    spaceComplexity: "Browser memory dependent",
    realWorldExample: "Building interactive websites, web applications, mobile apps",
    videoLinks: [
      { title: "Frontend Basics", url: "https://www.youtube.com/watch?v=qUUEqTTEd1I" },
      { title: "React Mastery", url: "https://www.youtube.com/watch?v=a_7Z7C_JCyo" }
    ]
  },
  Backend: {
    concept: "Backend Development",
    explanation: "Backend involves server-side development, databases, and business logic that power applications.",
    approaches: [
      "Learn a server framework (Express, Django, Spring)",
      "Understand databases and SQL",
      "Master authentication and authorization",
      "Learn deployment and DevOps basics"
    ],
    timeComplexity: "N/A",
    spaceComplexity: "Server memory dependent",
    realWorldExample: "Building APIs, managing databases, handling user authentication",
    videoLinks: [
      { title: "Backend Basics", url: "https://www.youtube.com/watch?v=5I1HI_AXZRY" },
      { title: "Node.js Mastery", url: "https://www.youtube.com/watch?v=RLtyhwFtEQY" }
    ]
  },
  Database: {
    concept: "Database Management",
    explanation: "Databases store, retrieve, and manage data efficiently. They are critical for any application.",
    approaches: [
      "Learn SQL basics",
      "Understand relational databases",
      "Learn NoSQL databases",
      "Master indexing and optimization"
    ],
    timeComplexity: "Query dependent",
    spaceComplexity: "Storage dependent",
    realWorldExample: "Managing millions of users, transactions, and data in systems like Facebook or Amazon",
    videoLinks: [
      { title: "SQL Masterclass", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
      { title: "MongoDB Complete", url: "https://www.youtube.com/watch?v=ofme2o29ngU" }
    ]
  }
};

// Coding questions with Python, Java, C, C++, JavaScript examples
export const codingQuestions = {
  Easy: [
    {
      id: 1,
      title: "Sum of Two Numbers",
      description: "Write a program to find the sum of two numbers",
      difficulty: "Easy",
      templates: {
        Python: "def add(a, b):\n    # Write your code here\n    pass",
        Java: "public class Solution {\n    public int add(int a, int b) {\n        // Write your code here\n        return 0;\n    }\n}",
        C: "int add(int a, int b) {\n    // Write your code here\n    return 0;\n}",
        "C++": "int add(int a, int b) {\n    // Write your code here\n    return 0;\n}",
        JavaScript: "function add(a, b) {\n    // Write your code here\n    return 0;\n}"
      },
      testCases: [
        { input: "2, 3", expected: "5" },
        { input: "10, 20", expected: "30" }
      ]
    },
    {
      id: 2,
      title: "Find Maximum",
      description: "Find the maximum number in an array",
      difficulty: "Easy",
      templates: {
        Python: "def findMax(arr):\n    # Write your code here\n    pass",
        Java: "public int findMax(int[] arr) {\n    // Write your code here\n    return 0;\n}",
        C: "int findMax(int arr[], int size) {\n    // Write your code here\n    return 0;\n}",
        "C++": "int findMax(vector<int> arr) {\n    // Write your code here\n    return 0;\n}",
        JavaScript: "function findMax(arr) {\n    // Write your code here\n    return 0;\n}"
      },
      testCases: [
        { input: "[1,5,3]", expected: "5" },
        { input: "[10,2,8]", expected: "10" }
      ]
    }
  ],
  Medium: [
    {
      id: 3,
      title: "Reverse a String",
      description: "Reverse the given string",
      difficulty: "Medium",
      templates: {
        Python: "def reverseString(s):\n    # Write your code here\n    pass"
      }
    },
    {
      id: 4,
      title: "Fibonacci Series",
      description: "Generate Fibonacci series up to n terms",
      difficulty: "Medium",
      templates: {
        Python: "def fibonacci(n):\n    # Write your code here\n    pass"
      }
    }
  ],
  Hard: [
    {
      id: 5,
      title: "Longest Palindrome",
      description: "Find the longest palindromic substring",
      difficulty: "Hard",
      templates: {
        Python: "def longestPalindrome(s):\n    # Write your code here\n    pass"
      }
    }
  ]
};
