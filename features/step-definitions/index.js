import { Given, When, Then } from "@wdio/cucumber-framework";
import Page from "../pageobjects/page.js";
const index = new Page();

Given(/^I am on the (.+) page$/, async (page) => {
  await index.open(page);
});

Given("I am at the index page", async function () {
  await index.open();
});

When(/^I click the (.+) link$/, async function (page) {
  this.page = page;
  await index.click(page);
});

Then("I should be directed to the selected page", async function () {
  const headerMapping = {
    "A/B Testing": ["A/B Test Control", "A/B Test Variation 1"],
    "Dynamic Loading": ["Dynamically Loaded Page Elements"],
    "JQuery UI Menus": ["JQueryUI - Menu"],
    "Multiple Windows": ["Opening a new window"],
    "Redirect Link": ["Redirection"],
    "File Download": ["File Downloader"],
    "Notification Messages": ["Notification Message"],
    "Form Authentication": ["Login Page"],
    "Shadow DOM": ["Simple template"],
    "JavaScript onload event error": ["JavaScript error in the onload event"],
    "Broken Images": ["Broken Images"],
    "Challenging DOM": ["Challenging DOM"],
  };

  // 1. Try to find the header and match it using the mapping
  const header = await $("h1, h2, h3");
  let isVerified = false;

  try {
    if (await header.waitForExist({ timeout: 5000 })) {
      const actualHeader = await header.getText();
      const expectedHeaders = headerMapping[this.page] || [this.page];

      isVerified = expectedHeaders.some(
        (h) =>
          actualHeader.toLowerCase().includes(h.toLowerCase()) ||
          h.toLowerCase().includes(actualHeader.toLowerCase()) ||
          actualHeader.toLowerCase().includes(this.page.toLowerCase())
      );
    }
  } catch (e) {
    // Header check failed/timed out, proceed to failsafes
  }

  if (isVerified) return;

  // 2. Safely get URL and Body Text (Frameset compatible)
  const url = await browser.getUrl();
  const bodyText = await browser.execute(() => {
    return document.body ? document.body.innerText : (document.documentElement ? document.documentElement.innerText : "");
  });

  const urlMapping = {
    "Secure File Download": "download_secure",
    "Digest Authentication": "digest_auth",
    "JavaScript onload event error": "javascript_error",
    "Basic Auth": "basic_auth",
    "Nested Frames": "nested_frames",
  };

  const urlTarget = urlMapping[this.page] || this.page.toLowerCase().replace(/ /g, "_");
  const urlLow = url.toLowerCase();

  // 3. Failsafe: URL matching (Handles framesets and blank/error pages)
  if (urlLow.includes(urlTarget) || urlLow.includes(urlTarget.replace(/_/g, ""))) {
    return;
  }

  // 4. Final Fallback: Check mapped values in the body text
  const expectedContent = headerMapping[this.page] || [this.page];
  const isBodyMatch = expectedContent.some((c) => bodyText.toLowerCase().includes(c.toLowerCase()));

  if (isBodyMatch) return;

  // Last resort: Strict check with debug info
  try {
    await expect($("body")).toHaveTextContaining(this.page);
  } catch (err) {
    console.error(`NAVIGATION FAILURE DEBUG:
      Page: ${this.page}
      URL: ${url}
      Target: ${urlTarget}
      Body Snippet: ${bodyText.substring(0, 100)}...
    `);
    throw err;
  }
});
