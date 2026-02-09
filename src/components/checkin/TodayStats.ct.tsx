import { test, expect } from '@playwright/experimental-ct-react';
import { TodayStatsStory } from '../__ct__/stories';

test.describe('TodayStats', () => {
  test('shows 0 meals and 0 guests when no records', async ({ mount }) => {
    const component = await mount(
      <TodayStatsStory mealRecords={[]} extraMealRecords={[]} />
    );
    // Both stats should show 0
    const mealsDiv = component.locator('[title="Total meals served today"]');
    await expect(mealsDiv).toContainText('0');

    const guestsDiv = component.locator('[title="Unique guests served today"]');
    await expect(guestsDiv).toContainText('0');
  });

  test('counts meals from today correctly', async ({ mount }) => {
    const today = new Date().toISOString();
    const component = await mount(
      <TodayStatsStory
        mealRecords={[
          { id: '1', guestId: 'g1', count: 2, date: today },
          { id: '2', guestId: 'g2', count: 1, date: today },
        ]}
        extraMealRecords={[
          { id: '3', guestId: 'g1', count: 1, date: today },
        ]}
      />
    );

    const mealsDiv = component.locator('[title="Total meals served today"]');
    // 2 + 1 + 1 = 4
    await expect(mealsDiv).toContainText('4');

    const guestsDiv = component.locator('[title="Unique guests served today"]');
    // g1 and g2 = 2 unique guests
    await expect(guestsDiv).toContainText('2');
  });

  test('does not count meals from other days', async ({ mount }) => {
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const today = new Date().toISOString();

    const component = await mount(
      <TodayStatsStory
        mealRecords={[
          { id: '1', guestId: 'g1', count: 5, date: yesterday },
          { id: '2', guestId: 'g2', count: 1, date: today },
        ]}
        extraMealRecords={[]}
      />
    );

    const mealsDiv = component.locator('[title="Total meals served today"]');
    // Only today's meal should count
    await expect(mealsDiv).toContainText('1');
  });

  test('renders meal and guest labels', async ({ mount }) => {
    const component = await mount(
      <TodayStatsStory mealRecords={[]} extraMealRecords={[]} />
    );
    await expect(component).toContainText('meals');
    await expect(component).toContainText('guests');
  });
});
