import * as React from 'react';

type ErrorState = { error?: Error; info?: React.ErrorInfo };
const initialState: ErrorState = { error: undefined, info: undefined };

class ErrorBoundary extends React.Component<any, ErrorState> {
  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  state = initialState;

  handleClearError(): void {
    this.setState(initialState);
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error,
      info: errorInfo,
    });
  }

  render(): React.ReactNode {
    const { error, info } = this.state;

    if (error && info) {
      return (
        <div>
          <div>Error {error} </div>
          <div>{info}</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
