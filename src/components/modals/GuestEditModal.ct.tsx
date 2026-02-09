import { test, expect } from '@playwright/experimental-ct-react';
import { GuestEditStory } from '../__ct__/stories';

const sampleGuest = {
  id: 'g1',
  name: 'John Smith',
  preferredName: 'Johnny',
  firstName: 'John',
  lastName: 'Smith',
  housingStatus: 'Unhoused',
  location: 'San Jose',
  age: 'Adult 18-59',
  gender: 'Male',
  notes: 'Needs wheelchair access',
  bicycleDescription: 'Red mountain bike',
};

test.describe('GuestEditModal', () => {
  test('renders header with guest name', async ({ mount }) => {
    const component = await mount(<GuestEditStory guest={sampleGuest} />);
    await expect(component.getByText('Edit Guest')).toBeVisible();
    await expect(component.getByText('Johnny')).toBeVisible();
  });

  test('pre-fills form fields from guest data', async ({ mount }) => {
    const component = await mount(<GuestEditStory guest={sampleGuest} />);

    await expect(component.locator('input[name="firstName"]')).toHaveValue('John');
    await expect(component.locator('input[name="lastName"]')).toHaveValue('Smith');
    await expect(component.locator('input[name="preferredName"]')).toHaveValue('Johnny');
    await expect(component.locator('select[name="housingStatus"]')).toHaveValue('Unhoused');
    await expect(component.locator('select[name="location"]')).toHaveValue('San Jose');
    await expect(component.locator('select[name="age"]')).toHaveValue('Adult 18-59');
    await expect(component.locator('select[name="gender"]')).toHaveValue('Male');
    await expect(component.locator('textarea[name="notes"]')).toHaveValue('Needs wheelchair access');
    await expect(component.locator('input[name="bicycleDescription"]')).toHaveValue('Red mountain bike');
  });

  test('has all required form labels', async ({ mount }) => {
    const component = await mount(<GuestEditStory guest={sampleGuest} />);
    await expect(component.getByText('First Name *')).toBeVisible();
    await expect(component.getByText('Last Name *')).toBeVisible();
    await expect(component.getByText('Preferred Name')).toBeVisible();
    await expect(component.getByText('Age Group *')).toBeVisible();
    await expect(component.getByText('Gender *')).toBeVisible();
    await expect(component.getByText('Housing Status')).toBeVisible();
    await expect(component.getByText('Location')).toBeVisible();
    await expect(component.getByText('Notes')).toBeVisible();
    await expect(component.getByText('Bicycle Description')).toBeVisible();
  });

  test('can edit text inputs', async ({ mount }) => {
    const component = await mount(<GuestEditStory guest={sampleGuest} />);

    const firstNameInput = component.locator('input[name="firstName"]');
    await firstNameInput.clear();
    await firstNameInput.fill('Jane');
    await expect(firstNameInput).toHaveValue('Jane');
  });

  test('can change select dropdowns', async ({ mount }) => {
    const component = await mount(<GuestEditStory guest={sampleGuest} />);

    const genderSelect = component.locator('select[name="gender"]');
    await genderSelect.selectOption('Female');
    await expect(genderSelect).toHaveValue('Female');
  });

  test('location dropdown has Bay Area cities', async ({ mount }) => {
    const component = await mount(<GuestEditStory guest={sampleGuest} />);
    const locationSelect = component.locator('select[name="location"]');

    await expect(locationSelect.locator('option', { hasText: 'San Jose' })).toBeAttached();
    await expect(locationSelect.locator('option:text-is("Santa Clara")')).toBeAttached();
    await expect(locationSelect.locator('option', { hasText: 'Sunnyvale' })).toBeAttached();
    await expect(locationSelect.locator('option', { hasText: 'Mountain View' })).toBeAttached();
  });

  test('Cancel button closes modal', async ({ mount, page }) => {
    const component = await mount(<GuestEditStory guest={sampleGuest} />);
    await component.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('modal-closed')).toBeVisible();
  });

  test('has Save Changes and Delete Guest buttons', async ({ mount }) => {
    const component = await mount(<GuestEditStory guest={sampleGuest} />);
    await expect(component.getByRole('button', { name: 'Save Changes' })).toBeVisible();
    await expect(component.getByRole('button', { name: /Delete Guest/ })).toBeVisible();
  });

  test('housing status dropdown has all statuses', async ({ mount }) => {
    const component = await mount(<GuestEditStory guest={sampleGuest} />);
    const housingSelect = component.locator('select[name="housingStatus"]');

    await expect(housingSelect.locator('option', { hasText: 'Unhoused' })).toBeAttached();
    await expect(housingSelect.locator('option:text-is("Housed")')).toBeAttached();
    await expect(housingSelect.locator('option', { hasText: 'Temp. shelter' })).toBeAttached();
    await expect(housingSelect.locator('option', { hasText: 'RV or vehicle' })).toBeAttached();
  });

  test('age group dropdown has all groups', async ({ mount }) => {
    const component = await mount(<GuestEditStory guest={sampleGuest} />);
    const ageSelect = component.locator('select[name="age"]');

    await expect(ageSelect.locator('option', { hasText: 'Adult 18-59' })).toBeAttached();
    await expect(ageSelect.locator('option', { hasText: 'Senior 60+' })).toBeAttached();
    await expect(ageSelect.locator('option', { hasText: 'Child 0-17' })).toBeAttached();
  });
});
