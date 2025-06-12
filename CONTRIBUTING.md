# Contribution Guidelines

Hi! Thank you for taking the time to contribute to Vendure!

In order to make the best use of both your time and that of the Vendure maintainers, please follow the guidelines in this document.

## Table of Contents

- [Branches](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#branches)
- [Suggested Contribution Workflow](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#suggested-contribution-workflow)
- [Setting up the dev environment](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#setting-up-the-dev-environment) 
- [Bug fixes](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#bug-fixes) 
- [New features](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#new-features) 
- [Commit message format](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#commit-message-format) 
- [Contributing to the Admin UI translations](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#contributing-to-the-admin-ui-translations) 
- [Contributor License Agreement](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#contributor-license-agreement) 
- [Issue Triage Guidelines](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#issue-triage-guidelines) 

## Branches

There are 3 important branches to know about:

* `master` - the default branch
* `minor` - a branch for commits which introduce new features which would go in the next [SemVer minor](https://semver.org/) release.
* `major` - a branch for commits which introduce breaking changes which would go in the next [SemVer major](https://semver.org/) release.

Bug fixes should go directly to the `master` branch, from which new patch releases will be made regularly. Periodically, the master branch will be merged into the `minor` and `major` branches.

## Suggested Contribution Workflow

### Creating a fork:

Start by creating a fork of the repository. This can be done by navigating to our [repository](https://github.com/vendure-ecommerce/vendure) and clicking on the fork button. This creates your own copy under your GitHub account.

### Cloning locally: 
Run the following commands to create a local clone of the repository files, where you can safely develop and test out your changes:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-VENDURE-FORK.git
cd YOUR-VENDURE-FORK
```

Add the [Vendure repository](https://github.com/vendure-ecommerce/vendure) as an upstream remote to your clone:

```bash
git remote add upstream https://github.com/vendure-ecommerce/vendure
```

This lets you pull updates from the original repository directly to your local clone.

### Staying up to date
> [!TIP]
> It is a good idea to regularly update your local and forked repositories. You can do so by running the following commands:
> ```bash
> git fetch upstream
> git checkout master
> ```
> Now you're on the master branch of your local repository, and git "knows" whether there are differences between your master branch and the upstream branch.
>
> to update your local and forked remote repositories: 
> ```bash
> git merge upstream/master
> git push origin master
> ```

### Create a new branch:

Start implementing your changes inside this branch. Make as many relevant commits as you need, but follow our [Commit message format](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#commit-message-format).

```bash
git checkout -b your-new-branch
```

### Developing

Follow our [development guide](https://github.com/vendure-ecommerce/vendure#development) to make sure have a properly set up development environment.

After implementing your changes, stage the changes and commit them. Refer to the [Commit message format](https://github.com/copilot/c/a9e1ab36-d5f1-417f-a71f-f2ddeb3b37dd#commit-message-format)
```
git add .
git commit -m type(scope): Message in present tense
```

### Creating a pull request

> [!TIP]
> Now would be a good time to [update](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#staying-up-to-date) your local and remote repositories.

Make sure you have your new branch checked out and rebase it onto your up-to-date master branch:
```bash
git checkout your-new-branch
git rebase master
```
Now push your changes to your forked repository:
```bash
git push origin your-new-branch
```

You can now create a pull request. If you prefer using the [GitHub CLI](https://cli.github.com/), run the following command:
```bash
gh pr create
```
and follow the prompts, this will automatically use our [pull request template](https://github.com/vendure-ecommerce/vendure/blob/master/.github/pull_request_template.md).

Alternatively, navigate to your forked repository on GitHub and create a pull request from there.

Well done! now comes our part, we will review your pull request and either merge it or provide you with feedback on what we would like to see changed.

## Bug fixes

If you would like to contribute a bug fix, please first create an issue detailing the bug, and indicate that you intend to fix it. When creating commits, please follow the commit message format below.

## New features

Similarly, please create a feature request detailing the functionality you intend to add, and state that you would like to implement it. When creating commits, please follow the commit message format below. Submit new feature pull requests to the `minor` branch.

When adding new public APIs to support your new feature, add a `@since 1.2.0` tag (where "1.2.0" corresponds to what will be the next minor version) to the doc block. This will let readers of the documentation know the version in which the API was introduced. See the [docs readme](./docs/README.md) for more details on the valid docs tags.

```TypeScript
/**
 * @description
 * Sets the value of the new API thing.
 *
 * @since 1.2.0
 */
myNewApi: number;
```

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

Please also make your pull request against the `major` branch rather than `master` in the case of breaking changes.

Example:

```
feat(core): Add new field to Customer

Relates to #123. This commit adds the "foo" field to the Custom entity.

BREAKING CHANGE: A DB migration will be required in order to add the new "foo" field to the customer table.
```

#### Linting

Commit messages are linted on commit, so you'll know if your message is not quite right.

## Setting up the dev environment

After [cloning the Vendure repo](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md#cloning-locally), please refer to the [Development guide](https://github.com/vendure-ecommerce/vendure/blob/master/README.md#development) in the README for instructions on setting up your local development environment.

## Contributing to the documentation

For our [documentation](https://docs.vendure.io/), we use [Docusaurus](https://docusaurus.io/).

after cloning our repository according to the [Suggested Contribution Workflow](url) 

## Contributing to the Admin UI translations

If you wish to contribute translations of the Admin UI into another language (or improve an existing set of translations), please see the [Localization guide](https://github.com/vendure-ecommerce/vendure/blob/master/packages/admin-ui/README.md#localization) in the admin-ui package.

## Contributor License Agreement

All contributors are required to agree to the [Contributor License Agreement](./license/CLA.md) before their contributions can be merged.

This is done via an automation bot which will prompt you to sign the CLA when you open a pull request.

## Issue Triage Guidelines

This section is meant for maintainers to help triage issues.

### Quality Control

- [ ] Does the issue have a **clear title and description**?
- [ ] Was the **issue template followed** and is all required info available?
- [ ] If it's a **bug report**, are there **clear steps to reproduce**?

If any of the above are missing:
- Add a relevant **blue label** (e.g., `needs reproduction`, `missing info`)
- Comment to ask the reporter to supply the missing information

### Check for Duplicates

Search to see if the issue is already reported or resolved. If it is a duplicate, close the issue with a message like `Duplicate of #123`.

### Label the Issue
- [ ] Set an **Issue Type**: `bug`, `feature` or `task`
- [ ] **Package**: label with relevant package/component
- [ ] Assign a **Priority Label** if possible

### Stale Issues

Issues that need more information should be closed after 1 month of inactivity.
