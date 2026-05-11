# NewsNow MCP Server 连接 MCPHub 故障排查记录

## 问题现象

MCPHub 启动 `newsnow` 服务器时超时：

```
McpError: MCP error -32001: Request timed out (timeout: 60000ms)
```

## 根因链

### 问题 1：npm install 下载依赖超时

`npx -y newsnow-mcp-server` 执行时，npm 需要下载所有 runtime 依赖（`fastmcp`、`zod`、`ofetch`、`dotenv` 等），在国内网络环境下耗时 >60s，超过 MCP 初始化握手超时。

**解决：将所有依赖打包进 dist，运行时不再需要 node_modules。**

1. `tsup.config.ts` 配置 `noExternal` 内联所有依赖
2. `package.json` 的 `dependencies` 清空，运行时依赖移到 `devDependencies`
3. MCPHub 配置 `NODE_ENV=production` 跳过 devDeps 安装

### 问题 2：ESM bundle 中 Dynamic require 报错

```
Error: Dynamic require of "xxx" is not supported
```

esbuild 打包 ESM 时，对 `require()` 调用生成 `__require` shim，但 Node.js ESM 环境没有 `require`。

**解决：改用 CJS 格式打包。**

```ts
// tsup.config.ts
format: ["cjs"],
outExtension: () => ({ js: ".cjs" }),
```

CJS 格式使用原生 `require()`，不需要 shim。

### 问题 3：fastmcp 缺少 completions capability

```
Server does not support completions (required for completion/complete)
```

`fastmcp@1.27.7` 注册了 `completion/complete` 处理器但未在 capabilities 中声明 `completions`，SDK 的安全检查抛错。

**解决：修补 fastmcp，添加 completions 声明。**

```js
// node_modules/fastmcp/dist/FastMCP.js
this.#capabilities.logging = {};
this.#capabilities.completions = {};  // 新增
this.#server = new Server(...)
```

重新打包后 `dist/index.cjs` 包含此修补。

### 问题 4：GitHub API 下载慢（国内环境）

`npx github:arkylin/newsnow-mcp-server` 从 GitHub API 下载 tarball，在国内网络下很慢。

**解决：MCPHub 配置中加大超时时间。**

```json
"options": {
  "timeout": 300000,
  "resetTimeoutOnProgress": true
}
```

首次下载成功后 npx 会缓存，后续启动很快。

## 最终 MCPHub 配置

```json
{
  "mcpServers": {
    "newsnow": {
      "command": "npx",
      "args": ["-y", "github:arkylin/newsnow-mcp-server"],
      "env": {
        "BASE_URL": "https://newsnow.busiyi.world",
        "NODE_ENV": "production",
        "npm_config_package_lock": "false",
        "npm_config_cache": "/tmp/.npm"
      },
      "options": {
        "timeout": 300000,
        "resetTimeoutOnProgress": true
      }
    }
  }
}
```

## 构建流程

```bash
# 安装依赖（含构建工具）
npm install

# 打包为自包含 CJS bundle
npm run build

# 提交 dist/ 到 git（npx 从 GitHub 下载后可以直接运行）
git add dist/index.cjs
git commit -m "update bundle"
git push
```

`dist/index.cjs` 是自包含的 2.8MB 文件，内嵌了 `fastmcp`、`zod`、`ofetch`、`dotenv` 所有代码，运行时不需要 `node_modules`。
