import { $ } from "@wdio/globals";
import Page from "./page.js";

class BasicAuthPage extends Page {
  get message() {
    return $(".example > p");
  }

  async login(username, password) {
    await this.openWithAuth(username, password);
  }

  openWithAuth(username, password) {
    return browser.url(
      `https://${username}:${password}@the-internet.herokuapp.com/basic_auth`
    );
  }
}

export default new BasicAuthPage();
