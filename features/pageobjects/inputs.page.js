import { $ } from "@wdio/globals";
import Page from "./page.js";

class InputsPage extends Page {
  get elements() {
    return {
      header: () => $("h3"),
      input: () => $('input[type="number"]'),
    };
  }

  async set(value) {
    await (await this.elements.input()).setValue(value);
  }
}

export default new InputsPage();
