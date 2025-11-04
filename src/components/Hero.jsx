import React from 'react';
import Spline from '@splinetool/react-spline';
import { Brain, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-medium ring-1 ring-blue-500/20">
              <CheckCircle2 className="h-4 w-4" />
              Master DSA with data-driven focus
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              DSA Tracker
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              Plan, track, and improve your DSA prep. Log problems, visualize progress, and get AI-powered next problem recommendations tailored to your weak spots.
            </p>
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
              <a href="#log" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium shadow hover:bg-blue-700 transition">
                <Brain className="h-4 w-4" />
                Log a Problem
              </a>
              <a href="#dashboard" className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-sm font-medium ring-1 ring-gray-200 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                View Dashboard
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2 h-[360px] sm:h-[420px] lg:h-[480px] w-full rounded-2xl overflow-hidden relative">
            <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/60 via-transparent to-blue-200/40 dark:from-gray-900/60 dark:to-blue-900/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
