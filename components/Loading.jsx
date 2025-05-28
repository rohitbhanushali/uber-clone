import React from 'react';
import tw from 'tailwind-styled-components';

const Loading = ({ fullScreen = false }) => {
    return (
        <Container fullScreen={fullScreen}>
            <Spinner />
            <LoadingText>Loading...</LoadingText>
        </Container>
    );
};

const Container = tw.div`
    flex flex-col items-center justify-center
    ${props => props.fullScreen ? 'min-h-screen' : 'p-8'}
`;

const Spinner = tw.div`
    w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin
`;

const LoadingText = tw.p`
    mt-4 text-gray-600 text-lg
`;

export default Loading; 