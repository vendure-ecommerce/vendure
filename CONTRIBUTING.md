# Contribution Guidelines

Hi! Thank you for taking the time to contribute to Vendure!

In order to make the best use of both your time and that of the Vendure maintainers, please follow the guidelines in this document.

## Table of Contents

- [Branches](#branches)
- [Bug fixes](#bug-fixes)
- [New features](#new-features)
- [Commit message format](#commit-message-format)
- [Setting up the dev environment](#setting-up-the-dev-environment)
- [Suggested contribution workflow](#suggested-contribution-workflow)
- [Contributing to the documentation](#contributing-to-the-documentation)
- [Contributing to the Admin UI translations](#contributing-to-the-admin-ui-translations)
- [Where to get help](#where-to-get-help)
- [Contributor License Agreement](#contributor-license-agreement)
- [Issue Triage Guidelines](#issue-triage-guidelines)

## Branches

There are 3 important branches to know about:

* `master` - the default branch
* `minor` - a branch for commits which introduce new features which would go in the next [SemVer minor](https://semver.org/) release.
* `major` - a branch for commits which introduce breaking changes which would go in the next [SemVer major](https://semver.org/) release.

Bug fixes should go directly to the `master` branch, from which new patch releases will be made regularly. Periodically, the master branch will be merged into the `minor` and `major` branches.

## Bug fixes

If you would like to contribute a bug fix, please first create an issue detailing the bug, and indicate that you intend to fix it. When creating commits, please follow the commit message format below.

## New features

Similarly, please create a feature request issue detailing the functionality you intend to add, and state that you would like to implement it. When creating commits, please follow the commit message format below. Submit new feature pull requests to the `minor` branch.

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

After [cloning the Vendure repo](#cloning-locally), please refer to the [Development guide](https://github.com/vendure-ecommerce/vendure/blob/master/README.md#development) in the README for instructions on setting up your local development environment.

## Suggested contribution workflow

### Creating a fork:

Start by creating a fork of the repository. This can be done by navigating to our [repository](https://github.com/vendure-ecommerce/vendure) and clicking on the fork button. This creates your own copy under your GitHub account. We recommend keeping "vendure" as the name of the fork.

### Cloning locally: 
Run the following commands to create a local clone of the repository files, where you can safely develop and test out your changes:

```bash
git clone https://github.com/YOUR-USERNAME/vendure.git
cd vendure
```

Add the [Vendure repository](https://github.com/vendure-ecommerce/vendure) as the upstream remote to your clone:

```bash
git remote add upstream https://github.com/vendure-ecommerce/vendure.git
```

This lets you pull updates from the original repository directly to your local clone.

### Staying up to date
> [!TIP]
> It is a good idea to regularly update your local and forked repositories. This keeps your development environment synchronised and minimizes potential merge conflicts when contributing.
>
> Here is [GitHub's official guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) on keeping your forks synced.

There are **three main ways** to keep your fork synchronized:

#### Option 1: Using GitHub's Web Interface

Navigate to your fork's GitHub page and click the `Sync fork` button.

#### Option 2: Using GitHub CLI

GitHub offers a handy open-source CLI tool - [GitHub CLI](https://cli.github.com/) - which allows you to sync your branch directly in your terminal:

```bash
gh repo sync
```

#### Option 3: Using Git Commands

If you prefer using `git` commands, which can be more robust in some circumstances:

**First, fetch the latest changes:**
```bash
git fetch upstream
git checkout master
```

Now you're on the master branch of your local repository, and Git "knows" whether there are differences between your master branch and the upstream branch.

**Then, update your local and forked remote repositories:**
```bash
git merge upstream/master
git push origin master
```
--- 

### Create a new branch

This is where you can start implementing your changes:

```bash
git checkout -b your-new-branch
```

### Developing

Follow our [development guide](https://github.com/vendure-ecommerce/vendure#development) to make sure you have a properly set up development environment.

After implementing your changes, stage the changes and commit them. Refer to the [Commit message format](#commit-message-format)
```
git add .
git commit -m "type(scope): Message in present tense"
```

### Creating a pull request

> [!TIP]
> Now would be a good time to [update](#staying-up-to-date) your local and remote repositories.

#### Prepare Your Branch

Make sure you have your new branch checked out and merge the latest changes from your up-to-date master branch:

```bash
git checkout your-new-branch
git merge master
```

#### Push Your Changes

Push your updated branch to your forked repository:

```bash
git push origin your-new-branch
```

#### Create Your Pull Request

**You can now create a pull request!** Choose one of the following methods:

**Option A: Using GitHub CLI**

If you have the [GitHub CLI](https://cli.github.com/) installed, run:
```bash
gh pr create
```
and follow the prompts - this will automatically use our [pull request template](https://github.com/vendure-ecommerce/vendure/blob/master/.github/pull_request_template.md).

**Option B: Using GitHub Web Interface**

Navigate to your forked repository on GitHub and create a pull request from there using the web interface.

**Well done!** Now comes our part: we will review your pull request and either merge it or provide you with feedback on what we would like to see changed.

--- 

## Contributing to the documentation

For our [documentation](https://docs.vendure.io/), we use [Docusaurus](https://docusaurus.io/).

After [setting up your development environment](#setting-up-the-dev-environment), navigate to the docs directory and start the docusaurus server:
```bash
cd docs
npm run start
```

this will output a URL where you can preview your changes.

You can find all of our documentation built by docusaurus in these directories: 

```
docs/docs
├── guides
├── reference // only contains generated documentation
└── user-guide
```

> [!NOTE]
> Files in the [reference](https://docs.vendure.io/reference/) directory are auto-generated. To edit reference documentation, modify the [JSDoc](https://jsdoc.app/about-getting-started) comments in the source code and run `npm run docs:build` from the project root directory.

## Contributing to the Admin UI translations

If you wish to contribute translations of the Admin UI into another language (or improve an existing set of translations), please see the [Localization guide](https://github.com/vendure-ecommerce/vendure/blob/master/packages/admin-ui/README.md#localization) in the admin-ui package.

## Where to get help

We have an active discord community, join us there and ask away!
[Vendure Discord](https://www.vendure.io/community) 

Read the documentation - Our comprehensive [documentation](https://docs.vendure.io/) covers everything you need to know about Vendure. It also includes guides and references for the tools that we use.

In case your pull request doesn't meet our requirements, we're here to help! We'll provide thorough reviews with clear guidance on how to get your contribution merged.
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
