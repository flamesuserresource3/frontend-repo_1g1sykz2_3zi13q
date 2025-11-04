import React, { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero';
import ProblemForm from './components/ProblemForm';
import Dashboard from './components/Dashboard';
import AISuggestions from './components/AISuggestions';
import { RefreshCw, Sun, Moon } from 'lucide-react';

function useSessionData(keyBase) {
  const [sessionId] = useState(() => {
    const existing = sessionStorage.getItem('dsa-session-id');
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem('dsa-session-id', id);
    return id;
  });

  const key = `${keyBase}:${sessionId}`;

  function read() {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }
  function write(val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
  function clear() {
    localStorage.removeItem(key);
  }

  return { read, write, clear };
}

export default function App() {
  const store = useSessionData('dsa-logs');
  const [logs, setLogs] = useState(() => store.read());
  const [theme, setTheme] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  ));

  useEffect(() => {
    store.write(logs);
  }, [logs]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  function addLog(entry) {
    setLogs((prev) => [entry, ...prev]);
  }

  function resetDemo() {
    store.clear();
    setLogs([]);
  }

  const headerStats = useMemo(() => {
    const total = logs.length;
    const solved = logs.filter((l) => l.result === 'Solved').length;
    return { total, solved };
  }, [logs]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-900">
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 grid place-items-center text-white font-bold">D</div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">DSA Tracker</p>
              <p className="text-[11px] text-gray-600 dark:text-gray-300">Master DSA with data-driven focus</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 ml-6 text-xs text-gray-600 dark:text-gray-300">
              <span>Logs: <span className="font-medium text-gray-900 dark:text-white">{headerStats.total}</span></span>
              <span>Solved: <span className="font-medium text-gray-900 dark:text-white">{headerStats.solved}</span></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-gray-700">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">Theme</span>
            </button>
            <button onClick={resetDemo} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-blue-700">
              <RefreshCw className="h-4 w-4" /> Reset Demo Data
            </button>
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <ProblemForm onAdd={addLog} />
        <Dashboard logs={logs} />
        <AISuggestions logs={logs} />
      </main>

      <footer className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-5 text-center text-sm text-gray-600 dark:text-gray-300">
            Built with love for learners. Data is stored per browser session for demo purposes. No sign-in required.
          </div>
        </div>
      </footer>
    </div>
  );
}
