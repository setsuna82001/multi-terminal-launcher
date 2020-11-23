import * as vscode from "vscode";
import * as fs from "fs";
import configTemplate from "./configTemplate";
import { ITerminalConfig } from "./extension";

// get config
// edit config

export default class Config {
  public static getFromFile(path: string) {
    return new Promise<ITerminalConfig[]>((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data.toString()));
        }
      });
    });
  }

  public static createFile(path: string) {
    fs.writeFile(path, JSON.stringify(configTemplate, null, "\t"), error => {
      if (error) {
        vscode.window.showErrorMessage(
          "Can not launch multi terminals. Missing multi-terminals.json config file and can't create one"
        );

        console.error(error);
        throw error;
      }

      vscode.workspace.openTextDocument(path).then(document => {
        vscode.window.showTextDocument(document);
      });
    });
  }
}
