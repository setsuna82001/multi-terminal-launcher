"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const configTemplate_1 = require("./configTemplate");
// get config
// edit config
class Config {
    static getFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(JSON.parse(data.toString()));
                }
            });
        });
    }
    static createFile(path) {
        fs.writeFile(path, JSON.stringify(configTemplate_1.default, null, "\t"), error => {
            if (error) {
                vscode.window.showErrorMessage("Can not launch multi terminals. Missing multi-terminals.json config file and can't create one");
                console.error(error);
                throw error;
            }
            vscode.workspace.openTextDocument(path).then(document => {
                vscode.window.showTextDocument(document);
            });
        });
    }
}
exports.default = Config;
//# sourceMappingURL=config.js.map