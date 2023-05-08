---
description: ''
sidebar: 'docs'
prev: '/docs'
next: '/docs'
---

# Introduction

> Please note that we have recently deployed a new major version, `v2.0.0`. If you or your team members are encountering issues with running Kit commands due to installation of this version while working on a legacy site, please follow the upgrade details in [Updating to Version 2](/updating-to-v2/) or continue using a `1.*.*` version of the Kit. Note that `v2.*.*` now supports modern Node versions. `v1.*.*` supports Node v14+ only due to dependency limitations.

At Half Helix, we've been using this build and development tool for all of our Shopify themes since late 2019. We built and incorporated it into our workflows since we saw a need to have a scalable developer experience that can be purposed on a wide range of Shopify theme projects without our developers having to worry about setup.

We are in 2021 now and there are new tools and features that greatly help with Shopify theme development. Shopify has introduced [Dawn](https://github.com/Shopify/dawn) and with it a set of standards that encourage adoption of simpler approaches to theme development and a preference for JIT asset pipelines. [Shopify CLI for Themes](https://shopify.dev/themes/tools/cli/theme-commands) has been introduced to encourage this approach over robust tooling and file mutations. In part this is an expression of the maturity of modern browser APIs and our ability as a community to leverage greenfield features, like native javascript syntax and APIs like Web Components.

To provide an option for Shopify themes that benefit from having asset piplines we'll be supporting this tool and continuing to integrate features that allow theme developers to get the most out of Shopify. Feel free to review our recent Online Store 2.0 feature additions which we'll continue to add to.

## Philosophy & Contributing

This tool was made for our team at Half Helix and currently our focus is on maintaining it for our immediate stakeholders. If you have an idea or notice a bug please feel free to reach out and submit a Merge Request.

## Online Store 2.0 Features

During Unite in 2021, Shopify released a number of features under the name "Online Store 2.0". We explore how this tool supports these features in the "Online Store 2.0" section. Here are the features that we've added:

- Github Support
- Theme Kit Access Tokens
- Developer Themes
