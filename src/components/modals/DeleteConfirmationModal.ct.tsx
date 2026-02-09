import { test, expect } from '@playwright/experimental-ct-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

test.describe('DeleteConfirmationModal', () => {
  test('does not render when isOpen is false', async ({ mount }) => {
    const component = await mount(
      <DeleteConfirmationModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={async () => {}}
        title="Delete Guest"
        description="This action cannot be undone."
      />
    );
    await expect(component).toBeEmpty();
  });

  test('renders title and description when open', async ({ mount }) => {
    const component = await mount(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={async () => {}}
        title="Delete Guest"
        description="This action cannot be undone."
      />
    );
    await expect(component.getByText('Delete Guest')).toBeVisible();
    await expect(component.getByText('This action cannot be undone.')).toBeVisible();
  });

  test('shows default button text', async ({ mount }) => {
    const component = await mount(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={async () => {}}
        title="Delete"
        description="Are you sure?"
      />
    );
    await expect(component.getByRole('button', { name: 'Delete' })).toBeVisible();
    await expect(component.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('uses custom button text', async ({ mount }) => {
    const component = await mount(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={async () => {}}
        title="Remove"
        description="Are you sure?"
        confirmText="Yes, Remove"
        cancelText="Go Back"
      />
    );
    await expect(component.getByRole('button', { name: 'Yes, Remove' })).toBeVisible();
    await expect(component.getByRole('button', { name: 'Go Back' })).toBeVisible();
  });

  test('calls onClose when cancel button is clicked', async ({ mount }) => {
    let closeCalled = false;
    const component = await mount(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={() => { closeCalled = true; }}
        onConfirm={async () => {}}
        title="Delete"
        description="Sure?"
      />
    );
    await component.getByRole('button', { name: 'Cancel' }).click();
    expect(closeCalled).toBe(true);
  });

  test('calls onClose when X button is clicked', async ({ mount }) => {
    let closeCalled = false;
    const component = await mount(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={() => { closeCalled = true; }}
        onConfirm={async () => {}}
        title="Delete"
        description="Sure?"
      />
    );
    // X button is the first button (the one with the X icon)
    const closeBtn = component.locator('button').first();
    await closeBtn.click();
    expect(closeCalled).toBe(true);
  });

  test('calls onConfirm when confirm button is clicked', async ({ mount }) => {
    let confirmCalled = false;

    const component = await mount(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={async () => {
          confirmCalled = true;
        }}
        title="Delete"
        description="Sure?"
      />
    );

    const confirmBtn = component.getByRole('button', { name: 'Delete' });
    await confirmBtn.click();
    expect(confirmCalled).toBe(true);
  });

  test('danger variant uses red styling', async ({ mount }) => {
    const component = await mount(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={async () => {}}
        title="Delete"
        description="Sure?"
        variant="danger"
      />
    );
    const confirmBtn = component.getByRole('button', { name: 'Delete' });
    await expect(confirmBtn).toHaveClass(/bg-red-600/);
  });

  test('warning variant uses amber styling', async ({ mount }) => {
    const component = await mount(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={async () => {}}
        title="Warning"
        description="Sure?"
        variant="warning"
      />
    );
    const confirmBtn = component.getByRole('button', { name: 'Delete' });
    await expect(confirmBtn).toHaveClass(/bg-amber-600/);
  });
});
