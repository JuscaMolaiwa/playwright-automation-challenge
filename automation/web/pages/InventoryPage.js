// pages/InventoryPage.js
class InventoryPage {
  constructor(page) {
      this.page = page;
      this.pageTitle = page.locator('.title');
      this.inventoryItems = page.locator('.inventory_item');
      this.itemImages = page.locator('.inventory_item_img');
  }

  async validatePageLoaded() {
      await expect(this.pageTitle).toHaveText('Products');
      await expect(this.inventoryItems).not.toHaveCount(0);
  }
}

module.exports = { InventoryPage };