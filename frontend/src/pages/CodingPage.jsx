import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Code, Trophy, BarChart3 } from 'lucide-react';
import axios from 'axios';
import StatCard from '../components/StatCard';

const CodingPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('DSA');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [userData, setUserData] = useState(null);

  const categories = ['DSA', 'OOPS', 'Frontend', 'Backend', 'Database'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Load user data from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserData(userData);
      fetchStats(userData.id || userData._id);
    }
  }, []);

  // Fetch problems when category or difficulty changes
  useEffect(() => {
    fetchProblems(activeCategory, selectedDifficulty);
  }, [activeCategory, selectedDifficulty]);

  const fetchProblems = async (topic, difficulty) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/coding/problems/${topic}/${difficulty}`);
      setProblems(response.data.problems || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/coding/stats/${userId}`);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStartCoding = (problemId) => {
    navigate(`/coding-editor/${problemId}`, {
      state: {
        topic: activeCategory,
        difficulty: selectedDifficulty
      }
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyBgColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'border-l-4 border-green-500';
      case 'Medium':
        return 'border-l-4 border-yellow-500';
      case 'Hard':
        return 'border-l-4 border-red-500';
      default:
        return 'border-l-4 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Coding Lab</h1>
              <p className="text-slate-600 mt-1">Master problem-solving with LeetCode-style challenges</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Trophy}
              title="Total Solved"
              value={stats.solvedProblems}
              color="from-green-500 to-green-600"
            />
            <StatCard
              icon={Code}
              title="Attempted"
              value={stats.attemptedProblems}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={BarChart3}
              title="Submissions"
              value={stats.totalSubmissions}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              icon={Trophy}
              title="Avg Score"
              value={`${stats.averageScore}%`}
              color="from-yellow-500 to-yellow-600"
            />
          </div>
        )}

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Select Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSelectedDifficulty('Easy');
                }}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Select Difficulty</h2>
          <div className="flex gap-3">
            {difficulties.map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`py-2 px-6 rounded-lg font-semibold transition-all ${
                  selectedDifficulty === difficulty
                    ? `${getDifficultyColor(difficulty)} scale-105`
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-400'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Problems List */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {activeCategory} - {selectedDifficulty} ({problems.length} problems)
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-slate-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                Loading problems...
              </div>
            </div>
          ) : problems.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-slate-600 text-lg">No problems available for this category and difficulty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <div
                  key={problem.id}
                  className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all ${getDifficultyBgColor(problem.difficulty)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-slate-400 font-semibold text-lg">{index + 1}.</span>
                        <h3 className="text-lg font-bold text-slate-900">{problem.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{problem.description}</p>
                      
                      {/* Core Idea */}
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
                        <p className="text-blue-900 text-sm">
                          <span className="font-semibold">Core Idea:</span> {problem.coreIdea}
                        </p>
                      </div>

                      {/* Approaches and Complexity */}
                      {problem.approaches && problem.approaches.length > 0 && (
                        <div className="bg-slate-50 p-3 rounded mb-3">
                          <p className="font-semibold text-slate-900 text-sm mb-2">Approaches:</p>
                          <div className="space-y-2">
                            {problem.approaches.map((approach, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-semibold text-slate-700">{approach.name}:</span>
                                <span className="text-slate-600 mx-2">
                                  Time: {approach.timeComplexity} | Space: {approach.spaceComplexity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Examples Preview */}
                      {problem.examples && problem.examples.length > 0 && (
                        <div className="text-xs text-slate-500">
                          <span className="font-semibold">Examples:</span> {problem.examples.length} test case(s)
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleStartCoding(problem.id)}
                      className="ml-4 flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      Solve
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingPage;
