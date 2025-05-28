import React from 'react';
import tw from 'tailwind-styled-components';

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
        
        // Log error to your error reporting service
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorContainer>
                    <ErrorTitle>Something went wrong</ErrorTitle>
                    <ErrorMessage>
                        We're sorry, but there was an error loading this page.
                    </ErrorMessage>
                    <RetryButton onClick={() => window.location.reload()}>
                        Retry
                    </RetryButton>
                    {process.env.NODE_ENV === 'development' && (
                        <ErrorDetails>
                            <pre>{this.state.error && this.state.error.toString()}</pre>
                            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                        </ErrorDetails>
                    )}
                </ErrorContainer>
            );
        }

        return this.props.children;
    }
}

const ErrorContainer = tw.div`
    flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100
`;

const ErrorTitle = tw.h1`
    text-2xl font-bold text-red-600 mb-4
`;

const ErrorMessage = tw.p`
    text-gray-600 mb-6 text-center
`;

const RetryButton = tw.button`
    px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors
`;

const ErrorDetails = tw.div`
    mt-8 p-4 bg-gray-200 rounded overflow-auto max-w-full
    text-xs text-gray-700
`;

export default ErrorBoundary; 