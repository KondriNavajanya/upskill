import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import { getAllProblems, getAllTags } from "../services/problemService";

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "",
    tag: "",
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadProblems();
    loadTags();
  }, []);

  useEffect(() => {
    loadProblems();
  }, [filters.difficulty, filters.tag, filters.page]);

  const loadProblems = async () => {
    setLoading(true);
    try {
      const data = await getAllProblems(filters);
      setProblems(data.problems);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to load problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const data = await getAllTags();
      setTags(data);
    } catch (error) {
      console.error("Failed to load tags:", error);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const difficultyColors = {
    Easy: "text-green-600 bg-green-50 dark:bg-green-900/20",
    Medium: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
    Hard: "text-red-600 bg-red-50 dark:bg-red-900/20"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Coding Problems
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Practice coding problems and master your skills
        </p>
      </div>

      {/* Filters and Search */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search problems..."
              className="bg-transparent outline-none text-sm"
              onChange={handleSearch}
            />
          </div>
        </div>

        <select
          className="glass-card p-4 text-sm outline-none"
          onChange={(e) =>
            setFilters({ ...filters, difficulty: e.target.value, page: 1 })
          }
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          className="glass-card p-4 text-sm outline-none"
          onChange={(e) =>
            setFilters({ ...filters, tag: e.target.value, page: 1 })
          }
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Problems List */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading problems...</div>
        ) : problems.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No problems found</div>
        ) : (
          <div className="divide-y">
            {problems.map((problem) => (
              <div
                key={problem._id}
                onClick={() => navigate(`/problem/${problem._id}`)}
                className="flex cursor-pointer items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {problem.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {problem.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-200 px-2 py-1 text-xs dark:bg-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                      difficultyColors[problem.difficulty]
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {problem.solved} solved
                    </p>
                    <p className="text-slate-500">
                      {Math.round(problem.acceptanceRate)}% acceptance
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (page) => (
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
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;
