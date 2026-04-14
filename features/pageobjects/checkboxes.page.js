import { $$, $ } from "@wdio/globals";
import Page from "./page.js";

class CheckboxesPage extends Page {
  get elements() {
    return {
      header: () => $("h3"),
      checkboxes: () => $$("#checkboxes input"),
    };
  }

  async select(num) {
    const list = await this.elements.checkboxes();
    const checkbox = list[num - 1];
    await checkbox.waitForExist({ timeout: 5000 });
    const isSelected = await checkbox.isSelected();
    if (!isSelected) {
      await checkbox.click();
    }
  }
}

export default new CheckboxesPage();
