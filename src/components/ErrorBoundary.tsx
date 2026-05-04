import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary with Shrek-themed fallback UI.
 *
 * Wraps child components and catches rendering errors, displaying a friendly
 * recovery screen instead of crashing the entire app.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Error capturado:', error.message);
    console.error('[ErrorBoundary] Stack:', error.stack);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      const title = this.props.fallbackTitle ?? '¡Algo salió mal en el pantano!';

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center animate-fade-in">
          <div className="bg-bg-dark/80 border-2 border-swamp-brown/40 rounded-3xl p-10 max-w-md w-full shadow-2xl backdrop-blur-md space-y-6">
            <span className="text-7xl block" role="img" aria-label="cebolla">
              🧅
            </span>

            <h2 className="text-2xl md:text-3xl text-fairytale-gold font-luckiest drop-shadow-md">
              {title}
            </h2>

            <p className="text-onion-cream/80 text-base leading-relaxed">
              {this.state.error?.message ?? 'Ocurrió un error inesperado.'}
            </p>

            <button
              onClick={this.handleRetry}
              className="mt-2 px-8 py-3 bg-shrek-green hover:bg-shrek-green-dark text-white text-lg font-luckiest rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
