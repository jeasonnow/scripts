import { DappeteerElementHandle, DappeteerPage } from "../assets/dappeteer";

export const getElementByContent = (
    page: DappeteerPage,
    text: string,
    type = "*",
    options?: { timeout?: number; visible?: boolean }
  ): Promise<DappeteerElementHandle | null> =>
    page.waitForXPath(`//${type}[contains(text(), '${text}')]`, {
      timeout: 0,
      visible: true,
      ...options,
    });