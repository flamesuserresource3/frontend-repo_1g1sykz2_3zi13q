import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

// Simple client-side heuristic "AI"
function analyzeWeakTopics(logs) {
  const topicStats = new Map();
  for (const l of logs) {
    const s = topicStats.get(l.topic) || { total: 0, solved: 0, avgTime: 0 };
    s.total += 1;
    if (l.result === 'Solved') s.solved += 1;
    s.avgTime += l.minutes || 0;
    topicStats.set(l.topic, s);
  }
  const arr = Array.from(topicStats.entries()).map(([topic, s]) => ({
    topic,
    total: s.total,
    solvedRate: s.total ? s.solved / s.total : 0,
    avgTime: s.total ? Math.round(s.avgTime / s.total) : 0,
  }));
  arr.sort((a, b) => a.solvedRate - b.solvedRate || b.avgTime - a.avgTime);
  return arr;
}

function generateProblem(title, topic, difficulty, platform = 'LeetCode') {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    title,
    topic,
    difficulty,
    platform,
    url: `https://${platform.toLowerCase()}.com/problems/${slug}`,
  };
}

function nextProblems(logs, count = 10) {
  const weak = analyzeWeakTopics(logs);
  const pool = weak.length ? weak.slice(0, 3).map((w) => w.topic) : ['Arrays', 'DP', 'Graphs'];
  const diffs = ['Easy', 'Medium', 'Medium', 'Hard'];

  const ideas = [
    (t) => generateProblem(`${t} Fundamentals Warm-up`, t, 'Easy'),
    (t) => generateProblem(`${t} Patterns Drill`, t, 'Medium'),
    (t) => generateProblem(`${t} Edge Cases`, t, 'Medium'),
    (t) => generateProblem(`${t} Challenge`, t, 'Hard'),
    (t) => generateProblem(`${t} Mixed Review`, t, 'Medium'),
  ];

  const result = [];
  for (let i = 0; i < count; i++) {
    const t = pool[i % pool.length];
    const idea = ideas[i % ideas.length];
    const item = idea(t);
    // Adjust difficulty pattern
    item.difficulty = diffs[i % diffs.length];
    result.push(item);
  }
  return result;
}

export default function AISuggestions({ logs }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your DSA Coach. Ask for a plan, a challenge set, or a summary of your progress." },
  ]);

  const suggestions = useMemo(() => nextProblems(logs, 10), [logs]);
  const weak = useMemo(() => analyzeWeakTopics(logs).slice(0, 3), [logs]);

  function handleAsk(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: 'user', content: q }]);

    // Simple intent parsing
    const lower = q.toLowerCase();
    let reply = '';
    if (lower.includes('summary') || lower.includes('progress')) {
      const total = logs.length;
      const solved = logs.filter((l) => l.result === 'Solved').length;
      const avg = total ? Math.round(logs.reduce((a, l) => a + (l.minutes || 0), 0) / total) : 0;
      reply = `You've logged ${total} problems with ${solved} solved. Your average solve time is ${avg} minutes. Focus next on ${weak.map(w => w.topic).join(', ') || 'core fundamentals'}.`;
    } else if (lower.includes('binary search')) {
      reply = 'Here are 5 binary search practice prompts: 1) Lower Bound in Rotated Array, 2) Kth Missing Positive, 3) Aggressive Cows, 4) Median of Two Arrays (BS on answer), 5) Peak Element. Start with Easy→Medium.';
    } else if (lower.includes('dp') || lower.includes('dynamic programming')) {
      reply = 'DP sprint (3 days): Day 1 - 1D DP (climb stairs, house robber). Day 2 - Knapsack & subsets. Day 3 - Grid DP (unique paths, min path sum). Keep notes of transitions.';
    } else if (lower.includes('plan')) {
      reply = 'Revision plan: alternate topics daily (Arrays ⇄ DP ⇄ Graphs). Do 2 Easy warm-ups, 2 Medium patterns, 1 Hard challenge each day.';
    } else {
      reply = 'Got it! I recommend practicing your weaker topics next: ' + (weak.map(w => w.topic).join(', ') || 'Arrays/DP') + '. Ask for a plan or a custom set by topic.';
    }
    setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    setInput('');
  }

  useEffect(() => {
    // Auto message reacting to weak topics
    if (!logs.length) return;
    const t = weak.map((w) => w.topic).join(', ');
    if (!t) return;
  }, [logs, weak]);

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Challenge Generator</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Next 10 Problems (personalized)</h3>
              <ul className="space-y-2">
                {suggestions.map((s, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3 bg-white dark:bg-gray-900">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{s.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{s.platform} • {s.topic} • {s.difficulty}</p>
                    </div>
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Open</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Ask DSA Coach</h3>
              <div className="h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 p-3 bg-white dark:bg-gray-900 mb-3 space-y-3">
                {messages.map((m, idx) => (
                  <div key={idx} className={m.role === 'assistant' ? 'text-gray-800 dark:text-gray-200 text-sm' : 'text-gray-700 dark:text-gray-300 text-sm font-medium'}>
                    {m.content}
                  </div>
                ))}
              </div>
              <form onSubmit={handleAsk} className="flex items-center gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g., Summarize my weekly progress" className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
                <button className="inline-flex items-center gap-1 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-blue-700">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
