"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePrivacyWarningModal = exports.closeWhatsNewModal = exports.closePopup = exports.importAccount = exports.declineAnalytics = exports.confirmWelcomeScreen = exports.acceptTheRisks = exports.enableEthSign = exports.showTestNets = void 0;
const helpers_1 = require("../helpers");
async function showTestNets(metaMaskPage) {
    await (0, helpers_1.openNetworkDropdown)(metaMaskPage);
    const toggleSwitch = await metaMaskPage.waitForSelector(".toggle-button", {
        visible: true,
    });
    await toggleSwitch.click();
    await (0, helpers_1.clickOnLogo)(metaMaskPage);
}
exports.showTestNets = showTestNets;
async function enableEthSign(metaMaskPage) {
    await (0, helpers_1.openSettingsScreen)(metaMaskPage, "Advanced");
    await (0, helpers_1.clickOnSettingsSwitch)(metaMaskPage, "Eth_sign requests");
    await (0, helpers_1.clickOnElement)(metaMaskPage, "#eth-sign-checkbox");
    await (0, helpers_1.clickOnButton)(metaMaskPage, "Continue");
    await (0, helpers_1.typeOnInputField)(metaMaskPage, "Enter “I only sign what I understand” to continue", "I only sign what I understand");
    await (0, helpers_1.clickOnButton)(metaMaskPage, "Enable");
    await metaMaskPage.waitForTimeout(333);
    await (0, helpers_1.clickOnLogo)(metaMaskPage);
}
exports.enableEthSign = enableEthSign;
async function acceptTheRisks(metaMaskPage) {
    await (0, helpers_1.waitForOverlay)(metaMaskPage);
    await metaMaskPage.waitForSelector('[data-testid="experimental-area"]', {
        visible: true,
    });
    await (0, helpers_1.clickOnElement)(metaMaskPage, "I accept the risks");
}
exports.acceptTheRisks = acceptTheRisks;
async function confirmWelcomeScreen(metaMaskPage) {
    await (0, helpers_1.clickOnButton)(metaMaskPage, "Get started");
}
exports.confirmWelcomeScreen = confirmWelcomeScreen;
async function declineAnalytics(metaMaskPage) {
    await (0, helpers_1.clickOnButton)(metaMaskPage, "No thanks");
}
exports.declineAnalytics = declineAnalytics;
async function importAccount(metaMaskPage, { seed = "already turtle birth enroll since owner keep patch skirt drift any dinner", password = "password1234", }) {
    await (0, helpers_1.waitForOverlay)(metaMaskPage);
    await (0, helpers_1.clickOnElement)(metaMaskPage, "#onboarding__terms-checkbox");
    await (0, helpers_1.clickOnElement)(metaMaskPage, "onboarding-import-wallet");
    await (0, helpers_1.clickOnButton)(metaMaskPage, "metametrics-i-agree");
    for (const [index, seedPart] of seed.split(" ").entries())
        await (0, helpers_1.typeOnInputField)(metaMaskPage, `${index + 1}.`, seedPart);
    await (0, helpers_1.clickOnButton)(metaMaskPage, "Confirm Secret");
    await (0, helpers_1.typeOnInputField)(metaMaskPage, "New password", password);
    await (0, helpers_1.typeOnInputField)(metaMaskPage, "Confirm password", password);
    // onboarding/create-password URL
    await (0, helpers_1.clickOnButton)(metaMaskPage, "create-password-terms");
    await (0, helpers_1.clickOnNavigationButton)(metaMaskPage, "create-password-import");
    await (0, helpers_1.waitForOverlay)(metaMaskPage);
    // onboarding/completion URL
    await (0, helpers_1.clickOnNavigationButton)(metaMaskPage, "onboarding-complete-done");
    // onboarding/pin-extension tab 1 URL
    await (0, helpers_1.clickOnButton)(metaMaskPage, "pin-extension-next");
    // onboarding/pin-extension tab 2 URL
    await (0, helpers_1.clickOnNavigationButton)(metaMaskPage, "pin-extension-done");
}
exports.importAccount = importAccount;
const closePopup = async (page) => {
    await (0, helpers_1.evaluateElementClick)(page, ".popover-header__button");
};
exports.closePopup = closePopup;
const closeWhatsNewModal = async (page) => {
    await (0, helpers_1.evaluateElementClick)(page, '[data-testid="popover-close"]');
};
exports.closeWhatsNewModal = closeWhatsNewModal;
const closePrivacyWarningModal = async (page) => {
    await (0, helpers_1.clickOnButton)(page, "snap-privacy-warning-scroll");
    await page.waitForTimeout(1000);
    await (0, helpers_1.clickOnButton)(page, "Accept");
};
exports.closePrivacyWarningModal = closePrivacyWarningModal;
