import { test, expect } from '@playwright/experimental-ct-react';
import { BanManagementStory } from '../__ct__/stories';

const unbannedGuest = {
  id: 'g1',
  name: 'John Smith',
  preferredName: 'Johnny',
  isBanned: false,
  bannedFromMeals: false,
  bannedFromShower: false,
  bannedFromLaundry: false,
  bannedFromBicycle: false,
};

const bannedGuest = {
  id: 'g2',
  name: 'Jane Doe',
  preferredName: '',
  isBanned: true,
  bannedUntil: '2026-06-01',
  banReason: 'Disruptive behavior',
  bannedFromMeals: true,
  bannedFromShower: false,
  bannedFromLaundry: false,
  bannedFromBicycle: false,
};

test.describe('BanManagementModal', () => {
  test('shows "Ban Guest" title for unbanned guest', async ({ mount }) => {
    const component = await mount(<BanManagementStory guest={unbannedGuest} />);
    await expect(component.getByRole('heading', { name: 'Ban Guest' })).toBeVisible();
    await expect(component.getByText('Johnny')).toBeVisible();
  });

  test('shows "Manage Ban" title for banned guest', async ({ mount }) => {
    const component = await mount(<BanManagementStory guest={bannedGuest} />);
    await expect(component.getByText('Manage Ban')).toBeVisible();
    await expect(component.getByText('Jane Doe')).toBeVisible();
  });

  test('shows "Currently Banned" alert for banned guest', async ({ mount }) => {
    const component = await mount(<BanManagementStory guest={bannedGuest} />);
    await expect(component.getByText('Currently Banned')).toBeVisible();
    await expect(component.getByText('Reason: Disruptive behavior')).toBeVisible();
  });

  test('does not show "Currently Banned" for unbanned guest', async ({ mount }) => {
    const component = await mount(<BanManagementStory guest={unbannedGuest} />);
    await expect(component.getByText('Currently Banned')).not.toBeVisible();
  });

  test('shows "Lift Ban" button for banned guest', async ({ mount }) => {
    const bannedComponent = await mount(<BanManagementStory guest={bannedGuest} />);
    await expect(bannedComponent.getByRole('button', { name: 'Lift Ban' })).toBeVisible();
  });

  test('does not show "Lift Ban" button for unbanned guest', async ({ mount }) => {
    const unbannedComponent = await mount(<BanManagementStory guest={unbannedGuest} />);
    await expect(unbannedComponent.getByRole('button', { name: 'Lift Ban' })).not.toBeVisible();
  });

  test('has date input, reason textarea, and service checkboxes', async ({ mount }) => {
    const component = await mount(<BanManagementStory guest={unbannedGuest} />);

    // Date input
    await expect(component.locator('input[type="date"]')).toBeVisible();

    // Reason textarea
    await expect(component.locator('textarea')).toBeVisible();
    await expect(component.getByText('Reason for Ban *')).toBeVisible();

    // Service checkboxes
    await expect(component.getByText('Meals')).toBeVisible();
    await expect(component.getByText('Showers')).toBeVisible();
    await expect(component.getByText('Laundry')).toBeVisible();
    await expect(component.getByText('Bicycle')).toBeVisible();
  });

  test('toggling service checkbox changes visual state', async ({ mount }) => {
    const component = await mount(<BanManagementStory guest={unbannedGuest} />);

    // Click the Meals checkbox label
    const mealsLabel = component.getByText('Meals');
    await mealsLabel.click();

    // After clicking, the checkbox should be checked (sr-only input)
    const mealsCheckbox = component.locator('input[type="checkbox"]').first();
    await expect(mealsCheckbox).toBeChecked();
  });

  test('Cancel button closes the modal', async ({ mount, page }) => {
    const component = await mount(<BanManagementStory guest={unbannedGuest} />);
    await component.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('modal-closed')).toBeVisible();
  });

  test('X button closes the modal', async ({ mount, page }) => {
    const component = await mount(<BanManagementStory guest={unbannedGuest} />);
    // X button is in the header
    const headerButtons = component.locator('.p-6.border-b button');
    await headerButtons.last().click();
    await expect(page.getByTestId('modal-closed')).toBeVisible();
  });

  test('shows "Update Ban" button for banned guest', async ({ mount }) => {
    const component = await mount(<BanManagementStory guest={bannedGuest} />);
    await expect(component.getByRole('button', { name: 'Update Ban' })).toBeVisible();
  });

  test('shows "Ban Guest" button for unbanned guest', async ({ mount }) => {
    const component = await mount(<BanManagementStory guest={unbannedGuest} />);
    await expect(component.getByRole('button', { name: 'Ban Guest' })).toBeVisible();
  });

  test('blanket ban hint text is visible', async ({ mount }) => {
    const component = await mount(<BanManagementStory guest={unbannedGuest} />);
    await expect(component.getByText(/Leave all unchecked for a blanket ban/)).toBeVisible();
  });
});
