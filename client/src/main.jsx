import { Component } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Catches any unhandled React render errors and shows them clearly
// instead of a silent black screen.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0d0005',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'monospace',
          color: '#f4f4f5',
        }}>
          <div style={{
            maxWidth: '700px',
            width: '100%',
            background: '#1a0810',
            border: '1px solid #b42828',
            borderRadius: '12px',
            padding: '2rem',
          }}>
            <p style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold', marginBottom: '1rem' }}>
              ⚠️ React Crash — Error Details
            </p>
            <pre style={{
              background: '#0d0005',
              padding: '1rem',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '13px',
              color: '#fca5a5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {this.state.error?.message}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1.5rem',
                background: '#b42828',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
