import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

/**
 * E2E Selenium Test Suite for Kshetrix-AI Web Frontend Login & OTP Flow
 * 
 * Prerequisites:
 * 1. Install Selenium WebDriver: `npm install selenium-webdriver`
 * 2. Install ChromeDriver: `npm install -g chromedriver`
 * 3. Make sure the local dev server is running on `http://localhost:5173`
 * 4. Run tests: `node login-tests.js`
 */
async function runLoginTests() {
  // Initialize the Chrome browser driver
  let driver = await new Builder().forBrowser('chrome').build();
  
  try {
    console.log("=========================================");
    console.log("Starting Selenium E2E Login Flow Tests...");
    console.log("=========================================");
    
    // 1. Navigate to the local server
    await driver.get('http://localhost:5173');
    console.log("Navigated to: http://localhost:5173");
    
    // 2. Wait for Splash Screen and click Get Started button
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Get Started')]")), 10000);
    const getStartedBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Get Started')]"));
    await getStartedBtn.click();
    console.log("Passed Splash Screen.");

    // 3. Wait for Welcome Screen and click 'I already have an account' to go to Login
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'I already have an account')]")), 10000);
    const loginLinkBtn = await driver.findElement(By.xpath("//button[contains(text(), 'I already have an account')]"));
    await loginLinkBtn.click();
    console.log("Passed Welcome Screen. Navigated to Login Form.");

    // 4. Navigate to Login form inputs
    await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='farmer@example.com']")), 5000);
    const emailInput = await driver.findElement(By.xpath("//input[@placeholder='farmer@example.com']"));
    const passwordInput = await driver.findElement(By.xpath("//input[@placeholder='••••••••']"));
    const loginButton = await driver.findElement(By.xpath("//button[text()='Login']"));

    // Case A: Test Empty/Invalid Inputs
    await emailInput.sendKeys('invalid-email-format');
    await passwordInput.sendKeys('123');
    await loginButton.click();
    console.log("Triggered validation checks with invalid inputs.");
    
    // Wait to see error message container
    await driver.sleep(1000); 

    // Case B: Clear and enter valid test credentials
    // Select all text to clear input fields safely
    await emailInput.sendKeys('\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003');
    await emailInput.clear();
    await emailInput.sendKeys('vivekmpv1304@gmail.com');
    
    await passwordInput.clear();
    await passwordInput.sendKeys('password123');
    
    await loginButton.click();
    console.log("Submitted valid credentials. Waiting for OTP Screen...");

    // 4. Wait for OTP Verification Screen
    await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'OTP')]")), 10000);
    console.log("OTP Verification Screen loaded successfully.");

    // Verify presence of exactly 4 single-digit inputs
    const otpInputs = await driver.findElements(By.xpath("//input[@maxLength='1']"));
    assert.strictEqual(otpInputs.length, 4, "Should display exactly 4 single-digit OTP input boxes.");
    console.log("OTP input fields validated.");

    // Send the simulated code inputs (4821 is our offline fallback code)
    const code = ['4', '8', '2', '1'];
    for (let i = 0; i < 4; i++) {
      await otpInputs[i].sendKeys(code[i]);
      await driver.sleep(200); // Small delay to simulate user typing
    }
    console.log("Entered verification code: 4821");

    // Click verify and proceed
    const verifyButton = await driver.findElement(By.xpath("//button[text()='Verify & Proceed']"));
    await verifyButton.click();
    console.log("Submitted Verification request.");

    // Wait for redirect to profile setup screen elements (logged in state)
    await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Enter your name']")), 10000);
    console.log("SUCCESS: Logged in and redirected to profile setup page!");

  } catch (error) {
    console.error("TEST ERROR: E2E Suite failed: ", error);
    try {
      const currentUrl = await driver.getCurrentUrl();
      console.log("Current URL during failure:", currentUrl);
      const pageSource = await driver.getPageSource();
      console.log("------------------ PAGE SOURCE ------------------");
      console.log(pageSource.slice(0, 1500)); // Print first 1500 chars of HTML
      console.log("-------------------------------------------------");
    } catch (e) {
      console.log("Failed to extract page source.");
    }
  } finally {
    // Terminate browser session
    await driver.quit();
    console.log("Browser driver closed. End of execution.");
  }
}

runLoginTests();
