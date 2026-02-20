import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
  let onClose: () => void;
  const originalDateNow = Date.now;

  beforeEach(() => {
    onClose = vi.fn();
    vi.clearAllMocks();
    // Override Date.now to simulate time past the grace period
    let callCount = 0;
    const baseTime = 1000000;
    Date.now = () => {
      callCount++;
      // First call is mount (openedAtRef), subsequent calls are close attempts
      // Return 600ms later for close calls so they're past the 500ms grace period
      return callCount <= 1 ? baseTime : baseTime + 600;
    };
  });

  afterEach(() => {
    Date.now = originalDateNow;
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

  it('ignores backdrop clicks during the 500ms grace period', () => {
    // Override Date.now so all calls return the same time (within grace period)
    const baseTime = 2000000;
    Date.now = () => baseTime;
    render(<PinballGame onClose={onClose} />);
    fireEvent.click(screen.getByTestId('pinball-backdrop'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
