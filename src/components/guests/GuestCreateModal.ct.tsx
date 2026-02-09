import { test, expect } from '@playwright/experimental-ct-react';
import { GuestCreateStory } from '../__ct__/stories';

test.describe('GuestCreateModal', () => {
  test('renders header with title and subtitle', async ({ mount }) => {
    const component = await mount(<GuestCreateStory />);
    await expect(component.getByText('Add New Guest')).toBeVisible();
    await expect(component.getByText('Create a new guest record in the system')).toBeVisible();
  });

  test('splits initialName into first and last name fields', async ({ mount }) => {
    const component = await mount(<GuestCreateStory initialName="Jane Doe" />);
    const firstNameInput = component.locator('input').first();
    const lastNameInput = component.locator('input').nth(1);
    await expect(firstNameInput).toHaveValue('Jane');
    await expect(lastNameInput).toHaveValue('Doe');
  });

  test('handles multi-word last name from initialName', async ({ mount }) => {
    const component = await mount(<GuestCreateStory initialName="John Van Der Berg" />);
    const firstNameInput = component.locator('input').first();
    const lastNameInput = component.locator('input').nth(1);
    await expect(firstNameInput).toHaveValue('John');
    await expect(lastNameInput).toHaveValue('Van Der Berg');
  });

  test('shows all form labels', async ({ mount }) => {
    const component = await mount(<GuestCreateStory />);
    await expect(component.getByText('First Name *')).toBeVisible();
    await expect(component.getByText('Last Name *')).toBeVisible();
    await expect(component.getByText('Preferred Name')).toBeVisible();
    await expect(component.getByText('Housing Status')).toBeVisible();
    await expect(component.getByText('Age Group')).toBeVisible();
    await expect(component.getByText('Gender')).toBeVisible();
    await expect(component.getByText('Primary Location')).toBeVisible();
    await expect(component.getByText('Notes')).toBeVisible();
    await expect(component.getByText('Bicycle Description')).toBeVisible();
  });

  test('has correct default dropdown values', async ({ mount }) => {
    const component = await mount(<GuestCreateStory />);
    const selects = component.locator('select');

    // Housing Status
    await expect(selects.nth(0)).toHaveValue('Unhoused');
    // Age Group
    await expect(selects.nth(1)).toHaveValue('Adult 18-59');
    // Gender
    await expect(selects.nth(2)).toHaveValue('Unknown');
  });

  test('housing status dropdown has all options', async ({ mount }) => {
    const component = await mount(<GuestCreateStory />);
    const housingSelect = component.locator('select').first();
    await expect(housingSelect.locator('option')).toHaveCount(4);
    await expect(housingSelect.locator('option', { hasText: 'Unhoused' })).toBeAttached();
    await expect(housingSelect.locator('option:text-is("Housed")')).toBeAttached();
    await expect(housingSelect.locator('option', { hasText: 'Temp. shelter' })).toBeAttached();
    await expect(housingSelect.locator('option', { hasText: 'RV or vehicle' })).toBeAttached();
  });

  test('age group dropdown has all options', async ({ mount }) => {
    const component = await mount(<GuestCreateStory />);
    const ageSelect = component.locator('select').nth(1);
    await expect(ageSelect.locator('option')).toHaveCount(3);
    await expect(ageSelect.locator('option', { hasText: 'Adult 18-59' })).toBeAttached();
    await expect(ageSelect.locator('option', { hasText: 'Senior 60+' })).toBeAttached();
    await expect(ageSelect.locator('option', { hasText: 'Child 0-17' })).toBeAttached();
  });

  test('gender dropdown has all options', async ({ mount }) => {
    const component = await mount(<GuestCreateStory />);
    const genderSelect = component.locator('select').nth(2);
    await expect(genderSelect.locator('option')).toHaveCount(4);
    await expect(genderSelect.locator('option:text-is("Male")')).toBeAttached();
    await expect(genderSelect.locator('option:text-is("Female")')).toBeAttached();
    await expect(genderSelect.locator('option', { hasText: 'Unknown' })).toBeAttached();
    await expect(genderSelect.locator('option', { hasText: 'Non-binary' })).toBeAttached();
  });

  test('location dropdown has Bay Area cities plus "Select city" placeholder', async ({ mount }) => {
    const component = await mount(<GuestCreateStory />);
    const locationSelect = component.locator('select').nth(3);
    // 16 cities + 1 "Select city" placeholder
    await expect(locationSelect.locator('option')).toHaveCount(17);
    await expect(locationSelect.locator('option', { hasText: 'Select city' })).toBeAttached();
    await expect(locationSelect.locator('option', { hasText: 'San Jose' })).toBeAttached();
    await expect(locationSelect.locator('option', { hasText: 'Outside Santa Clara County' })).toBeAttached();
  });

  test('pre-selects defaultLocation when provided', async ({ mount }) => {
    const component = await mount(<GuestCreateStory defaultLocation="San Jose" />);
    const locationSelect = component.locator('select').nth(3);
    await expect(locationSelect).toHaveValue('San Jose');
  });

  test('Cancel button closes the modal', async ({ mount, page }) => {
    const component = await mount(<GuestCreateStory />);
    await component.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('modal-closed')).toBeVisible();
  });

  test('X button closes the modal', async ({ mount, page }) => {
    const component = await mount(<GuestCreateStory />);
    // X button is in the header area
    const headerCloseBtn = component.locator('.border-b button');
    await headerCloseBtn.click();
    await expect(page.getByTestId('modal-closed')).toBeVisible();
  });

  test('Create Guest button is visible', async ({ mount }) => {
    const component = await mount(<GuestCreateStory />);
    await expect(component.getByRole('button', { name: 'Create Guest' })).toBeVisible();
  });

  test('section headers are visible', async ({ mount }) => {
    const component = await mount(<GuestCreateStory />);
    await expect(component.getByText('Name Information')).toBeVisible();
    await expect(component.getByText('Status & Background')).toBeVisible();
    await expect(component.getByRole('heading', { name: 'Location' })).toBeVisible();
    await expect(component.getByText('Other Details')).toBeVisible();
  });

  test('can type in text fields', async ({ mount }) => {
    const component = await mount(<GuestCreateStory />);
    const firstNameInput = component.locator('input').first();
    await firstNameInput.fill('alice');
    // toTitleCase should capitalize first letters
    await expect(firstNameInput).toHaveValue('Alice');
  });
});
