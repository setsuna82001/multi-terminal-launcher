"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const config_1 = require("./config");
var NoFileOptions;
(function (NoFileOptions) {
    NoFileOptions["CREATE_FILE"] = "Create file";
    NoFileOptions["NO_THANKS"] = " No thanks";
})(NoFileOptions || (NoFileOptions = {}));
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "multi-terminal-launcher" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("multiTerminalLauncher.runTerminals", () => runTerminals());
    function runTerminals() {
        // The code you place here will be executed every time your command is executed
        const folderPath = vscode.workspace.rootPath;
        if (folderPath) {
            const filePath = path.join(folderPath, ".vscode", "multi-terminals.json");
            //get config file
            config_1.default.getFile(filePath)
                .then((config) => {
                try {
                    let options = {
                        matchOnDescription: false,
                        placeHolder: "Launch terminals in: " + folderPath,
                    };
                    // if only one option available don't create dropdown
                    if (config.length === 1) {
                        runTerminal(config[0]);
                    }
                    else {
                        // create dropdown to select config
                        Promise.resolve(vscode.window.showQuickPick(config, options)).then((terminalConf) => {
                            if (terminalConf) {
                                runTerminal(terminalConf);
                            }
                        });
                    }
                    // TODO: if options are empty open the file to edit
                }
                catch (err) {
                    console.error(err.toString());
                }
            })
                .catch(() => {
                vscode.window
                    .showErrorMessage("Missing multi-terminals.json config file", ...Object.values(NoFileOptions))
                    .then((selection) => {
                    if (selection === NoFileOptions.CREATE_FILE) {
                        config_1.default.createFile(filePath);
                    }
                });
            });
        }
    }
    function runTerminal(terminalConf) {
        // Display a message box to the user
        vscode.window.showInformationMessage(`Launching terminals for ${terminalConf.label}`);
        for (const command of terminalConf.commands) {
            const folderPath = vscode.workspace.rootPath;
            const { name: terminalName, cwd } = command;
            const path = cwd ? `${folderPath}\\${cwd}` : undefined;
            const existTerminal = vscode.window.terminals.find((terminal) => terminal.name === terminalName);
            if (existTerminal) {
                existTerminal.dispose();
            }
            const terminal = vscode.window.createTerminal({
                name: terminalName,
                cwd: path,
            });
            terminal.sendText(command.script);
            if (command.main) {
                terminal.show();
            }
        }
    }
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    console.log("deactivate");
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map