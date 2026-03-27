import { useEffect, useState } from "react";
import { getSubmissions } from "../services/problemService";

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    problemId: "",
    page: 1,
    limit: 50
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadSubmissions();
  }, [filters.page]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getSubmissions(filters);
      setSubmissions(data.submissions);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to load submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Accepted: "text-green-600 bg-green-50 dark:bg-green-900/20",
    WrongAnswer: "text-red-600 bg-red-50 dark:bg-red-900/20",
    TimeLimitExceeded: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
    RuntimeError: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    Pending: "text-slate-600 bg-slate-50 dark:bg-slate-900/20"
  };

  const languageColors = {
    javascript: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    python: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    cpp: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Submission History
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Track all your code submissions and results
        </p>
      </div>

      {/* Submissions Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No submissions yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Problem</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Language</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Memory</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Test Results</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {submissions.map((submission) => (
                  <tr
                    key={submission._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {submission.problemId?.title || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                          statusColors[submission.status]
                        }`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                          languageColors[submission.language]
                        }`}
                      >
                        {submission.language}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {submission.runtime}ms
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {submission.memory}MB
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {submission.passedTestCases}/{submission.totalTestCases}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-center gap-2">
          {Array.from(
            { length: Math.min(5, pagination.pages || 1) },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() => setFilters({ ...filters, page })}
              className={`px-3 py-2 rounded-lg ${
                filters.page === page
                  ? "btn-primary"
                  : "glass-card hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionsPage;
