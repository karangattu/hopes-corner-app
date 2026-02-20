import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PinballGame } from '../PinballGame';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react X icon
vi.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
}));

describe('PinballGame', () => {
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onClose = vi.fn();
    vi.clearAllMocks();
  });

  it('renders the pinball overlay with canvas', () => {
    render(<PinballGame onClose={onClose} />);
    expect(screen.getByTestId('pinball-overlay')).toBeDefined();
    expect(screen.getByTestId('pinball-canvas')).toBeDefined();
  });

  it('renders title text', () => {
    render(<PinballGame onClose={onClose} />);
    expect(screen.getByText('Pinball')).toBeDefined();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<PinballGame onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<PinballGame onClose={onClose} />);
    fireEvent.click(screen.getByTestId('pinball-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    render(<PinballGame onClose={onClose} />);
    fireEvent.click(screen.getByTestId('pinball-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has accessible close button label', () => {
    render(<PinballGame onClose={onClose} />);
    expect(screen.getByLabelText('Close pinball game')).toBeDefined();
  });

  it('renders controls hint text', () => {
    render(<PinballGame onClose={onClose} />);
    expect(screen.getByText(/ESC to close/)).toBeDefined();
  });
});
