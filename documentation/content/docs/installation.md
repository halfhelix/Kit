---
description: ''
sidebar: 'docs'
prev: '/docs'
next: '/docs'
---

# Installation

This package is designed to be installed globally on your local computer. However, you should be able to install it locally as a project dependency too (for example, we do this when running CI/CD builds so we can cache the package in a relative folder between jobs).

In most instances you can get going by simply installing the package globally via the commands below. However, see the bottom section on some issues we've encountered in the past when going through the installation process.

## Using NPM

You can simply run:

```bash
npm i -g @halfhelix/kit
```

After that run `kit --version` to verify that the tool is working.

## Using Yarn

If you would prefer to use Yarn, you can run:

```bash
yarn global add @halfhelix/kit
```

After that run `kit --version` to verify that the tool is working.

## Spinning up a theme and getting going

This command is really simple, it adds default theme files into the current folder so that you can get going quickly and understand the framework within the context of a Shopify theme. After running this command, you should be able to get going after running `yarn` and creating an `.env` file based on the `.env.example` file.

> This command was added in `v2.0.0`

```bash
kit scaffold
```
