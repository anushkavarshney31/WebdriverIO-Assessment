import { $ } from "@wdio/globals";
import Page from "./page.js";

class DropdownPage extends Page {
  get elements() {
    return {
      header: () => $("h3"),
      dropdown: () => $("select#dropdown"),
    };
  }

  async select(option) {
    const dropdown = await this.elements.dropdown();
    await dropdown.selectByVisibleText(option);
  }

  async selectedOptionText() {
    const dropdown = await this.elements.dropdown();
    const value = await dropdown.getValue();
    const selectedOption = await dropdown.$(`option[value="${value}"]`);
    return await selectedOption.getText();
  }
}

export default new DropdownPage();
