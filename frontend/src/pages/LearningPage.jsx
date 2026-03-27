import { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Play, Lightbulb } from "lucide-react";
import MCQTest from "../components/MCQTest";
import ExplanationModal from "../components/ExplanationModal";
import ResultsModal from "../components/ResultsModal";

const LearningPage = () => {
  const [categories] = useState([
    "DSA",
    "OOPS",
    "Frontend",
    "Backend",
    "Database"
  ]);

  const [difficulties] = useState(["Easy", "Medium", "Hard"]);
  const [selectedCategory, setSelectedCategory] = useState("DSA");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
  const [testStarted, setTestStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationData, setExplanationData] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleShowExplanation = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/learn/explain", {
        params: { topic: selectedCategory }
      });
      setExplanationData(response.data);
      setShowExplanation(true);
    } catch (error) {
      console.error("Error fetching explanation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestComplete = (results) => {
    setTestResults(results);
    setTestStarted(false);
  };

  if (testStarted) {
    return (
      <MCQTest
        category={selectedCategory}
        difficulty={selectedDifficulty}
        onTestComplete={handleTestComplete}
        onCancel={() => setTestStarted(false)}
      />
    );
  }

  if (testResults) {
    return (
      <ResultsModal
        results={testResults}
        category={selectedCategory}
        difficulty={selectedDifficulty}
        onClose={() => setTestResults(null)}
      />
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">AI Learning Platform</h1>
        <p className="text-blue-100">Enhance your coding skills with personalized tests and AI explanations</p>
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BookOpen className="mr-2" />
          Select Topic
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Select Difficulty</h2>
        <div className="flex gap-4">
          {difficulties.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`py-3 px-6 rounded-lg font-semibold transition-all ${
                selectedDifficulty === difficulty
                  ? `text-white shadow-lg scale-105 ${
                      difficulty === "Easy"
                        ? "bg-green-600"
                        : difficulty === "Medium"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Start Test Button */}
        <button
          onClick={handleStartTest}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 px-8 rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-3 hover:scale-105"
        >
          <Play size={24} />
          Start Test ({selectedCategory} - {selectedDifficulty})
        </button>

        {/* Explanation Button */}
        <button
          onClick={handleShowExplanation}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-8 rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-3 hover:scale-105 disabled:opacity-50"
        >
          <Lightbulb size={24} />
          {loading ? "Loading..." : "Get Explanation"}
        </button>
      </div>

      {/* Explanation Modal */}
      {showExplanation && explanationData && (
        <ExplanationModal
          data={explanationData}
          onClose={() => setShowExplanation(false)}
        />
      )}

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">5-10</div>
          <p className="text-gray-600 mt-2">Questions per test</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600">3</div>
          <p className="text-gray-600 mt-2">Difficulty levels</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">5</div>
          <p className="text-gray-600 mt-2">Learning topics</p>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
