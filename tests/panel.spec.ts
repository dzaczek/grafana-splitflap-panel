import { test, expect } from '@grafana/plugin-e2e';

test('should display "No Data" in case panel data is empty', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });
  await expect(panelEditPage.panel.locator).toContainText('No Data');
});

test('should display flip cards when data is passed to the panel', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  readProvisionedDataSource,
  page,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  // Use panel id 1 which already has the Split Flap plugin configured with data
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await panelEditPage.datasource.set(ds.name);
  
  // Wait a bit for the panel to render with data
  await page.waitForTimeout(1000);
  
  // Check if any flip card wrapper is visible (we added role="meter" to the wrapper)
  await expect(page.locator('[role="meter"]').first()).toBeVisible();
});
