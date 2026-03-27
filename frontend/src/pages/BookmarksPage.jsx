import { useEffect, useState } from "react";
import { fetchBookmarks } from "../services/testService";

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchBookmarks().then(setBookmarks);
  }, []);

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bookmarked Questions</h2>
      <div className="mt-6 grid gap-3">
        {bookmarks.length ? (
          bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
              <p className="font-semibold text-slate-900 dark:text-white">{bookmark.questionText}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {bookmark.topic} • {bookmark.difficulty}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No bookmarks yet. Save a question from the test lab.</p>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
