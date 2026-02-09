import { test, expect } from '@playwright/experimental-ct-react';
import { KeyboardShortcutsBar } from './KeyboardShortcutsBar';

test.describe('KeyboardShortcutsBar', () => {
  test('renders all keyboard shortcuts', async ({ mount }) => {
    const component = await mount(<KeyboardShortcutsBar />);

    await expect(component).toContainText('Ctrl+K');
    await expect(component).toContainText('Focus search');
    await expect(component).toContainText('↑↓');
    await expect(component).toContainText('Navigate results');
    await expect(component).toContainText('Enter');
    await expect(component).toContainText('Open first card / Expand');
    await expect(component).toContainText('Log meals while card selected');
    await expect(component).toContainText('R');
    await expect(component).toContainText('Reset card / back to search');
    await expect(component).toContainText('Esc');
    await expect(component).toContainText('Clear');
  });

  test('renders six kbd elements', async ({ mount }) => {
    const component = await mount(<KeyboardShortcutsBar />);
    const kbds = component.locator('kbd');
    await expect(kbds).toHaveCount(7); // Ctrl+K, ↑↓, Enter, 1, 2, R, Esc
  });

  test('accepts custom className', async ({ mount }) => {
    const component = await mount(<KeyboardShortcutsBar className="my-custom" />);
    await expect(component).toHaveClass(/my-custom/);
  });
});
