"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getButton = exports.getErrorMessage = exports.getSettingsSwitch = exports.getInputByLabel = exports.getELementBySelector = exports.getElementByTestId = exports.getElementByContent = void 0;
// TODO: change text() with '.';
const getElementByContent = (page, text, type = "*", options) => page.waitForSelector("xpath/" + `//${type}[contains(text(), '${text}')]`, {
    timeout: 0,
    visible: true,
    ...options,
});
exports.getElementByContent = getElementByContent;
const getElementByTestId = (page, testId, options = {}) => page.waitForSelector(`[data-testid="${testId}"]`, {
    timeout: 20000,
    visible: true,
    ...options,
});
exports.getElementByTestId = getElementByTestId;
const getELementBySelector = (page, selector, options) => page.waitForSelector(selector, {
    timeout: 2000,
    visible: true,
    ...options,
});
exports.getELementBySelector = getELementBySelector;
const getInputByLabel = (page, text, excludeSpan = false, timeout = 1000) => page.waitForSelector("xpath/" +
    [
        `//label[contains(.,'${text}')]/following-sibling::textarea`,
        `//label[contains(.,'${text}')]/following-sibling::*//input`,
        `//h6[contains(.,'${text}')]/parent::node()/parent::node()/following-sibling::input`,
        `//h6[contains(.,'${text}')]/parent::node()/parent::node()/following-sibling::*//input`,
        ...(!excludeSpan
            ? [
                `//span[contains(.,'${text}')]/parent::node()/parent::node()/following-sibling::*//input`,
                `//span[contains(.,'${text}')]/following-sibling::*//input`,
            ]
            : []),
    ].join("|"), { timeout, visible: true });
exports.getInputByLabel = getInputByLabel;
const getSettingsSwitch = (page, text) => page.waitForSelector("xpath/" +
    [
        `//span[contains(.,'${text}')]/parent::div/following-sibling::div/div/div/div`,
        `//span[contains(.,'${text}')]/parent::div/following-sibling::div/div/label/div`,
        `//span[contains(.,'${text}')]/parent::div/following-sibling::div/label/div`,
    ].join("|"), { timeout: 0, visible: true });
exports.getSettingsSwitch = getSettingsSwitch;
const getErrorMessage = async (page) => {
    const options = {
        timeout: 1000,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errorElement = await Promise.race([
        page.waitForSelector(`span.error`, options),
        page.waitForSelector(`.typography--color-error-1`, options),
        page.waitForSelector(`.typography--color-error-default`, options),
        page.waitForSelector(`.box--color-error-default`, options),
        page.waitForSelector(`.mm-box--color-error-default`, options),
    ]).catch(() => null);
    if (!errorElement)
        return false;
    return page.evaluate((node) => node.textContent, errorElement.getSource());
};
exports.getErrorMessage = getErrorMessage;
const getButton = async (page, text, options) => {
    return await Promise.race([
        (0, exports.getElementByTestId)(page, text, options),
        (0, exports.getElementByContent)(page, text, "button", options),
        (0, exports.getElementByContent)(page, text, "span", options),
    ]);
};
exports.getButton = getButton;
