import { X, Youtube } from "lucide-react";

const ExplanationModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xlmax-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{data.concept}</h2>
            <p className="text-purple-100">Topic Explanation</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Concept Explanation */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <h3 className="font-bold text-blue-900 mb-2">Concept</h3>
            <p className="text-blue-800">{data.explanation}</p>
          </div>

          {/* Approaches */}
          {data.approaches && (
            <div>
              <h3 className="text-xl font-bold mb-4">Learning Approaches</h3>
              <ul className="space-y-2">
                {data.approaches.map((approach, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-purple-600 font-bold">{index + 1}.</span>
                    <span className="text-gray-700">{approach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Time & Space Complexity */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <h4 className="font-bold text-yellow-900 mb-2">Time Complexity</h4>
              <code className="text-yellow-800 font-mono">{data.timeComplexity}</code>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded">
              <h4 className="font-bold text-green-900 mb-2">Space Complexity</h4>
              <code className="text-green-800 font-mono">{data.spaceComplexity}</code>
            </div>
          </div>

          {/* Real World Example */}
          {data.realWorldExample && (
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
              <h3 className="font-bold text-indigo-900 mb-2">Real-World Example</h3>
              <p className="text-indigo-800">{data.realWorldExample}</p>
            </div>
          )}

          {/* Video Resources */}
          {data.videoLinks && data.videoLinks.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Youtube size={24} className="text-red-600" />
                Recommended Videos
              </h3>
              <div className="space-y-3">
                {data.videoLinks.map((video, index) => (
                  <a
                    key={index}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <Youtube size={20} className="text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">{video.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{video.url}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="sticky bottom-0 bg-gray-100 border-t p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
