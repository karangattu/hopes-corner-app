import { test, expect } from '@playwright/experimental-ct-react';
import { ShowerBookingStory } from '../__ct__/stories';

const testGuest = { id: 'g1', name: 'John Smith', preferredName: 'Johnny' };

test.describe('ShowerBookingModal', () => {
  test('renders header with guest name', async ({ mount }) => {
    const component = await mount(
      <ShowerBookingStory guest={testGuest} />
    );
    await expect(component.getByText('Book a Shower')).toBeVisible();
    await expect(component.getByText('Johnny')).toBeVisible();
  });

  test('falls back to name when no preferredName', async ({ mount }) => {
    const component = await mount(
      <ShowerBookingStory guest={{ id: 'g2', name: 'Jane Doe' }} />
    );
    await expect(component.getByText('Jane Doe')).toBeVisible();
  });

  test('checkin role shows "Book Next Slot" view', async ({ mount }) => {
    const component = await mount(
      <ShowerBookingStory guest={testGuest} role="checkin" />
    );
    await expect(component.getByText('Book Next Slot')).toBeVisible();
    await expect(component.getByRole('button', { name: 'Confirm Booking' })).toBeVisible();
  });

  test('checkin role shows next available slot label', async ({ mount }) => {
    const component = await mount(
      <ShowerBookingStory guest={testGuest} role="checkin" />
    );
    // Should show "The next available shower is at ..." with a time
    await expect(component.getByText(/next available shower/)).toBeVisible();
  });

  test('staff role shows slot grid with time buttons', async ({ mount }) => {
    const component = await mount(
      <ShowerBookingStory guest={testGuest} role="staff" />
    );
    await expect(component.getByText('Select an available time')).toBeVisible();
    await expect(component.getByText('2 GUESTS PER SLOT')).toBeVisible();
    // Should show slot occupancy indicators
    await expect(component.getByText(/\/2/).first()).toBeVisible();
  });

  test('staff role shows Add to Waitlist button', async ({ mount }) => {
    const component = await mount(
      <ShowerBookingStory guest={testGuest} role="staff" />
    );
    await expect(component.getByRole('button', { name: 'Add to Waitlist' })).toBeVisible();
  });

  test('Cancel button closes the modal', async ({ mount, page }) => {
    const component = await mount(
      <ShowerBookingStory guest={testGuest} />
    );
    await component.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('modal-closed')).toBeVisible();
  });

  test('X button closes the modal', async ({ mount, page }) => {
    const component = await mount(
      <ShowerBookingStory guest={testGuest} />
    );
    // X button is in the header
    const headerCloseBtn = component.locator('.border-b button');
    await headerCloseBtn.click();
    await expect(page.getByTestId('modal-closed')).toBeVisible();
  });

  test('shows fair distribution info for checkin role', async ({ mount }) => {
    const component = await mount(
      <ShowerBookingStory guest={testGuest} role="checkin" />
    );
    await expect(component.getByText(/fair service distribution/)).toBeVisible();
  });

  test('staff role shows waitlist info section', async ({ mount }) => {
    const component = await mount(
      <ShowerBookingStory guest={testGuest} role="staff" />
    );
    await expect(component.getByText('Waitlist info')).toBeVisible();
    await expect(component.getByText(/If no slots work/)).toBeVisible();
  });
});
