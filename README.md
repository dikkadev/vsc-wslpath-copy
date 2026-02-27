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

## Publish to both VS Code and Cursor

If you want this extension discoverable in both editors:

- Publish to the **VS Code Marketplace** (for VS Code users)
- Publish to **OpenVSX** (for Cursor users)

Cursor staff states that Cursor's in-app extension library uses OpenVSX, and that extensions must be available there to be installable/searchable in Cursor:

- https://forum.cursor.com/t/extension-marketplace-changes-transition-to-openvsx/109138/1
- https://forum.cursor.com/t/adding-extensions-to-cursor/132598/2

### CI release flow in this repo

On pushes to `main`, `.github/workflows/release.yml` now:

1. Builds and packages a `.vsix`
2. Publishes the package to VS Code Marketplace (if `VSCE_PAT` is set)
3. Publishes the same package to OpenVSX (if `OVSX_PAT` is set)
4. Creates a GitHub release and uploads the `.vsix`

### Required GitHub secrets

- `VSCE_PAT` for VS Code Marketplace publishing  
  Reference: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- `OVSX_PAT` for OpenVSX publishing  
  Reference: https://github.com/eclipse/openvsx/wiki/Publishing-Extensions

## How it works

| Context | Example URI |
|---|---|
| WSL remote (Ubuntu) | `file://wsl.localhost/Ubuntu/home/user/file.txt` |
| Local Linux / macOS | `file:///home/user/file.txt` |
| Local Windows | `file:///C:/Users/user/file.txt` |
