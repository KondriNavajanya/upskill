import { useEffect, useMemo, useState } from "react";
import {
  bulkUploadProblems,
  createProblemAdmin,
  deleteProblemAdmin,
  generateProblemWithAI,
  getAllProblems,
  getProblemById,
  updateProblemAdmin
} from "../services/problemService";

const emptyExample = { input: "", output: "", explanation: "" };
const emptyTestCase = { input: "", output: "", hidden: false };

const getInitialForm = () => ({
  title: "",
  difficulty: "Easy",
  tags: "",
  description: "",
  constraints: "",
  examples: [{ ...emptyExample }],
  testCases: [{ ...emptyTestCase }],
  starterCode: {
    javascript: "",
    python: "",
    cpp: ""
  }
});

const AdminProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loadingProblems, setLoadingProblems] = useState(false);

  const [form, setForm] = useState(getInitialForm());
  const [editingId, setEditingId] = useState(null);
  const [savingForm, setSavingForm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [bulkData, setBulkData] = useState([]);
  const [bulkUploading, setBulkUploading] = useState(false);

  const [aiTopic, setAiTopic] = useState("Dynamic Programming");
  const [aiDifficulty, setAiDifficulty] = useState("Medium");
  const [aiPreview, setAiPreview] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const modeLabel = useMemo(() => (editingId ? "Edit Problem" : "Create Problem"), [editingId]);

  useEffect(() => {
    loadProblems(1);
  }, []);

  const loadProblems = async (page) => {
    setLoadingProblems(true);
    setError("");

    try {
      const data = await getAllProblems({ page, limit: 10 });
      setProblems(data.problems || []);
      setPagination(data.pagination || { page: 1, pages: 1 });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch problems");
    } finally {
      setLoadingProblems(false);
    }
  };

  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleStarterCodeChange = (lang, value) => {
    setForm((prev) => ({
      ...prev,
      starterCode: {
        ...prev.starterCode,
        [lang]: value
      }
    }));
  };

  const handleExampleChange = (index, key, value) => {
    setForm((prev) => {
      const next = [...prev.examples];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, examples: next };
    });
  };

  const handleTestCaseChange = (index, key, value) => {
    setForm((prev) => {
      const next = [...prev.testCases];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, testCases: next };
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(getInitialForm());
  };

  const buildPayload = (formData) => ({
    title: formData.title,
    difficulty: formData.difficulty,
    tags: formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    description: formData.description,
    constraints: formData.constraints,
    examples: formData.examples,
    testCases: formData.testCases,
    starterCode: formData.starterCode
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSavingForm(true);
    setMessage("");
    setError("");

    try {
      const payload = buildPayload(form);

      if (editingId) {
        await updateProblemAdmin(editingId, payload);
        setMessage("Problem updated successfully");
      } else {
        await createProblemAdmin(payload);
        setMessage("Problem created successfully");
      }

      resetForm();
      loadProblems(1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save problem");
    } finally {
      setSavingForm(false);
    }
  };

  const populateFormForEdit = async (problem) => {
    setError("");

    try {
      const fullProblem = await getProblemById(problem._id);

      setEditingId(fullProblem._id);
      setForm({
        title: fullProblem.title || "",
        difficulty: fullProblem.difficulty || "Easy",
        tags: (fullProblem.tags || []).join(", "),
        description: fullProblem.description || "",
        constraints: Array.isArray(fullProblem.constraints)
          ? fullProblem.constraints.join("\n")
          : fullProblem.constraints || "",
        examples: fullProblem.examples?.length ? fullProblem.examples : [{ ...emptyExample }],
        testCases: fullProblem.testCases?.length
          ? fullProblem.testCases.map((testCase) => ({
              input: testCase.input || "",
              output: testCase.output || "",
              hidden: Boolean(testCase.hidden ?? testCase.isHidden)
            }))
          : [{ ...emptyTestCase }],
        starterCode: {
          javascript: fullProblem.starterCode?.javascript || "",
          python: fullProblem.starterCode?.python || "",
          cpp: fullProblem.starterCode?.cpp || ""
        }
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load problem for editing");
    }
  };

  const handleDelete = async (problemId) => {
    const confirmed = window.confirm("Delete this problem?");
    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await deleteProblemAdmin(problemId);
      setMessage("Problem deleted");
      loadProblems(pagination.page || 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete problem");
    }
  };

  const handleBulkFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of problems");
      }

      setBulkData(parsed);
      setMessage(`Loaded ${parsed.length} problems for bulk upload`);
    } catch (err) {
      setBulkData([]);
      setError(err.message || "Invalid JSON file");
    }
  };

  const handleBulkUpload = async () => {
    if (bulkData.length === 0) {
      setError("Upload a valid JSON file first");
      return;
    }

    setBulkUploading(true);
    setError("");
    setMessage("");

    try {
      const data = await bulkUploadProblems(bulkData);
      setMessage(`Bulk upload done. Created: ${data.createdCount}, Skipped: ${data.skippedCount}`);
      setBulkData([]);
      loadProblems(1);
    } catch (err) {
      setError(err?.response?.data?.message || "Bulk upload failed");
    } finally {
      setBulkUploading(false);
    }
  };

  const handleGenerateWithAI = async () => {
    setAiLoading(true);
    setError("");
    setMessage("");

    try {
      const generated = await generateProblemWithAI({ topic: aiTopic, difficulty: aiDifficulty });
      setAiPreview(generated);
      setMessage("AI problem generated successfully");
      loadProblems(1);
    } catch (err) {
      setAiPreview(null);
      setError(err?.response?.data?.message || "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSavePreview = async () => {
    if (!aiPreview) {
      setError("Generate a problem first");
      return;
    }

    setSavingForm(true);
    setError("");
    setMessage("");

    try {
      await createProblemAdmin({
        title: aiPreview.title,
        difficulty: aiPreview.difficulty,
        tags: aiPreview.tags || [aiTopic],
        description: aiPreview.description,
        constraints: aiPreview.constraints,
        examples: aiPreview.examples,
        testCases: aiPreview.testCases,
        starterCode: aiPreview.starterCode
      });

      setMessage("AI preview saved as admin problem");
      loadProblems(1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save AI preview");
    } finally {
      setSavingForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Problem Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Create, edit, upload, and generate coding problems.
        </p>
      </div>

      {(message || error) && (
        <div className={`glass-card p-4 text-sm ${error ? "text-red-600" : "text-emerald-600"}`}>
          {error || message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[2fr_3fr]">
        <section className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{modeLabel}</h2>
            {editingId && (
              <button className="btn-secondary" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Title"
              value={form.title}
              onChange={(event) => handleFormChange("title", event.target.value)}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                className="input"
                value={form.difficulty}
                onChange={(event) => handleFormChange("difficulty", event.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <input
                className="input"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(event) => handleFormChange("tags", event.target.value)}
              />
            </div>

            <textarea
              className="input min-h-28"
              placeholder="Description"
              value={form.description}
              onChange={(event) => handleFormChange("description", event.target.value)}
              required
            />

            <textarea
              className="input min-h-20"
              placeholder="Constraints"
              value={form.constraints}
              onChange={(event) => handleFormChange("constraints", event.target.value)}
              required
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Examples</h3>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      examples: [...prev.examples, { ...emptyExample }]
                    }))
                  }
                >
                  Add Example
                </button>
              </div>

              {form.examples.map((example, index) => (
                <div key={`example-${index}`} className="space-y-2 rounded-2xl border p-3">
                  <textarea
                    className="input"
                    placeholder="Input"
                    value={example.input}
                    onChange={(event) => handleExampleChange(index, "input", event.target.value)}
                  />
                  <textarea
                    className="input"
                    placeholder="Output"
                    value={example.output}
                    onChange={(event) => handleExampleChange(index, "output", event.target.value)}
                  />
                  <textarea
                    className="input"
                    placeholder="Explanation"
                    value={example.explanation}
                    onChange={(event) =>
                      handleExampleChange(index, "explanation", event.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Test Cases</h3>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      testCases: [...prev.testCases, { ...emptyTestCase }]
                    }))
                  }
                >
                  Add Test Case
                </button>
              </div>

              {form.testCases.map((testCase, index) => (
                <div key={`test-case-${index}`} className="space-y-2 rounded-2xl border p-3">
                  <textarea
                    className="input"
                    placeholder="Input"
                    value={testCase.input}
                    onChange={(event) => handleTestCaseChange(index, "input", event.target.value)}
                  />
                  <textarea
                    className="input"
                    placeholder="Output"
                    value={testCase.output}
                    onChange={(event) => handleTestCaseChange(index, "output", event.target.value)}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(testCase.hidden)}
                      onChange={(event) =>
                        handleTestCaseChange(index, "hidden", event.target.checked)
                      }
                    />
                    Hidden test case
                  </label>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Starter Code</h3>
              <textarea
                className="input min-h-24"
                placeholder="JavaScript starter code"
                value={form.starterCode.javascript}
                onChange={(event) => handleStarterCodeChange("javascript", event.target.value)}
              />
              <textarea
                className="input min-h-24"
                placeholder="Python starter code"
                value={form.starterCode.python}
                onChange={(event) => handleStarterCodeChange("python", event.target.value)}
              />
              <textarea
                className="input min-h-24"
                placeholder="C++ starter code"
                value={form.starterCode.cpp}
                onChange={(event) => handleStarterCodeChange("cpp", event.target.value)}
              />
            </div>

            <button className="btn-primary w-full" type="submit" disabled={savingForm}>
              {savingForm ? "Saving..." : editingId ? "Update Problem" : "Create Problem"}
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <div className="glass-card p-5">
            <h2 className="text-xl font-semibold">AI Problem Generator</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <input
                className="input"
                value={aiTopic}
                onChange={(event) => setAiTopic(event.target.value)}
                placeholder="Topic"
              />
              <select
                className="input"
                value={aiDifficulty}
                onChange={(event) => setAiDifficulty(event.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <button className="btn-primary" onClick={handleGenerateWithAI} disabled={aiLoading}>
                {aiLoading ? "Generating..." : "Generate"}
              </button>
            </div>

            {aiPreview && (
              <div className="mt-4 space-y-3 rounded-2xl border p-4">
                <h3 className="text-lg font-semibold">{aiPreview.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{aiPreview.description}</p>
                <p className="text-xs text-slate-500">Difficulty: {aiPreview.difficulty}</p>
                <button className="btn-secondary" onClick={handleSavePreview} disabled={savingForm}>
                  Save AI Problem
                </button>
              </div>
            )}
          </div>

          <div className="glass-card p-5">
            <h2 className="text-xl font-semibold">Bulk Upload JSON</h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input type="file" accept="application/json" onChange={handleBulkFile} />
              <button className="btn-primary" onClick={handleBulkUpload} disabled={bulkUploading}>
                {bulkUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {bulkData.length > 0 && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Preview loaded: {bulkData.length} problems
              </p>
            )}
          </div>

          <div className="glass-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Manage Existing Problems</h2>
              <button className="btn-secondary" onClick={() => loadProblems(pagination.page || 1)}>
                Refresh
              </button>
            </div>

            {loadingProblems ? (
              <p className="text-sm">Loading problems...</p>
            ) : problems.length === 0 ? (
              <p className="text-sm text-slate-500">No problems found</p>
            ) : (
              <div className="space-y-3">
                {problems.map((problem) => (
                  <div key={problem._id} className="rounded-2xl border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{problem.title}</p>
                        <p className="text-xs text-slate-500">
                          {problem.difficulty} | Source: {problem.source || "manual"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-secondary" onClick={() => populateFormForEdit(problem)}>
                          Edit
                        </button>
                        <button className="btn-secondary" onClick={() => handleDelete(problem._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pagination.pages > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: pagination.pages }, (_, idx) => idx + 1).map((page) => (
                  <button
                    key={`admin-page-${page}`}
                    className={page === pagination.page ? "btn-primary" : "btn-secondary"}
                    onClick={() => loadProblems(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminProblemsPage;
