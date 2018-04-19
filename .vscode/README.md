# Sphinx vs code style config

* add to project

  `git submodule add git@github.com:BeliefChainOrg/editor-config.git .vscode`

  or use https protocol

  `git submodule add https://github.com:BeliefChainOrg/editor-config.git .vscode`

* if forgot clone with `--recursive`, follow blow command:

  `git submodule init`

  `git submodule update`

* update submodule to latest commit

  `git submodule update --remote`

* remove submodule

  `git submodule deinit -f .vscode`

  `git rm -rf .gitmodules`

  `git rm -rf .vscode`

* required:

  * editorconfig for vscode

  * vscode eslint plugin, vscode prettier plugin, vscode solidity plugin

  * package.json devDependencies

    ```
    "standard": "^10.0.3",
    "eslint": "^4.10.0",
    "eslint-config-standard": "^10.2.1",
    "eslint-plugin-import": "^2.8.0",
    "eslint-plugin-node": "^5.2.1",
    "eslint-plugin-standard": "^3.0.1"
    "eslint-plugin-react": "^7.5.1"
    "eslint-plugin-promise": "^3.6.0"
    ```

* more ...
