## 该脚本的作用

基于定制化的 `dapp` 自动化测试工具 `dappeteer` ，进行指定项目的自动化 包括：

- 自动化创建钱包
- 使用生成的钱包和动态 ip 代理进行登陆
- 自动化完成页面上的点击工作

## 工具准备

- visual studio code
- node 环境

## 环境准备

该脚本基于 `node` 环境，请优先安装 `node` 环境以及配套版本管理器 `nvm`

### Windows 系统安装 Node.js 和 nvm-windows

1. **安装 Node.js**：
   - 访问 Node.js 官方网站（[nodejs.org](https://nodejs.org/)）。
   - 下载适合 Windows 系统的安装包（`.msi` 文件）。
   - 双击下载的 `.msi` 文件，按照提示完成安装。
2. **安装 nvm-windows**：
   - 访问 nvm-windows 项目的 GitHub 页面（[nvm-windows on GitHub](https://github.com/coreybutler/nvm-windows)）。
   - 下载最新版本的 nvm-setup.zip。
   - 解压下载的文件，然后双击 `nvm-setup.exe`。
   - 在安装过程中，选择 Node.js 的安装路径和 nvm 的快捷方式路径。
   - 完成安装后，重启命令提示符或 PowerShell。
3. **使用 nvm**：
   - 打开命令提示符或 PowerShell。
   - 使用 `nvm version` 命令检查 nvm 是否安装成功。
   - 使用 `nvm install <version>` 安装指定版本的 Node.js。
   - 使用 `nvm use <version>` 切换到指定版本的 Node.js。

### macOS 系统安装 Node.js 和 nvm

1. **安装 Node.js**：
   - 访问 Node.js 官方网站（[nodejs.org](https://nodejs.org/)）。
   - 下载适合 macOS 系统的安装包（`.pkg` 文件）。
   - 双击下载的 `.pkg` 文件，按照提示完成安装。
2. **安装 nvm**：
   - 打开终端。
   - 使用 Homebrew 安装 nvm：`brew install nvm`。
   - 或者使用 curl 或 wget 安装 nvm：
     - 使用 curl：`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
     - 使用 wget：`wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
   - 安装脚本会引导你完成 nvm 的安装。
3. **使用 nvm**：
   - 重启终端或执行 `source ~/.zshrc`（如果你使用的是 Zsh）或 `source ~/.bash_profile`（如果你使用的是 Bash）。
   - 使用 `nvm --version` 命令检查 nvm 是否安装成功。
   - 使用 `nvm install <version>` 安装指定版本的 Node.js。
   - 使用 `nvm use <version>` 切换到指定版本的 Node.js。

### Linux 系统安装 Node.js 和 nvm

1. **安装 Node.js**：
   - 根据你的 Linux 发行版，使用包管理器安装 Node.js。例如，在 Ubuntu 上，你可以使用以下命令：
     ```bash
     sudo apt update
     sudo apt install nodejs
     ```
   - 使用 `node --version` 和 `npm --version` 命令检查安装的 Node.js 和 npm 版本。
2. **安装 nvm**：
   - 打开终端。
   - 使用 curl 或 wget 安装 nvm：
     - 使用 curl：`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
     - 使用 wget：`wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
   - 安装脚本会引导你完成 nvm 的安装。
3. **使用 nvm**：
   - 重启终端或执行 `source ~/.zshrc`（如果你使用的是 Zsh）或 `source ~/.bashrc`（如果你使用的是 Bash）。
   - 使用 `nvm --version` 命令检查 nvm 是否安装成功。
   - 使用 `nvm install <version>` 安装指定版本的 Node.js。
   - 使用 `nvm use <version>` 切换到指定版本的 Node.js。
     请根据你的具体需求和环境调整上述指南。在撰写文档时，确保提供详细的步骤和截图，以便用户更容易跟随指导进行安装。

## 安装依赖/启动

```bash
# Windows, macOS, Linux - 安装 Node.js 16.x
nvm install 16
nvm use 16
# Windows, macOS, Linux - 全局安装 pnpm
npm install -g pnpm
# Windows, macOS, Linux - 切换到项目目录
cd path/to/your/project
# Windows, macOS, Linux - 安装项目依赖
pnpm install
# Windows, macOS, Linux - 执行项目脚本
# 假设你的 package.json 中定义了一个名为 "start" 的脚本
pnpm run script
```

## 关于项目

这里只对比较关键的内容做列举

### utils/Layer3Claimer.ts

该文件实现了 Layer3Claimer 类，该类用于处理 linea park 自动化获取积分的完整操作。
不通的函数包含不同的操作，其中比较关键的函数为：

- start 启动流程
- autoLogin 自动登录
- completeWork 完成领取积分操作

自行根据需要调用封装的 clickButton 或者 clickContinueButton 完成定制操作即可。

### utils/evmWallet.ts

该文件实现了 evmWallet 类，该类用于处理 evm 钱包的创建和操作。
