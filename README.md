# Show archived sessions

Adds one preference row to **Settings > General** that controls whether archived sessions appear in the sidebar workspace list.

- **On** — archived sessions are listed, the same as View options → All conversations (show archived). Archived rows stay grayed and cannot be opened until restored.
- **Off** — archived sessions are hidden, the same as View options → Hide archived. This also turns off the sidebar’s “filter archived sessions” action offered after archiving.

The switch applies immediately to the open sidebar and saves with the normal workspace view preference, so the choice survives reloads. It only controls visibility: it does not unarchive, delete, or otherwise change any session. The row also reports the current sidebar state and the number of archived sessions.

## Where it appears

Settings → General → **Show archived sessions**.

When the sidebar workspace list is not composed, the switch is disabled and explains why.

## Install on another computer

The bundle has no build step and no runtime npm dependencies. Transfer the whole package directory (the folder containing `package.json`) and install it from DSH:

1. Copy the directory to the other computer, or clone the repository there:
   ```sh
   git clone https://github.com/surkaa/dsh-archive-viewer.git dsh-archive-viewer
   ```
2. In DSH open **Settings → Plugins → Add plugin**.
3. Paste the absolute path of the copied directory (for example `C:\Users\you\Code\dsh-archive-viewer`) or the repository URL, then confirm.
4. If the bundle is added disabled, enable it. Refresh the page; restart DSH if the plugin manager asks for a restart.
5. Open **Settings → General → Show archived sessions**.

Keep the package directory where you installed it. A local-directory install links the profile to that folder, so moving or deleting the folder disables the plugin until you reinstall it from the new path.

## Compatibility

The switch drives the same workspace-view store (persisted as `dsh.workspace.view.*`) that the shipped `@deepseek-ai/dsh-client-ui-workspace` plugin registers on its `sidebar.workspaces` slot. It was built and verified against DSH `0.2.2-rc.3`. If a future release stops exposing the live store instance there, the row detects the changed shape, disables itself, and logs `archive visibility: …` in the page console instead of writing to a detached copy. Re-check the binding after a DSH upgrade.

Only English and Simplified Chinese copy are bundled; other languages fall back to English through the Client locale chain.

## 中文

在 **设置 > 通用** 中增加一个“显示已归档会话”开关，控制侧栏工作区列表是否显示已归档会话。

- 开启：侧栏显示已归档会话，等同于视图选项中的“全部对话（显示已归档）”。
- 关闭：侧栏隐藏已归档会话，等同于“隐藏已归档”，同时关闭归档后提示里的“筛选已归档会话”入口。

切换会立即作用于当前侧栏，并随工作区视图偏好保存，刷新后仍然有效。该开关只控制显示，不会取消归档、删除或更改任何会话。该行会显示侧栏当前状态和已归档会话数量。

设置入口：**设置 > 通用 > 显示已归档会话**。若侧栏工作区列表不可用，开关会被禁用并说明原因。

## 在另一台电脑上安装

插件没有构建步骤，也没有运行时 npm 依赖。把整个包目录（包含 `package.json` 的文件夹）复制到另一台电脑，然后在 DSH 中安装：

1. 复制目录，或直接克隆仓库：
   ```sh
   git clone https://github.com/surkaa/dsh-archive-viewer.git dsh-archive-viewer
   ```
2. 在 DSH 打开 **设置 → 插件 → 添加插件**。
3. 粘贴复制后目录的绝对路径（例如 `C:\Users\you\Code\dsh-archive-viewer`）或仓库地址，确认安装。
4. 若插件以停用状态加入，请启用它；刷新页面，若插件管理器提示需要重启则重启 DSH。
5. 打开 **设置 > 通用 > 显示已归档会话**。

请把包目录保留在安装时的位置。本地目录安装会把 profile 链接到该文件夹，移动或删除文件夹会让插件失效，需要从新路径重新安装。

兼容性：开关直接驱动 DSH 自带 `@deepseek-ai/dsh-client-ui-workspace` 注册在 `sidebar.workspaces` 插槽上的工作区视图存储（持久化键 `dsh.workspace.view.*`），基于 DSH `0.2.2-rc.3` 验证。若目标电脑的 DSH 版本不同，请先在“设置 > 通用”查看当前版本；若未来版本不再在该插槽暴露实时存储实例，该行会识别变化并禁用自身，同时在页面控制台记录 `archive visibility: …`，不会写入脱离侧栏的副本。升级 DSH 后请重新验证。