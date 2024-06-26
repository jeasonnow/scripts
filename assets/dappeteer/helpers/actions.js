"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateElementClick = exports.clickOnLittleDownArrowIfNeeded = exports.waitForOverlay = exports.typeOnInputField = exports.goToHomePage = exports.clickOnLogo = exports.clickOnNavigationButton = exports.clickOnButton = exports.clickOnElement = exports.accountOptionsDropdownClick = exports.profileDropdownClick = exports.openNetworkDropdown = exports.openSettingsScreen = exports.clickOnSettingsSwitch = void 0;
const selectors_1 = require("./selectors");
const utils_1 = require("./utils");
const clickOnSettingsSwitch = async (page, text) => {
    const button = await (0, selectors_1.getSettingsSwitch)(page, text);
    await button.click();
};
exports.clickOnSettingsSwitch = clickOnSettingsSwitch;
const openSettingsScreen = async (page, section = "General") => {
    await (0, exports.clickOnElement)(page, "account-options-menu-button");
    await (0, exports.clickOnElement)(page, "global-menu-settings");
    await (0, exports.clickOnElement)(page, section);
};
exports.openSettingsScreen = openSettingsScreen;
const openNetworkDropdown = async (page) => {
    await (0, utils_1.retry)(async () => {
        const networkSwitcher = await page.waitForSelector(".mm-picker-network", {
            visible: true,
        });
        await networkSwitcher.click();
    }, 3);
};
exports.openNetworkDropdown = openNetworkDropdown;
const profileDropdownClick = async (page) => {
    await (0, utils_1.retry)(async () => {
        await (0, exports.clickOnButton)(page, "account-menu-icon", {
            visible: true,
            timeout: 2000,
        });
    }, 3);
};
exports.profileDropdownClick = profileDropdownClick;
const accountOptionsDropdownClick = async (page, expectToClose = false) => {
    await (0, utils_1.retry)(async () => {
        const accountOptionsButton = await page.waitForSelector(`[data-testid="account-options-menu-button"]`, {
            visible: true,
            timeout: 2000,
        });
        await accountOptionsButton.click();
        await page.waitForSelector(".menu__container", {
            hidden: expectToClose,
            timeout: 2000,
        });
    }, 3);
};
exports.accountOptionsDropdownClick = accountOptionsDropdownClick;
const clickOnElement = async (page, text, type) => {
    const element = await Promise.race([
        (0, selectors_1.getElementByContent)(page, text, type),
        (0, selectors_1.getElementByTestId)(page, text),
        (0, selectors_1.getELementBySelector)(page, text),
    ]);
    await element.click();
};
exports.clickOnElement = clickOnElement;
const clickOnButton = async (page, text, options) => {
    const button = await (0, selectors_1.getButton)(page, text, options);
    await button.click();
};
exports.clickOnButton = clickOnButton;
const clickOnNavigationButton = async (metaMaskPage, text) => {
    const navigationButton = await (0, selectors_1.getButton)(metaMaskPage, text);
    await Promise.all([
        metaMaskPage.waitForNavigation(),
        navigationButton.click(),
    ]);
};
exports.clickOnNavigationButton = clickOnNavigationButton;
const clickOnLogo = async (page) => {
    const header = await page.waitForSelector(".app-header__logo-container", {
        visible: true,
    });
    await header.click();
};
exports.clickOnLogo = clickOnLogo;
const goToHomePage = async (page) => {
    return await (0, exports.clickOnButton)(page, "app-header-logo");
};
exports.goToHomePage = goToHomePage;
/**
 *
 * @param page
 * @param label
 * @param text
 * @param clear
 * @param excludeSpan
 * @param optional
 * @returns true if found and updated, false otherwise
 */
const typeOnInputField = async (page, label, text, clear = false, excludeSpan = false, optional = false) => {
    let input;
    try {
        input = await (0, selectors_1.getInputByLabel)(page, label, excludeSpan, 1000);
    }
    catch (e) {
        if (optional)
            return false;
        throw e;
    }
    if (clear) {
        await input.type("");
    }
    await input.type(text);
    return true;
};
exports.typeOnInputField = typeOnInputField;
async function waitForOverlay(page) {
    await page.waitForSelectorIsGone(".loading-logo", { timeout: 20000 });
    await page.waitForSelectorIsGone(".loading-spinner", { timeout: 20000 });
    await page.waitForSelectorIsGone(".loading-overlay", { timeout: 20000 });
    await page.waitForSelectorIsGone(".app-loading-spinner", { timeout: 20000 });
}
exports.waitForOverlay = waitForOverlay;
/**
 *
 * @param page
 */
const clickOnLittleDownArrowIfNeeded = async (page) => {
    // wait for the signature page and content to be loaded
    await page.waitForSelector('[data-testid="page-container-footer-next"]', {
        visible: true,
    });
    // MetaMask requires users to read all the data
    // and scroll until the bottom of the message
    // before enabling the "Sign" button
    const isSignButtonDisabled = await page.$eval('[data-testid="page-container-footer-next"]', (button) => {
        return button.disabled;
    });
    if (isSignButtonDisabled) {
        const littleArrowDown = await page.waitForSelector(".signature-request-message__scroll-button", {
            visible: true,
        });
        await littleArrowDown.click();
    }
};
exports.clickOnLittleDownArrowIfNeeded = clickOnLittleDownArrowIfNeeded;
const evaluateElementClick = async (page, selector) => {
    /* For some reason popup deletes close button and then create new one (react stuff)
     * hacky solution can be found here => https://github.com/puppeteer/puppeteer/issues/3496 */
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.$eval(selector, (node) => node.click());
};
exports.evaluateElementClick = evaluateElementClick;
