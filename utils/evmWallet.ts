import {ethers} from 'ethers';

export interface WalletItem {
    address: string;
    mnemonic: string;
    privateKey: string;
    path: string;
    complete?: boolean;
}


interface EvmWalletOptions {
    walletQuantity: number;
    mnemonicLength: number;
    generateMethod: 'randomBatchSame' | 'randomBatchDifferent';
    advancedOptions?: {
        account: string;
        externalorInternal: string;
        index: string;
    };
}

interface EvmWallet {
    options: EvmWalletOptions;
    generateWallet(): void;
}

class EvmWallet implements EvmWallet {
    private walletData = [] as WalletItem[];
    public options: EvmWalletOptions = {
        //钱包数量
        walletQuantity: 1,
        //助记词长度
        mnemonicLength: 12,
        //生成方式
        generateMethod: 'randomBatchSame',
        //高级选项
        advancedOptions: {
            account: '0',
            externalorInternal: '0',
            index: '0'
        }
    }
    constructor(options: Partial<EvmWalletOptions>) {
        this.options = {
            ...this.options,
            ...options
        };
    }

    //生成助记词（数量）
    private generateMnemonic(mnemonicLength: number) {
        mnemonicLength = ((mnemonicLength - 12) / 3) * 4 + 16
        return ethers.utils.entropyToMnemonic(
            ethers.utils.randomBytes(mnemonicLength)
        )
    }

    //助记词生成钱包
    private mnemonicGenerateWallet(mnemonic: string, i: number) {
        const {advancedOptions = {
            account: '0',
            externalorInternal: '0',
            index: '0'
        }} = this.options;
        //判断用户是否打开高级选项
        let path = null
        if (advancedOptions) {
            path =
                "m/44'/60'/" +
                advancedOptions.account +
                "'/" +
                advancedOptions.externalorInternal +
                '/' +
                (parseInt(advancedOptions.index) + i)
        } else {
            path = "m/44'/60'/0'/0/" + (0 + i)
        }
        try {
            let wallet = ethers.Wallet.fromMnemonic(mnemonic, path) //通过助记词创建钱包
            //将钱包添加到钱包列表
            const walletItem = {
                address: wallet.address,
                mnemonic: mnemonic,
                privateKey: wallet.privateKey,
                path: path,
            }
            this.walletData.push(walletItem)
        } catch (error) {
           console.error(error);
        }
    }

    //随机批量生成钱包（助记词相同）
    private randomBatchSame() {
        //获取助记词
        let mnemonic = this.generateMnemonic(this.options.mnemonicLength)
        this.walletData = []
        for (let i = 0; i < this.options.walletQuantity; i++) {
            this.mnemonicGenerateWallet(mnemonic, i)
        }
    }

    //随机批量生成钱包（助记词不同）
    private randomBatchDifferent() {
        this.walletData = []
        for (let i = 0; i < this.options.walletQuantity; i++) {
            //获取助记词
            let mnemonic = this.generateMnemonic(
                this.options.mnemonicLength
            )
            this.mnemonicGenerateWallet(mnemonic, 0)
        }
    }

    public generateWallet() {
        const {generateMethod} = this.options;
        (this[generateMethod] as Function)();
        return this.walletData;
    }
}

export default EvmWallet;