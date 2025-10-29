const { Builder, By, Key, until } = require('selenium-webdriver');
const config = require('../config/config');
const setupDriver = require('./driver_setup');
const { logStep, logSuccess, logFailure, logInfo } = require('./test_utils');

async function testBuyTour() {
  let driver;

  try {
    logStep("Setting up WebDriver");
    driver = await setupDriver(config.Browser, config.Chrome_Path, config.FireFox_Path);

    logStep("Navigating to application URL");
    await driver.get(config.URL);
    await driver.manage().window().maximize();

    logStep("Navigating to login page");
    const loginLink = await driver.wait(until.elementLocated(By.linkText("Login")), 10000);
    await loginLink.click();

    logStep("Entering login credentials");
    const emailInput = await driver.wait(until.elementLocated(By.id("email")), 10000);
    await emailInput.sendKeys("tester@gg.cc");

    const passwordInput = await driver.wait(until.elementLocated(By.id("password")), 10000);
    await passwordInput.sendKeys("12345678");

    logStep("Submitting login form");
    await driver.findElement(By.css("button[type='submit']")).click();

    logStep("Verifying successful login");
    const updateProfile = await driver.wait(until.elementLocated(
      By.xpath("//*[contains(text(), 'Update Profile')]")
    ), 10000);

    const isLoggedin = await updateProfile.isDisplayed();
    if (isLoggedin) {
      logSuccess("Successfully logged in");
    } else {
      logFailure("Failed to login");
      throw new Error("Login failed - Update Profile element not visible");
    }

    logStep("Navigating to Tours page");
    await driver.wait(until.elementLocated(By.linkText("Tours")), 10000);
    const tourLink = await driver.findElement(By.linkText("Tours"));
    await tourLink.click();

    logStep("Verifying Tours page load");
    const element = await driver.wait(until.elementLocated(
      By.xpath("//*[contains(., 'Are you ready to go on a challenge & consensus tour?')]")
    ), 10000);

    const isVisible = await element.isDisplayed();
    if (isVisible) {
      logSuccess("Tours page loaded successfully");
    } else {
      logFailure("Tours page failed to load");
    }

    logStep("Selecting test tour");
    const testTitleLink = await driver.findElement(By.linkText("Testing Tour1"));
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", testTitleLink);
    await driver.sleep(1000);
    await testTitleLink.click();

    logStep("Verifying tour details page");
    const tourTitle = await driver.wait(until.elementLocated(By.css('.fw-bold')), 10000);
    const isTour = await tourTitle.isDisplayed();

    if (isTour) {
      logSuccess("Successfully navigated to tour details");
    } else {
      logFailure("Failed to navigate to tour details");
    }

    logStep("Purchasing tour");
    const purchaseTourButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Purchase Tour')]")), 10000);
    await purchaseTourButton.click();

    logStep("Confirming purchase");
const confirmInput = await driver.wait(until.elementLocated(By.id("userConfirm")), 10000);

try {
  await driver.wait(until.elementIsVisible(confirmInput), 10000);
  await driver.sleep(500);
  await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", confirmInput);
  await driver.executeScript("arguments[0].value = 'yes';", confirmInput);
  logSuccess("Set confirmation input to 'yes'");
} catch (err) {
  logFailure("Failed to confirm purchase field", err);
}

logStep("Submitting purchase");
const submitBtn = await driver.wait(until.elementLocated(By.css(".px-2")), 10000);

try {
  // Wait for modal animations
  await driver.sleep(1000);

  // Scroll into view
  await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", submitBtn);
  await driver.wait(until.elementIsVisible(submitBtn), 10000);

  // Use JS click to bypass any overlay obstruction
  await driver.executeScript("arguments[0].click();", submitBtn);

  logSuccess("Clicked submit button successfully");
} catch (err) {
  logFailure("Failed to click submit button", err);
}



    // logStep("Verifying purchase completion");
    // const joinTourLink = await driver.wait(until.elementLocated(By.linkText("Join Tour")), 15000);
    // await driver.wait(until.elementIsVisible(joinTourLink), 10000);
    // //const joinTourSelector = await driver.findElement(By.linkText("Join Tour"));
    // await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", joinTourSelector);
    // const linkText = await joinTourLink.getText();

    // if (linkText.includes("Join Tour")) {
    //   logSuccess("Tour purchase completed successfully");
    // } else {
    //   logFailure("Tour purchase failed - Join Tour link not found");
    // }

  } catch (error) {
    logFailure("Test execution failed", error);
  } finally {
    if (driver) {
      logStep("Closing WebDriver");
      await driver.quit();
    }
  }
}

testBuyTour();
