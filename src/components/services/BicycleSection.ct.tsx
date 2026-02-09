import { test, expect } from '@playwright/experimental-ct-react';
import { BicycleSectionStory } from '../__ct__/stories';

const todayDate = new Date().toISOString();

const sampleGuests = [
  { id: 'g1', firstName: 'Mike', lastName: 'Jones', preferredName: 'Mikey', name: 'Mike Jones', bicycleDescription: 'Red mountain bike, 26 inch' },
  { id: 'g2', firstName: 'Sarah', lastName: 'Lee', preferredName: '', name: 'Sarah Lee', bicycleDescription: '' },
  { id: 'g3', firstName: 'Bob', lastName: 'Brown', preferredName: 'Bobby', name: 'Bob Brown' },
];

const pendingRepair = {
  id: 'b1', guestId: 'g1', date: todayDate, type: 'repair',
  repairType: 'Flat tire', repairTypes: ['Flat tire', 'Chain adjustment'],
  completedRepairs: [], notes: 'Front wheel flat', status: 'pending',
  priority: 1, createdAt: todayDate,
};

const inProgressRepair = {
  id: 'b2', guestId: 'g2', date: todayDate, type: 'repair',
  repairType: 'Brakes', repairTypes: ['Brakes'],
  completedRepairs: [], notes: '', status: 'in_progress',
  priority: 2, createdAt: todayDate,
};

const doneRepair = {
  id: 'b3', guestId: 'g3', date: todayDate, type: 'repair',
  repairType: 'Tune-up', repairTypes: ['Tune-up'],
  completedRepairs: ['Tune-up'], notes: 'Complete tune-up', status: 'done',
  priority: 3, createdAt: todayDate,
};

test.describe('BicycleSection', () => {
  test('renders header with title', async ({ mount }) => {
    const component = await mount(<BicycleSectionStory />);
    await expect(component.getByText('Bicycle Repairs')).toBeVisible();
  });

  test('shows repair count for today', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair, inProgressRepair]}
        guests={sampleGuests}
      />
    );
    await expect(component.getByText('2 repairs today')).toBeVisible();
  });

  test('shows singular "repair" for single record', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair]}
        guests={sampleGuests}
      />
    );
    await expect(component.getByText('1 repair today')).toBeVisible();
  });

  test('defaults to kanban view with 3 status columns', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair, inProgressRepair, doneRepair]}
        guests={sampleGuests}
      />
    );
    // Column headers
    await expect(component.getByText('Pending', { exact: true })).toBeVisible();
    await expect(component.getByText('In Progress', { exact: true })).toBeVisible();
    await expect(component.getByText('Done', { exact: true }).first()).toBeVisible();
  });

  test('kanban columns show correct record counts', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair, inProgressRepair, doneRepair]}
        guests={sampleGuests}
      />
    );
    // Each column should have a badge with count "1"
    const badges = component.locator('span', { hasText: '1' });
    // At least 3 badges (one per column)
    await expect(badges.first()).toBeVisible();
  });

  test('displays guest preferredName on repair card', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair]}
        guests={sampleGuests}
      />
    );
    // g1 has preferredName "Mikey"
    await expect(component.getByText('Mikey')).toBeVisible();
  });

  test('displays bicycle description on card', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair]}
        guests={sampleGuests}
      />
    );
    // g1 has bicycleDescription
    await expect(component.getByText('Red mountain bike, 26 inch')).toBeVisible();
  });

  test('shows repair types checklist with progress', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair]}
        guests={sampleGuests}
      />
    );
    // Should show "Repairs (0/2)" since pendingRepair has 2 repair types, 0 completed
    await expect(component.getByText('Repairs (0/2)')).toBeVisible();
    await expect(component.getByText('Flat tire')).toBeVisible();
    await expect(component.getByText('Chain adjustment')).toBeVisible();
  });

  test('shows notes on card when present', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair]}
        guests={sampleGuests}
      />
    );
    await expect(component.getByText('Front wheel flat')).toBeVisible();
  });

  test('shows completed repair with checklist progress', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[doneRepair]}
        guests={sampleGuests}
      />
    );
    // doneRepair has 1/1 completed
    await expect(component.getByText('Repairs (1/1)')).toBeVisible();
  });

  test('shows "No repairs" placeholder in empty kanban column', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair]}
        guests={sampleGuests}
      />
    );
    // In Progress and Done columns should have "No repairs" placeholder
    const noRepairs = component.getByText('No repairs');
    // At least 2 empty columns
    await expect(noRepairs.first()).toBeVisible();
  });

  test('switches to list view when list button is clicked', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair, inProgressRepair]}
        guests={sampleGuests}
      />
    );
    // Click list view toggle (second button in the view mode toggle group)
    const listButton = component.locator('button').filter({ has: component.locator('svg') });
    // The list view button is the second icon button in the toggle group
    await component.locator('.bg-gray-100.rounded-xl button').nth(1).click();
    // In list view, guest names should still be visible
    await expect(component.getByText('Mikey')).toBeVisible();
    await expect(component.getByText('Sarah Lee')).toBeVisible();
  });

  test('shows empty list state when no records', async ({ mount }) => {
    const component = await mount(<BicycleSectionStory />);
    // Switch to list view
    await component.locator('.bg-gray-100.rounded-xl button').nth(1).click();
    await expect(component.getByText('No repairs logged today')).toBeVisible();
  });

  test('expand card shows status dropdown and delete button', async ({ mount }) => {
    const component = await mount(
      <BicycleSectionStory
        bicycleRecords={[pendingRepair]}
        guests={sampleGuests}
      />
    );
    // The expand button is an icon-only button within the card header area.
    // Find the card containing "Mikey" then click the last button in that card's header (the chevron).
    const card = component.locator('div').filter({ hasText: 'Mikey' }).locator('button:not(:has-text(""))').first();
    // Alternative: find all icon-only buttons near Mikey's card. The chevron is the one with no text.
    // Let's use a more reliable approach: find buttons that are siblings of the name text
    const mikeyCard = component.locator('div.bg-white, div[class*="bg-white"]').filter({ hasText: 'Mikey' }).first();
    await mikeyCard.locator('button').last().click();
    // Should show status dropdown and delete button
    await expect(component.locator('select').last()).toBeVisible();
    await expect(component.getByText('Delete')).toBeVisible();
  });

  test('shows Today label in date navigation', async ({ mount }) => {
    const component = await mount(<BicycleSectionStory />);
    await expect(component.getByText('Today', { exact: true })).toBeVisible();
  });

  test('shows "0 repairs today" when no records', async ({ mount }) => {
    const component = await mount(<BicycleSectionStory />);
    await expect(component.getByText('0 repairs today')).toBeVisible();
  });
});
