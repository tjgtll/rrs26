import React from 'react';
import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-state" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
          <p>Something went wrong</p>
          <p style={{ fontSize: '1rem', color: '#666' }}>{this.state.errorMessage}</p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '1rem 1rem',
              backgroundColor: 'var(--button-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '1rem',
              cursor: 'pointer',
            }}
          >
            again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}