# Contribution Guidelines

Hi! Thank you for taking the time to contribute to Vendure!

In order to make the best use of both your time and that of the Vendure maintainers, please follow the guidelines in this document.

## Bug fixes

If you would like to contribute a bugfix, please first create an issue detailing the bug, and indicate that you intend to fix it. When creating commits, please follow the commit message format below.

## New features

Again, please create a feature request detailing the functionality you intend to add, and state that you would like to implement it. When creating commits, please follow the commit message format below.

## Commit message format

This repo uses [Conventional Commits](https://www.conventionalcommits.org).

```
type(scope): Message in present tense
```
`type` may be one of:
* **feat** (new feature)
* **fix** (bug fix)
* **docs** (changes to documentation)
* **perf** (performance improvements)
* **style** (formatting, missing semi colons, etc; no code change)
* **refactor** (refactoring production code)
* **test** (adding missing tests, refactoring tests; no production code change)
* **chore** (updating build tasks etc; no production code change)

`scope` indicates the package affected by the commit:

* admin-ui
* admin-ui-plugin
* asset-server-plugin
* common
* core
* create
* email-plugin
* etc.

If a commit affects more than one package, separate them with a comma:

```
fix(core,common): Fix the thing
```

If a commit applies to no particular package (e.g. a tooling change in the root package.json), the scope can be omitted.

#### Breaking Changes

If your contribution includes any breaking changes (including any changes to the DB schema; backwards-incompatible changes to the GraphQL APIs or VendureConfig; backwards-incompatible changes to current behavior), please include a `BREAKING CHANGE` section in your commit message as per the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/#commit-message-with-both-and-breaking-change-footer).

Please also make your pull request against the `next` branch rather than `master` in the case of breaking changes.

Example:

```
feat(core): Add new field to Customer

Relates to #123. This commit adds the "foo" field to the Custom entity.

BREAKING CHANGE: A DB migration will be required in order to add the new "foo" field to the customer table.
```

#### Linting

Commit messages are linted on commit, so you'll know if your message is not quite right.

## Setting up the dev environment

After cloning the Vendure repo, please follow the [Development guide](https://github.com/vendure-ecommerce/vendure/blob/master/README.md#development) in the README for instructions on how to get up and running locally.

## Contributing Admin UI translations

If you wish to contribute translations of the Admin UI into another language (or improve an existing set of translations), please see the [Localization guide](https://github.com/vendure-ecommerce/vendure/blob/master/packages/admin-ui/README.md#localization) in the admin-ui package.
