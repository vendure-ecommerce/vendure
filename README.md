# Vendure

An open-source headless commerce platform built on [Node.js](https://nodejs.org) with [GraphQL](https://graphql.org/), [Nest](https://nestjs.com/) & [TypeScript](http://www.typescriptlang.org/), with a focus on developer productivity and ease of customization.

> [!IMPORTANT]
> **We're introducing our new React-based Admin Dashboard**</br>
> Check out our beta preview now: [v3.4.0 release notes](https://github.com/vendure-ecommerce/vendure/releases/tag/v3.4.0)</br>
> We're phasing out our Angular-based Admin UI with support until June 2026:
> [Read more here](https://vendure.io/blog/2025/02/vendure-react-admin-ui)

[![Build Status](https://github.com/vendure-ecommerce/vendure/actions/workflows/build_and_test.yml/badge.svg?branch=master)](https://github.com/vendure-ecommerce/vendure/actions/workflows/build_and_test.yml)
[![Publish & Install](https://github.com/vendure-ecommerce/vendure/actions/workflows/publish_and_install.yml/badge.svg?branch=master)](https://github.com/vendure-ecommerce/vendure/actions/workflows/publish_and_install.yml)
[![Lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

![vendure-github-social-banner](https://github.com/vendure-ecommerce/vendure/assets/24294584/ada25fa3-185d-45ce-896d-bece3685a829)

## [www.vendure.io](https://www.vendure.io/)

## 🚀 Getting Started

**New to Vendure?** Start here:

- **[Getting Started Guide](https://docs.vendure.io/guides/getting-started/installation/)**: Get Vendure up and running locally in minutes with a single command
- **[Public Demo](https://vendure.io/demo)**: Take a look at the Vendure Admin UI
- **[Documentation](https://docs.vendure.io/)**: Comprehensive guides, API reference, and tutorials

**Need Help?**

- **[Vendure Discord](https://www.vendure.io/community)**: Join our community for support and discussions

## 🔧 Contributing - For developers

**Want to contribute to Vendure?**

Contributions to Vendure are welcome and highly appreciated! Whether you're fixing bugs, adding features, or improving documentation, your help makes Vendure better for everyone.

**[Contribution Guidelines](./CONTRIBUTING.md)** - This is complete guide covering everything from setting up your development environment to submitting your first pull request

**Ready to get started?**

 Check out our [list of issues labeled "contributions welcome"](https://github.com/vendure-ecommerce/vendure/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22%F0%9F%91%8B%20contributions%20welcome%22) for good first issues

We're here to help if you have questions, and we're excited to see what you'll build with Vendure!

## Branches

- `master` - The latest stable release, currently the 3.x series.
- `minor` - The next minor release, including new features
- `major` - The next major release (v4.0)
- `v2.x` - The 2.x line, which will receive critical fixes until the end-of-life on 31.12.2024. The code in this branch is under the MIT license.

## Structure

This project is a monorepo managed with [Lerna](https://github.com/lerna/lerna). Several npm packages are published from this repo, which can be found in the `packages/` directory.

```plaintext
vendure/
├── docs/           # Documentation source
├── e2e-common/     # Shared config for package e2e tests
├── license/        # License information & CLA signature log
├── packages/       # Source for the Vendure server, admin-ui & core plugin packages
├── scripts/
    ├── changelog/  # Scripts used to generate the changelog based on the git history
    ├── codegen/    # Scripts used to generate TypeScript code from the GraphQL APIs
    ├── docs/       # Scripts used to generate documentation markdown from the source
```

## License

See [LICENSE.md](./LICENSE.md).
