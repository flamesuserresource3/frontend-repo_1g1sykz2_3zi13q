import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

function Bar({ label, value, max, color = 'bg-blue-500' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard({ logs }) {
  const stats = useMemo(() => {
    const byTopic = new Map();
    const byDifficulty = new Map();
    const byWeek = new Map();
    let totalMinutes = 0;
    let solved = 0;

    for (const l of logs) {
      totalMinutes += l.minutes || 0;
      if (l.result === 'Solved') solved += 1;

      byTopic.set(l.topic, (byTopic.get(l.topic) || 0) + 1);
      byDifficulty.set(l.difficulty, (byDifficulty.get(l.difficulty) || 0) + 1);

      const d = new Date(l.date);
      const weekKey = `${d.getFullYear()}-W${Math.ceil((d.getDate() + ((d.getDay() + 6) % 7)) / 7)}`;
      byWeek.set(weekKey, (byWeek.get(weekKey) || 0) + 1);
    }

    const topicArr = Array.from(byTopic.entries()).sort((a, b) => b[1] - a[1]);
    const diffArr = Array.from(byDifficulty.entries()).sort((a, b) => b[1] - a[1]);
    const weekArr = Array.from(byWeek.entries()).sort();

    const avgTime = logs.length ? Math.round(totalMinutes / logs.length) : 0;
    const maxTopic = topicArr.length ? Math.max(...topicArr.map((x) => x[1])) : 0;
    const maxWeek = weekArr.length ? Math.max(...weekArr.map((x) => x[1])) : 0;

    return { topicArr, diffArr, weekArr, avgTime, solved, maxTopic, maxWeek };
  }, [logs]);

  return (
    <section id="dashboard" className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-5 space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">By Topic</h3>
            {stats.topicArr.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">No data yet — add your first log above.</p>
            )}
            {stats.topicArr.map(([label, value]) => (
              <Bar key={label} label={label} value={value} max={stats.maxTopic} />
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-5 space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Last Weeks</h3>
            {stats.weekArr.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">Logs will appear here grouped by week.</p>
            )}
            {stats.weekArr.map(([label, value]) => (
              <Bar key={label} label={label} value={value} max={stats.maxWeek} color="bg-violet-500" />
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-5 space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 p-4">
                <p className="text-xs text-blue-700 dark:text-blue-300">Total Solved</p>
                <p className="text-2xl font-semibold text-blue-900 dark:text-blue-200">{stats.solved}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4">
                <p className="text-xs text-emerald-700 dark:text-emerald-300">Avg Time</p>
                <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-200">{stats.avgTime}m</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Difficulty</h4>
              <div className="space-y-2">
                {stats.diffArr.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
