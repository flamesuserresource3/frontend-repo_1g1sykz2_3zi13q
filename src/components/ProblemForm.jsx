import React, { useMemo, useState } from 'react';
import { Plus, Timer, Calendar } from 'lucide-react';

const PLATFORMS = ['LeetCode', 'Codeforces', 'CodeChef', 'HackerRank', 'AtCoder'];
const TOPICS = ['Arrays', 'Strings', 'Hashing', 'Two Pointers', 'Binary Search', 'Recursion', 'Backtracking', 'DP', 'Graphs', 'Trees', 'Heaps', 'Greedy', 'Math'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const RESULTS = ['Solved', 'Attempted', 'Stuck'];

export default function ProblemForm({ onAdd }) {
  const [form, setForm] = useState({
    platform: 'LeetCode',
    topic: 'Arrays',
    difficulty: 'Easy',
    minutes: 30,
    result: 'Solved',
    date: new Date().toISOString().slice(0, 10),
    title: '',
    url: '',
  });

  const isValid = useMemo(() => {
    return form.minutes > 0 && form.title.trim().length >= 3;
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'minutes' ? Number(value) : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    const entry = {
      id: crypto.randomUUID(),
      ...form,
      createdAt: new Date().toISOString(),
    };
    onAdd(entry);
    // reset title/url for faster logging
    setForm((prev) => ({ ...prev, title: '', url: '' }));
  }

  return (
    <section id="log" className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-5">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Problem Log</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 dark:text-gray-300">Platform</label>
              <select name="platform" value={form.platform} onChange={handleChange} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 dark:text-gray-300">Topic</label>
              <select name="topic" value={form.topic} onChange={handleChange} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 dark:text-gray-300">Difficulty</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1"><Timer className="h-4 w-4" /> Time (min)</label>
              <input type="number" min={1} name="minutes" value={form.minutes} onChange={handleChange} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
            </div>

            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm text-gray-600 dark:text-gray-300">Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g., 2 Sum or CF 1872A" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
            </div>

            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm text-gray-600 dark:text-gray-300">Link</label>
              <input type="url" name="url" value={form.url} onChange={handleChange} placeholder="https://leetcode.com/problems/two-sum" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1"><Calendar className="h-4 w-4" /> Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 dark:text-gray-300">Result</label>
              <select name="result" value={form.result} onChange={handleChange} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
                {RESULTS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 flex justify-end">
              <button disabled={!isValid} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
                <Plus className="h-4 w-4" /> Add Log
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
