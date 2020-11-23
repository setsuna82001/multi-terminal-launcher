"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template = [
    {
        label: "config #1",
        commands: [
            {
                name: "first terminal",
                main: true,
                script: "script to run in terminal",
                cwd: "<optional> A path or Uri for the current working directory to be used for the terminal.",
            },
            {
                name: "second terminal",
                script: "script to run in terminal",
                cwd: "<optional> A path or Uri for the current working directory to be used for the terminal.",
            },
            {
                name: "third terminal",
                script: "script to run in terminal",
                cwd: "<optional> A path or Uri for the current working directory to be used for the terminal.",
            },
        ],
    },
    {
        label: "config #2 <optional>",
        commands: [
            {
                name: "first terminal",
                main: true,
                script: "script to run in terminal",
                cwd: "<optional> A path or Uri for the current working directory to be used for the terminal.",
            },
            {
                name: "second terminal",
                script: "script to run in terminal",
                cwd: "<optional> A path or Uri for the current working directory to be used for the terminal.",
            },
            {
                name: "third terminal",
                script: "script to run in terminal",
                cwd: "<optional> A path or Uri for the current working directory to be used for the terminal.",
            },
        ],
    },
];
exports.default = template;
//# sourceMappingURL=configTemplate.js.map