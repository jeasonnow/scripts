import { AbstractClaimTool } from "types";
import fs from 'fs/promises';
import fsn from 'fs';
import EvmWallet, { WalletItem } from "./evmWallet";
import {Dappeteer, DappeteerPage, bootstrap, launch, setupMetaMask} from '@chainsafe/dappeteer';
import path from 'path';
import config from '../config';
import { getElementByContent } from "./selector";
import async from 'async';
import {Solver} from '2captcha-ts';


interface Layer3ClaimerOptions {
    ips: string[];
}

const taskUrlDict = {
    1: 'https://layer3.xyz/quests/linea-park-entrance',
    2: 'https://layer3.xyz/quests/the-linea-voyage-gaming-and-social-linea-park',
    3: 'https://layer3.xyz/quests/security-learn',
    4: 'https://layer3.xyz/quests/metamask-prioritizes-user-security'
}



class Layer3Claimer implements AbstractClaimTool {
    public options = {
        ips: [] as string[],
    }

    private walletData: WalletItem[] = [];

    private solver: Solver = new Solver(config["2captchaToken"]);

    constructor(options: Layer3ClaimerOptions) {
        this.options = options;
    }

    initWallet() {
        this.walletData = new EvmWallet({walletQuantity: this.options.ips.length, generateMethod: 'randomBatchDifferent'}).generateWallet();
        console.log(this.walletData);
        // 写入 json 文件，方便后续操作
    }

    async solveCloudflare(page: DappeteerPage) {
        // 定义一个函数来检查变量是否存在
        async function checkVariableExists() {
            // 尝试访问变量，如果不存在，将会抛出异常
            try {
            return typeof window['turnstile' as any] !== 'undefined';
            } catch (e) {
            return false;
            }
        }
        // 使用 page.evaluate 来在浏览器上下文中执行 checkVariableExists 函数
        let variableExists = false;
        variableExists = await page.evaluate(checkVariableExists);

        if (!variableExists) {
            return Promise.resolve();
        }
               
        const preloadFile = fsn.readFileSync(path.join('.', 'assets/inject', 'cloudflare.js'), 'utf8');
        await (page as any).evaluateOnNewDocument(preloadFile);
        return new Promise((resolve) => {
            (page as any).on('console', async (msg: any) => {
                const txt = msg.text()
                if (txt.includes('intercepted-params:')) {
                    const params = JSON.parse(txt.replace('intercepted-params:', ''))
                    console.log(params)

                    try {
                        console.log(`Solving the captcha...`)
                        const res = await this.solver.cloudflareTurnstile(params)
                        console.log(`Solved the captcha ${res.id}`)
                        const checkCallbackFn = `function () {
                            window.cfCallback(${res.data});
                        }`
                        await page.evaluate(checkCallbackFn as any);
                        resolve(res.data);
                    } catch (e: any) {
                        console.log(e)
                        return process.exit()
                    }
                } else {
                    return;
                }
            })
        })
        
    }
            


    async solveCaptch(page: DappeteerPage) {
        const frame = await (page as any).waitForFrame((frame: any) => {
            return frame.url().includes('recaptcha')
        });
        await frame.waitForSelector('.recaptcha-checkbox');
        const result = await (page as any).solveRecaptchas();
        return result;
    }


    async autoLogin(page: DappeteerPage, metaMask: Dappeteer) {
        await this.solveCloudflare(page);
        const button = await page.waitForXPath(`//span[contains(.,'Sign in')]/parent::button`);
        button.click();
        
        const metamaskButton = await page.waitForXPath(`//span[contains(.,'MetaMask')]/parent::div/parent::button`);
        await metamaskButton.click();
        await page.waitForTimeout(1000);
        await metaMask.page.bringToFront();

        await metaMask.approve();
        await metaMask.sign();
        await page.bringToFront();
        await this.solveCaptch(page);
        await page.$eval(`#toaster-portal button`, element => {
            console.log(element);
            element.click();
        })
        // await this.clickButton(page, 'Create new account');
        await page.waitForTimeout(5000);
        // await metaMask.acceptAddToken();
    }

    private async getTaskPage(page: DappeteerPage, step: 1 | 2 | 3 | 4) {
        const pages = await page.browser().pages();
        let taskPage: DappeteerPage = Array.from(pages).find(page => page.url() === taskUrlDict[step]) ?? pages[pages.length - 1];

        return taskPage;
    }

    private async clickButtonByContent(page: DappeteerPage, text: string) {
        const xpath = `//button/p[contains(text(), '${text}')]`;
        const button = await page.waitForXPath(xpath);
        return button?.click();
    }

