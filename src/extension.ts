import * as vscode from "vscode";

/**
 * Build a `file://` URI string for the given resource.
 *
 * - **WSL remote** → `file://wsl.localhost/<distro>/home/…`
 * - **Local / other** → `file:///absolute/path`
 */
function buildFileUri(resource: vscode.Uri): string {
  // When connected to a WSL remote the URI authority looks like "wsl+Ubuntu"
  // (or "wsl+Debian", etc.). env.remoteName is "wsl".
  const authority = resource.authority; // e.g. "wsl+Ubuntu"
  const hasWslAuthority = /^wsl\+/i.test(authority);
  const isWsl =
    vscode.env.remoteName === "wsl" ||
    hasWslAuthority;

  if (isWsl) {
    // Extract distro name from the authority ("wsl+Ubuntu" → "Ubuntu").
    // Fall back to the full authority if the format is unexpected.
    const distro = hasWslAuthority
      ? authority.slice(4)
      : authority || "Ubuntu";

    // Build a URI object (instead of string concat) so special chars in paths
    // are encoded correctly (spaces, "#", "?", etc.).
    const remotePath = resource.path.startsWith("/")
      ? resource.path
      : `/${resource.path}`;
    return vscode.Uri.from({
      scheme: "file",
      authority: "wsl.localhost",
      path: `/${distro}${remotePath}`,
    }).toString();
  }

  // Non-WSL: produce a standard file URI with correct escaping.
  return vscode.Uri.from({
    scheme: "file",
    authority: "",
    path: resource.path,
  }).toString();
}

/**
 * Resolve the target URI from the arguments VS Code passes to a context-menu
 * command. The resource may come from:
 *   1. The explorer context menu  → first argument is the Uri
 *   2. The editor tab context menu → first argument is the Uri
 *   3. The command palette (no args) → fall back to the active editor
 */
function resolveUri(args: unknown[]): vscode.Uri | undefined {
  if (args.length > 0 && args[0] instanceof vscode.Uri) {
    return args[0];
  }
  return vscode.window.activeTextEditor?.document.uri;
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "wslpathCopy.copyFileUri",
    async (...args: unknown[]) => {
      const uri = resolveUri(args);
      if (!uri) {
        vscode.window.showWarningMessage("No file selected.");
        return;
      }

      const fileUri = buildFileUri(uri);
      await vscode.env.clipboard.writeText(fileUri);
      vscode.window.showInformationMessage(`Copied: ${fileUri}`);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
