import { Component } from 'react';
import TarikiLogo from './brand/TarikiLogo';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-6 p-8">
          <TarikiLogo size="xl" />
          <div className="text-center max-w-md">
            <h1 className="text-xl font-semibold mb-2">Une erreur est survenue</h1>
            <p className="text-sm text-slate-500 mb-4">
              {this.state.error?.message || 'Erreur inattendue dans l’interface.'}
            </p>
            <button type="button" onClick={this.handleReload} className="rounded-lg bg-tariki-600 text-white font-semibold hover:bg-tariki-700 px-6">
              Recharger l’application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
