# vsc-wslpath-copy

VS Code / Cursor extension that adds a **"Copy Path as URI"** context menu entry.

When connected to a **WSL remote**, the copied URI uses the `file://wsl.localhost/…` format so it can be opened directly from Windows browsers and other tools:

```
file://wsl.localhost/Ubuntu/home/dikka/projs/presentations-website/.dev/presentations/project-status-presentation.html
```

For local (non-remote) files, a standard `file://` URI is produced.

## Usage

Right-click a file in the **Explorer** or an **editor tab** → **Copy Path as URI**.

The URI is written to your clipboard.

## Install from source

```bash
npm install
npm run compile
# then either:
npx vsce package   # produces a .vsix you can install
# or press F5 in VS Code to launch the Extension Development Host
```

## How it works

| Context | Example URI |
|---|---|
| WSL remote (Ubuntu) | `file://wsl.localhost/Ubuntu/home/user/file.txt` |
| Local Linux / macOS | `file:///home/user/file.txt` |
| Local Windows | `file:///C:/Users/user/file.txt` |
