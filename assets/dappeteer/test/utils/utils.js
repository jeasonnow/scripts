"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserDataTest = exports.clickElement = exports.pause = void 0;
function pause(seconds) {
    return new Promise((res) => setTimeout(res, 1000 * seconds));
}
exports.pause = pause;
async function clickElement(page, selector) {
    await page.bringToFront();
    await page.waitForSelector(selector, { timeout: 15000 });
    const element = await page.$(selector);
    await element.click();
}
exports.clickElement = clickElement;
function isUserDataTest() {
    return Boolean(process.env.USER_DATA_TEST);
}
exports.isUserDataTest = isUserDataTest;