    private async clickContinueButton(page: DappeteerPage) {
        await page.waitForTimeout(1000);
        return this.clickButton(page, 'Continue');
    }

    private async clickButton(page: DappeteerPage, buttonText: string, type: string = 'button') {
        const button = await getElementByContent(page, buttonText, type);
        await button?.click();
        await page.waitForTimeout(600);
        return button;
    }

    private async clickbuttonById(page: DappeteerPage, id: string) {
        const button = await page.waitForSelector(`#${id}`);
        return button?.click();
    }

    private async startWorkWithContent(page: DappeteerPage, content: string, type: string = 'h2') {
        const worker = await getElementByContent(page, content, type);
        return await worker?.click();
    }


    async completeWork(page: DappeteerPage) {
        (await page.browser().newPage()).goto(taskUrlDict[1])
        let taskPage = await this.getTaskPage(page, 1);
        // task 1, continue 5 times
        await this.startWorkWithContent(taskPage, 'Getting Started');
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickButton(taskPage, 'All of them', 'p');
        await this.clickContinueButton(taskPage);
        await this.clickButton(taskPage, 'Verify');
        await this.clickContinueButton(taskPage);
        await page.waitForTimeout(3000);
        await taskPage.close();
        // back to home page
        // task 2, continue 12 times
        (await page.browser().newPage()).goto(taskUrlDict[2])

        taskPage = await this.getTaskPage(page, 2);
        await this.clickButton(taskPage, 'Begin');
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickButton(taskPage, 'All of these', 'p');
        await this.clickContinueButton(taskPage);
        await this.clickButton(taskPage, 'All of the above', 'p');
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await page.waitForTimeout(3000);
        await taskPage.close();

        // task 3
        (await page.browser().newPage()).goto(taskUrlDict[3])

        taskPage = await this.getTaskPage(page, 3);
        await this.clickButton(taskPage, 'Begin');
        await this.clickContinueButton(taskPage);
        await page.waitForTimeout(1000);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickbuttonById(taskPage, 'a2');
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await page.waitForTimeout(1000);
        await taskPage.close();

        //task 4
        (await page.browser().newPage()).goto(taskUrlDict[4])

        taskPage = await this.getTaskPage(page, 4);
        await this.clickButton(taskPage, 'Begin');
        await page.waitForTimeout(1000);
        await this.clickContinueButton(taskPage);
        await page.waitForTimeout(1000);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickButton(taskPage, 'Skip');
        await this.clickContinueButton(taskPage);
        await this.startWorkWithContent(taskPage, `Reject`, 'p');
        await this.clickContinueButton(taskPage);
        await this.startWorkWithContent(taskPage, `Allowing`, 'p');
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await this.clickContinueButton(taskPage);
        await taskPage.close();

        await page.waitForTimeout(300);
        return;
    }

    async start(pageUrl: string, proxy: string, index: number) {
        return new Promise(async (resolve) => {
            const {browser, metaMask} = await bootstrap({
                headless: config.headless,
                seed: this.walletData[index].mnemonic,
                password: config.walletPassword,
                metaMaskPath: path.join('.', 'assets/metamask-chrome-11.11.1'),
                automation: 'puppeteer',
                puppeteerOptions: {
                    pluginConfig: {
                        "2captchaToken": config["2captchaToken"],
                    },
                    devtools: true,
                    args:  [
                        `--proxy-server=${proxy}`,
                        '--no-sandbox',
                        '--disable-setuid-sandbox'],
                }
            });
            
            try {
                const page = await browser.newPage();
                await page.goto(pageUrl, {timeout: 0, waitUntil: 'domcontentloaded'});
                await this.autoLogin(page, metaMask);
                await this.completeWork(page);
                await browser.close();
                this.walletData[index].complete = true;
                resolve('done');
            } catch (e) {
                console.error(e);
                this.walletData[index].complete = false;
                resolve('fail');
            }
        })
        
        // const frame = await page.waitForFrame(frame => frame.url().includes('https://challenges.cloudflare.com'));
        // console.log(frame);
    }

    async claim() {
        try {
            const { ips } = this.options;
            await this.initWallet();
            const pageUrl = 'https://layer3.xyz/linea-park';
            await async.mapLimit(ips, config.parallelCount, async (ip: string) => {
                return await this.start(pageUrl, ip, ips.indexOf(ip));
            });
            fs.writeFile('walletData.json', JSON.stringify(this.walletData, null, 2));
        } catch {
            fs.writeFile('walletData.json', JSON.stringify(this.walletData, null, 2));
        }
        
    }
}

export default Layer3Claimer;