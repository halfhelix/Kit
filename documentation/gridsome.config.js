// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Kit.',
  icon: {
    favicon: './src/assets/favicon.png',
    touchicon: './src/assets/favicon.png'
  },
  siteUrl: process.env.SITE_URL
    ? process.env.SITE_URL
    : 'https://kit.halfhelix.com',
  settings: {
    web: process.env.URL_WEB || false,
    twitter: process.env.URL_TWITTER || false,
    github: process.env.URL_GITHUB || false,
    nav: {
      links: [{ path: '/docs/', title: 'Docs' }]
    },
    sidebar: [
      {
        name: 'docs',
        sections: [
          {
            title: 'The Basics',
            items: [
              '/docs/',
              '/docs/updating-to-v2/',
              '/docs/installation/',
              '/docs/theme-setup/',
              '/docs/getting-started/',
              '/docs/commands/',
              '/docs/local-development/',
              '/docs/thinking-modular/'
              // '/docs/deploy/'
            ]
          },
          {
            title: 'Features',
            items: [
              '/docs/critical-css/',
              '/docs/javascript-chunking/',
              '/docs/linting/',
              '/docs/gitlab-integration/',
              '/docs/theme-naming/'
            ]
          },
          {
            title: 'Online Store 2.0',
            items: [
              '/docs/repo-sync/',
              '/docs/developer-themes/',
              '/docs/theme-kit-access-tokens/'
            ]
          },
          {
            title: 'Settings Reference',
            items: [
              '/settings/environment/',
              '/settings/browsersync/',
              '/settings/css/',
              '/settings/git/',
              '/settings/javascript/',
              '/settings/path/',
              '/settings/shopify/',
              '/settings/theme-name/'
            ]
          },
          {
            title: 'Other Stuff',
            items: [
              '/docs/contributing/',
              '/docs/testing-on-mobile/',
              '/docs/changelog/',
              '/docs/troubleshooting/'
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        baseDir: './content',
        path: '**/*.md',
        typeName: 'MarkdownPage',
        remark: {
          externalLinksTarget: '_blank',
          externalLinksRel: ['noopener', 'noreferrer'],
          plugins: ['@gridsome/remark-prismjs']
        }
      }
    },

    {
      use: 'gridsome-plugin-tailwindcss',
      options: {
        tailwindConfig: './tailwind.config.js',
        purgeConfig: {
          // Prevent purging of prism classes.
          whitelistPatternsChildren: [/token$/]
        }
      }
    },

    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: process.env.GA_ID ? process.env.GA_ID : 'XX-999999999-9'
      }
    },

    {
      use: '@gridsome/plugin-sitemap',
      options: {}
    }
  ]
}
