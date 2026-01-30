import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg m-4">
                    <p className="font-bold">Something went wrong in this section.</p>
                    <p className="text-sm">Please refresh the page or try again later.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
