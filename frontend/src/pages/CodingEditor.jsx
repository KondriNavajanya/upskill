import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, BarChart3, BookOpen } from 'lucide-react';
import axios from 'axios';

const CodingEditor = () => {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const location = useLocation();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Python');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [userData, setUserData] = useState(null);

  const languages = ['Python', 'JavaScript', 'Java', 'C++', 'C'];

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
    fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/coding/problem/${problemId}`);
      setProblem(response.data.problem);
      setCode(response.data.problem.templates?.[language] || '');
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExplanation = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/coding/explanation/${problemId}`);
      setExplanation(response.data.explanation);
      setShowExplanation(true);
    } catch (error) {
      console.error('Error fetching explanation:', error);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (problem && problem.templates && problem.templates[newLanguage]) {
      setCode(problem.templates[newLanguage]);
    } else {
      setCode('');
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code first');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post('http://localhost:5000/api/coding/submit', {
        userId: userData?.id || userData?._id,
        problemId,
        language,
        code,
        topic: location.state?.topic,
        difficulty: location.state?.difficulty
      });

      setResult(response.data.result);
    } catch (error) {
      console.error('Error submitting code:', error);
      alert('Error submitting code: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Problem not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/coding')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{problem.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  problem.difficulty === 'Easy' ? 'text-green-600 bg-green-50' :
                  problem.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-50' :
                  'text-red-600 bg-red-50'
                }`}>
                  {problem.difficulty}
                </span>
                <span className="text-sm text-slate-600">{problem.topic}</span>
              </div>
            </div>
          </div>
          <button
            onClick={fetchExplanation}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            Explanation
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-140px)]">
        {/* Left Pane - Problem Description */}
        <div className="bg-white rounded-lg shadow-md overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Problem Description</h2>
            <p className="text-slate-700 mb-6">{problem.description}</p>

            {/* Examples */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Examples</h3>
                <div className="space-y-4">
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="font-mono text-sm mb-2">
                        <div className="text-slate-600">
                          <span className="font-semibold">Input:</span> {example.input}
                        </div>
                        <div className="text-slate-600 mt-1">
                          <span className="font-semibold">Output:</span> {example.output}
                        </div>
                      </div>
                      {example.explanation && (
                        <div className="text-slate-600 text-sm">
                          <span className="font-semibold">Explanation:</span> {example.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Constraints</h3>
                <p className="text-slate-600">{problem.constraints}</p>
              </div>
            )}

            {/* Hints */}
            {problem.hints && problem.hints.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Hints</h3>
                <ul className="space-y-2">
                  {problem.hints.map((hint, idx) => (
                    <li key={idx} className="text-slate-600 flex gap-3">
                      <span className="font-semibold text-blue-600 flex-shrink-0">💡</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Code Editor */}
        <div className="flex flex-col gap-4">
          {/* Language Selector */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Language</h3>
            <div className="flex gap-2 flex-wrap">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    language === lang
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col flex-1">
            <div className="bg-slate-900 text-white p-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Code Editor</span>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 px-4 py-2 rounded font-semibold transition-all"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm bg-slate-900 text-slate-100 resize-none focus:outline-none"
              placeholder="Write your code here..."
              spellCheck="false"
            />
          </div>

          {/* Result Display */}
          {result && (
            <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
              result.passed ? 'border-green-500' : 'border-red-500'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-lg font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {result.passed ? '✅ Accepted!' : '❌ Not Accepted'}
                </h3>
                <span className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {result.score}%
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <div>Tests Passed: {result.testsPassed}/{result.totalTests}</div>
                <div>Time Complexity: {result.timeComplexity || 'N/A'}</div>
                <div>Space Complexity: {result.spaceComplexity || 'N/A'}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanation Modal */}
      {showExplanation && explanation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{explanation.title}</h2>
              <button
                onClick={() => setShowExplanation(false)}
                className="text-2xl font-bold hover:opacity-80"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Core Idea */}
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-slate-900 mb-2">Core Idea</h3>
                <p className="text-slate-700">{explanation.coreIdea}</p>
              </div>

              {/* Approaches */}
              {explanation.approaches && explanation.approaches.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Approaches</h3>
                  <div className="space-y-3">
                    {explanation.approaches.map((approach, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded border border-slate-200">
                        <h4 className="font-semibold text-slate-900 mb-2">{approach.name}</h4>
                        <p className="text-slate-700 text-sm mb-2">{approach.description}</p>
                        <div className="flex gap-4 text-sm">
                          <div className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded">
                            <span className="font-semibold text-yellow-900">Time:</span>
                            <span className="text-yellow-800"> {approach.timeComplexity}</span>
                          </div>
                          <div className="bg-green-50 border border-green-200 px-3 py-1 rounded">
                            <span className="font-semibold text-green-900">Space:</span>
                            <span className="text-green-800"> {approach.spaceComplexity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hints */}
              {explanation.hints && explanation.hints.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Hints</h3>
                  <ul className="space-y-2">
                    {explanation.hints.map((hint, idx) => (
                      <li key={idx} className="text-slate-700 flex gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Constraints */}
              {explanation.constraints && (
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Constraints</h3>
                  <p className="text-slate-700 text-sm">{explanation.constraints}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingEditor;
