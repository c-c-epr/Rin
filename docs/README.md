# Rin 文档

本文档站点使用 [Rspress](https://rspress.dev/) 构建。

## 开发

```bash
# 安装依赖
bun install

# 启动开发服务器
bun dev

# 构建
bun build

# 预览构建结果
bun preview
```

## 目录结构

```
docs/
├── docs/                 # 文档内容
│   ├── zh/              # 中文文档
│   │   ├── guide/       # 指南
│   │   │   ├── index.md # 简介
│   │   │   ├── deploy.mdx # 部署指南
│   │   │   ├── rss.md   # RSS 配置
│   │   │   ├── changelog.md # 更新日志
│   │   │   └── contribution.md # 贡献指南
│   │   ├── _meta.json   # 中文导航配置
│   │   └── env.md       # 环境变量
│   ├── en/              # 英文文档
│   │   └── ...          # 同上
│   ├── index.md         # 首页
│   └── public/          # 静态资源
├── package.json         # 依赖配置
├── rspress.config.ts    # Rspress 配置
└── tsconfig.json        # TypeScript 配置
```
