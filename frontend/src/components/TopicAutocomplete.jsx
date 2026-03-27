import { Search } from "lucide-react";
import useDebounce from "../hooks/useDebounce";
import { topics } from "../utils/topics";

const TopicAutocomplete = ({ value, onChange }) => {
  const debounced = useDebounce(value);
  const suggestions = debounced
    ? topics.filter((topic) => topic.toLowerCase().includes(debounced.toLowerCase())).slice(0, 5)
    : topics.slice(0, 5);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
      <input
        className="input pl-10"
        placeholder="Search topics like Trees, Backend, Databases..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="absolute z-10 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        {suggestions.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => onChange(topic)}
            className="block w-full px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicAutocomplete;
