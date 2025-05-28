import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading Component', () => {
  it('renders loading spinner and text', () => {
    render(<Loading />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies fullscreen styles when fullScreen prop is true', () => {
    render(<Loading fullScreen={true} />);
    
    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass('min-h-screen');
  });

  it('applies default styles when fullScreen prop is false', () => {
    render(<Loading fullScreen={false} />);
    
    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass('p-8');
  });
}); 