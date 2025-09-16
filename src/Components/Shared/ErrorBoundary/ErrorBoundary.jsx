import React from 'react';
import s from './ErrorBoundary.module.scss';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={s.errorContainer}>
          <div className={s.errorContent}>
            <h1 className={s.errorTitle}>Something went wrong</h1>
            <p className={s.errorMessage}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button 
              className={s.retryButton}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={s.errorDetails}>
                <summary>Error Details (Development)</summary>
                <pre className={s.errorStack}>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
