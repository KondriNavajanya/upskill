import { X, CheckCircle, XCircle, BarChart3 } from "lucide-react";

const ResultsModal = ({ results, category, difficulty, onClose }) => {
  const scorePercentage = results.score;
  const scoreColor = 
    scorePercentage >= 80 ? "text-green-600" :
    scorePercentage >= 60 ? "text-yellow-600" :
    "text-red-600";

  const gradeBg =
    scorePercentage >= 80 ? "bg-green-100" :
    scorePercentage >= 60 ? "bg-yellow-100" :
    "bg-red-100";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Test Results</h2>
            <p className="text-green-100">{category} - {difficulty}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Score Circle */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-48 h-48 rounded-full ${gradeBg} border-8 ${scoreColor} border-opacity-30`}>
              <div>
                <div className={`text-6xl font-bold ${scoreColor}`}>{Math.round(results.score)}</div>
                <div className="text-gray-600 text-lg">out of 100</div>
              </div>
            </div>
            <div className={`mt-6 text-2xl font-bold ${scoreColor}`}>
              Grade: {results.grade}
            </div>
          </div>

          {/* Score Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{results.correctCount}</div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-600">{results.totalCount - results.correctCount}</div>
              <div className="text-gray-600">Wrong Answers</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{results.totalCount}</div>
              <div className="text-gray-600">Total Questions</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 size={24} />
              Detailed Review
            </h3>
            <div className="space-y-4">
              {results.results?.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.isCorrect
                      ? "bg-green-50 border-green-600"
                      : "bg-red-50 border-red-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.isCorrect ? (
                      <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">
                        Q{index + 1}: {result.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-semibold">Your Answer:</span>{" "}
                          <span className={result.isCorrect ? "text-green-700" : "text-red-700"}>
                            Option {String.fromCharCode(65 + result.userAnswer)}
                          </span>
                        </p>
                        {!result.isCorrect && (
                          <p>
                            <span className="font-semibold">Correct Answer:</span>{" "}
                            <span className="text-green-700">
                              Option {String.fromCharCode(65 + result.correctAnswer)}
                            </span>
                          </p>
                        )}
                        <p className="text-gray-600 italic mt-2">
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className={`p-4 rounded-lg ${
            scorePercentage >= 80 ? "bg-green-100 border border-green-300" :
            scorePercentage >= 60 ? "bg-yellow-100 border border-yellow-300" :
            "bg-red-100 border border-red-300"
          }`}>
            <p className="font-semibold mb-2">
              {scorePercentage >= 80
                ? "🎉 Excellent work! You've mastered this topic."
                : scorePercentage >= 60
                ? "👍 Good job! Practice more to improve."
                : "📚 Keep practicing! Review the concepts and try again."}
            </p>
            <p className="text-gray-700 text-sm">
              {scorePercentage >= 80
                ? "You're ready to move to the next difficulty level."
                : "Focus on the questions you got wrong and review the explanations."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-gray-100 border-t p-4 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
          >
            Retake Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
