import React from "react";
import { Container, Alert, Button } from "react-bootstrap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch (e) {
      console.error(e);
    }
    window.location.href = window.location.pathname + "?v=" + Date.now();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5 text-center">
          <Alert variant="warning" className="p-4 shadow-sm text-start mx-auto" style={{ maxWidth: "600px" }}>
            <h4 className="alert-heading fw-bold mb-3">⚠️ Page Needs Refresh</h4>
            <p className="mb-2 text-muted">
              The application encountered an unexpected state or a cached script mismatch from a recent deployment.
            </p>
            {this.state.error?.message && (
              <div className="small font-monospace bg-light p-2 rounded mb-3 text-danger border">
                {this.state.error.message}
              </div>
            )}
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="primary" size="sm" onClick={this.handleReload}>
                Refresh Page
              </Button>
              <Button variant="outline-danger" size="sm" onClick={this.handleClearCacheAndReload}>
                Clear Cache & Reload
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => (window.location.href = "/")}>
                Go to Home
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
