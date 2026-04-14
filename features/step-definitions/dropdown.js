import { When, Then } from "@wdio/cucumber-framework";
import { expect } from "@wdio/globals";
import dropdownPage from "../pageobjects/dropdown.page.js";

When(/^I select "(.+)"$/, async function (option) {
  await dropdownPage.select(option);
});

Then(/^The dropdown value should be "(.+)"$/, async function (option) {
  expect(await dropdownPage.selectedOptionText()).toBe(option);
});
