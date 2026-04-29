'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
          <div className="max-w-md text-center">
            <div className="mb-6 inline-flex rounded-full bg-red-500/20 p-4">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
            <h1 className="mb-4 font-outfit text-3xl font-bold text-white">Something went wrong</h1>
            <p className="mb-8 text-white/60">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-white/90 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-all"
              >
                <Home className="h-4 w-4" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
