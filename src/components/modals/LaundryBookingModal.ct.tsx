import { test, expect } from '@playwright/experimental-ct-react';
import { LaundryBookingStory } from '../__ct__/stories';

const testGuest = { id: 'g1', name: 'John Smith', preferredName: 'Johnny' };

test.describe('LaundryBookingModal', () => {
  test('renders header with guest name', async ({ mount }) => {
    const component = await mount(
      <LaundryBookingStory guest={testGuest} />
    );
    await expect(component.getByText('Laundry Booking')).toBeVisible();
    await expect(component.getByText('Johnny')).toBeVisible();
  });

  test('falls back to name when no preferredName', async ({ mount }) => {
    const component = await mount(
      <LaundryBookingStory guest={{ id: 'g2', name: 'Jane Doe' }} />
    );
    await expect(component.getByText('Jane Doe')).toBeVisible();
  });

  test('shows onsite/offsite toggle buttons', async ({ mount }) => {
    const component = await mount(
      <LaundryBookingStory guest={testGuest} role="checkin" />
    );
    await expect(component.getByText('onsite Service')).toBeVisible();
    await expect(component.getByText('offsite Service')).toBeVisible();
  });

  test('checkin role defaults to onsite with "Next On-site Slot"', async ({ mount }) => {
    const component = await mount(
      <LaundryBookingStory guest={testGuest} role="checkin" />
    );
    await expect(component.getByText('Next On-site Slot')).toBeVisible();
    await expect(component.getByRole('button', { name: 'Confirm Booking' })).toBeVisible();
  });

  test('checkin role can switch to offsite view', async ({ mount }) => {
    const component = await mount(
      <LaundryBookingStory guest={testGuest} role="checkin" />
    );
    await component.getByText('offsite Service').click();
    await expect(component.getByText('Off-site Laundry')).toBeVisible();
    await expect(component.getByRole('button', { name: 'Book Off-site' })).toBeVisible();
  });

  test('shows bag number input field', async ({ mount }) => {
    const component = await mount(
      <LaundryBookingStory guest={testGuest} role="checkin" />
    );
    await expect(component.locator('input[placeholder="Bag or Ticket Number"]')).toBeVisible();
  });

  test('staff role shows slot selection list for onsite', async ({ mount }) => {
    const component = await mount(
      <LaundryBookingStory guest={testGuest} role="staff" />
    );
    await expect(component.getByText('Select an available slot')).toBeVisible();
  });

  test('staff role offsite shows "Book Off-site Now" button', async ({ mount }) => {
    const component = await mount(
      <LaundryBookingStory guest={testGuest} role="staff" />
    );
    await component.getByText('offsite Service').click();
    await expect(component.getByRole('heading', { name: 'Off-site Laundry' })).toBeVisible();
    await expect(component.getByRole('button', { name: 'Book Off-site Now' })).toBeVisible();
  });

  test('Cancel button closes the modal', async ({ mount, page }) => {
    const component = await mount(
      <LaundryBookingStory guest={testGuest} />
    );
    await component.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('modal-closed')).toBeVisible();
  });

  test('X button closes the modal', async ({ mount, page }) => {
    const component = await mount(
      <LaundryBookingStory guest={testGuest} />
    );
    const headerCloseBtn = component.locator('.border-b button');
    await headerCloseBtn.click();
    await expect(page.getByTestId('modal-closed')).toBeVisible();
  });

  test('shows optional details section', async ({ mount }) => {
    const component = await mount(
      <LaundryBookingStory guest={testGuest} role="checkin" />
    );
    await expect(component.getByText('Optional Details')).toBeVisible();
  });
});
