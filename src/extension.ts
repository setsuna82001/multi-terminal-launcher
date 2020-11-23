/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import Config from "./config";

interface ICommand {
  name: string;
  script: string;
  main?: boolean;
  cwd?: string;
}

export interface ITerminalConfig {
  label: string;
  commands: ICommand[];
}

enum NoFileOptions {
  CREATE_FILE = "Create file",
  NO_THANKS = " No thanks"
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "multi-terminal-launcher" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "multiTerminalLauncher.runTerminals",
    () => runTerminals()
  );

  function runTerminals() {
    // The code you place here will be executed every time your command is executed
    const folderPath = vscode.workspace.rootPath;

    if (folderPath) {
      const filePath = path.join(folderPath, ".vscode", "multi-terminals.json");

      //get config file
      Config.getFromFile(filePath)
        .then((config: ITerminalConfig[]) => {
          try {
            let options: vscode.QuickPickOptions = {
              matchOnDescription: false,
              placeHolder: "Launch terminals in: " + folderPath
            };

            // if only one option available don't create dropdown
            if (config.length === 1) {
              runSetup(config[0]);
            } else {
              // create dropdown to select config
              Promise.resolve(
                vscode.window.showQuickPick(config, options)
              ).then((setupConf?: ITerminalConfig) => {
                if (setupConf) {
                  runSetup(setupConf);
                }
              });
            }

            // TODO: if options are empty open the file to edit
          } catch (err) {
            console.error(err.toString());
          }
        })
        .catch(() => {
          vscode.window
            .showErrorMessage(
              "Missing multi-terminals.json config file",
              ...Object.values(NoFileOptions)
            )
            .then(selection => {
              if (selection === NoFileOptions.CREATE_FILE) {
                Config.createFile(filePath);
              }
            });
        });
    }
  }

  function runSetup(terminalConf: ITerminalConfig) {
    // Display a message box to the user
    vscode.window.showInformationMessage(
      `Launching terminals for ${terminalConf.label}`
    );

    for (const command of terminalConf.commands) {
      const folderPath = vscode.workspace.rootPath;
      const { name: terminalName, cwd } = command;
      const path = cwd ? `${folderPath}\\${cwd}` : undefined;

      const existTerminal = vscode.window.terminals.find(
        terminal => terminal.name === terminalName
      );

      if (existTerminal) {
        existTerminal.dispose();
      }

      const terminal = vscode.window.createTerminal({
        name: terminalName,
        cwd: path
      });
      terminal.sendText(command.script);

      if (command.main) {
        terminal.show();
      }
    }
  }

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log("deactivate");
}
