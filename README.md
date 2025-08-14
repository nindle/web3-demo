# Web3 Demo - 钱包连接应用

<div align="center">

  [![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)](https://nindle.github.io/web3-demo)
  [![Vue](https://img.shields.io/badge/Vue-3.5.12-4FC08D)](https://vuejs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-3178C6)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

  <img src="public/reown.svg" alt="Web3 Demo" width="120" height="120" />
  <h3>基于 Reown AppKit 的 Web3 钱包连接示例</h3>
  <p>
    <a href="https://nindle.github.io/web3-demo">🌐 在线演示</a> •
    <a href="#快速开始">🚀 快速开始</a> •
    <a href="#功能特性">✨ 功能特性</a>
  </p>
</div>

## 📋 项目简介

这是一个使用 Vue 3 + Vite + TypeScript 构建的 Web3 钱包连接示例应用。通过 Reown AppKit（原 WalletConnect）实现了与各种 Web3 钱包的连接功能，为 DApp 开发提供参考实现。

## ✨ 功能特性

- 🔗 **多钱包支持** - 支持 MetaMask、WalletConnect 等主流钱包
- 🎨 **现代化 UI** - 简洁美观的用户界面
- 🚀 **快速响应** - 基于 Vite 的极速开发体验
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🔧 **TypeScript** - 完整的类型支持
- 🌐 **自动部署** - GitHub Actions 自动部署到 GitHub Pages

## 🛠️ 技术栈

- **框架**: Vue 3.5.12
- **构建工具**: Vite 6.2.0
- **语言**: TypeScript 5.6.0
- **Web3 集成**:
  - @reown/appkit 1.7.17
  - ethers.js 6.13.4
- **包管理器**: pnpm

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/nindle/web3-demo.git
   cd web3-demo
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置项目**
   - 前往 [Reown Cloud](https://cloud.reown.com) 创建新项目
   - 复制你的 `Project ID`
   - 在 `src/App.vue` 中替换 `projectId` 的值（或创建 `.env` 文件）

4. **启动开发服务器**
   ```bash
   pnpm run dev
   ```

5. **构建生产版本**
   ```bash
   pnpm run build
   ```

## 📁 项目结构

```
web3-demo/
├── .github/workflows/    # GitHub Actions 配置
├── public/              # 静态资源
├── src/
│   ├── assets/         # 样式文件
│   ├── components/     # Vue 组件
│   │   ├── ActionButton.vue
│   │   └── InfoList.vue
│   ├── config/         # 配置文件
│   ├── App.vue         # 主应用组件
│   └── main.ts         # 应用入口
├── vite.config.ts      # Vite 配置
└── package.json        # 项目配置
```

## 🚢 部署

项目已配置 GitHub Actions 自动部署。每次推送到 `main` 分支时，会自动构建并部署到 GitHub Pages。

### 手动部署

```bash
pnpm run deploy
```

### 访问地址

部署成功后，可通过以下地址访问：
```
https://nindle.github.io/web3-demo/
```

## 📝 开发指南

### 可用脚本

- `pnpm run dev` - 启动开发服务器
- `pnpm run build` - 构建生产版本
- `pnpm run preview` - 预览生产构建
- `pnpm run type-check` - TypeScript 类型检查
- `pnpm run deploy` - 手动部署到 GitHub Pages

### 自定义配置

1. **修改钱包配置**：编辑 `src/config/index.ts`
2. **修改主题**：在 `src/App.vue` 中调整 `themeVariables`
3. **添加网络**：在配置文件中添加更多区块链网络

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关资源

- [Reown 文档](https://docs.reown.com)
- [Vite 文档](https://vitejs.dev/guide/)
- [Vue 3 文档](https://vuejs.org/guide/introduction)
- [ethers.js 文档](https://docs.ethers.org/v6/)

---

<div align="center">
  <p>使用 ❤️ 构建</p>
  <p>
    <a href="https://github.com/你的用户名/web3-demo/issues">反馈问题</a> •
    <a href="https://github.com/你的用户名/web3-demo">查看源码</a>
  </p>
</div>
