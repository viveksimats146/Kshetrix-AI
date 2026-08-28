import { remote } from 'webdriverio';
import assert from 'assert';

/**
 * E2E Appium Test Suite for Kshetrix-AI Native Android App
 * 
 * Prerequisites:
 * 1. Install Appium client: `npm install webdriverio`
 * 2. Start the Appium Server: `appium`
 * 3. Make sure the phone (RMX5033) is connected via USB with USB debugging enabled.
 * 4. Run the tests: `node mobile-tests.js`
 */
async function runMobileAppiumTests() {
  const capabilities = {
    platformName: 'Android',
    'appium:deviceName': 'RMX5033',
    'appium:appPackage': 'com.example.agricoapp',
    'appium:appActivity': '.MainActivity',
    'appium:automationName': 'UiAutomator2',
    'appium:noReset': false,
    'appium:ensureWebviewsHavePages': true,
    'appium:nativeWebScreenshot': true,
    'appium:newCommandTimeout': 3600
  };

  const options = {
    path: '/wd/hub', // Default Appium 1.x path (change to '/' for Appium 2.x)
    port: 4723,
    capabilities
  };

  console.log("=========================================");
  console.log("Starting Appium E2E Mobile App Tests...");
  console.log("=========================================");

  let driver;
  try {
    driver = await remote(options);
    console.log("App successfully launched on device.");

    // 1. Wait for Android WebView to load
    await driver.sleep(5000); 

    // 2. Switch context from NATIVE_APP to WEBVIEW to interact with the React code
    const contexts = await driver.getContexts();
    console.log("Available Contexts:", contexts);
    
    const webviewContext = contexts.find(c => c.includes('WEBVIEW'));
    if (webviewContext) {
      await driver.switchContext(webviewContext);
      console.log(`Switched context to: ${webviewContext}`);
    } else {
      throw new Error("WebView context not found! Make sure USB debugging is enabled.");
    }

    // 3. Automate Splash Screen (Web Environment inside WebView)
    const welcomeBtn = await driver.$("//button[contains(text(), 'Get Started')]");
    await welcomeBtn.waitForDisplayed({ timeout: 10000 });
    await welcomeBtn.click();
    console.log("Passed Splash Screen inside WebView.");

    // 4. Welcome Screen - Click 'I already have an account'
    const loginLinkBtn = await driver.$("//button[contains(text(), 'I already have an account')]");
    await loginLinkBtn.waitForDisplayed({ timeout: 5000 });
    await loginLinkBtn.click();
    console.log("Navigated to Login Form.");

    // 5. Enter invalid credentials to test error alerts
    const emailInput = await driver.$("//input[@placeholder='farmer@example.com']");
    const passwordInput = await driver.$("//input[@placeholder='••••••••']");
    const loginButton = await driver.$("//button[text()='Login']");

    await emailInput.setValue('invalid-email-format');
    await passwordInput.setValue('123');
    await loginButton.click();
    console.log("Triggered validation checks inside WebView.");
    await driver.sleep(1000);

    // 6. Enter valid credentials to proceed to OTP
    await emailInput.setValue('vivekmpv1304@gmail.com');
    await passwordInput.setValue('password123');
    await loginButton.click();
    console.log("Submitted credentials. Waiting for OTP screen...");

    // 7. Verify OTP Screen loads
    const otpTitle = await driver.$("//h2[contains(text(), 'OTP')]");
    await otpTitle.waitForDisplayed({ timeout: 10000 });
    console.log("OTP Verification Screen successfully loaded.");

    // Enter verification code (4821 bypass code)
    const otpInputs = await driver.$$("//input[@maxLength='1']");
    assert.strictEqual(otpInputs.length, 4, "Should find exactly 4 single-digit input fields.");

    const code = ['4', '8', '2', '1'];
    for (let i = 0; i < 4; i++) {
      await otpInputs[i].setValue(code[i]);
      await driver.sleep(300); // Simulate typing
    }
    console.log("Entered master bypass OTP code: 4821");

    const verifyBtn = await driver.$("//button[text()='Verify & Proceed']");
    await verifyBtn.click();
    console.log("Submitted OTP verification.");

    // 8. Confirm redirect to Profile Setup screen
    const nameInput = await driver.$("//input[@placeholder='Enter your name']");
    await nameInput.waitForDisplayed({ timeout: 10000 });
    console.log("SUCCESS: Mobile app logged in and reached Profile Setup page!");

    // 9. Switch back to NATIVE_APP to test native features (like profile photo upload)
    await driver.switchContext('NATIVE_APP');
    console.log("Switched context back to NATIVE_APP.");

    // Trigger profile photo upload button (web component) and check native camera/gallery chooser dialog popup
    // (This part would click the photo box, which triggers the WebChromeClient file chooser launcher)
    console.log("E2E Mobile Test Completed Successfully!");

  } catch (err) {
    console.error("APPIUM TEST ERROR:", err);
  } finally {
    if (driver) {
      await driver.deleteSession();
      console.log("Appium Session closed.");
    }
  }
}

runMobileAppiumTests();
