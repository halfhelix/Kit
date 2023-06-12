/**
 * Most of these settings are consumed in this service:
 * packages/shopify-kit/services/stylesheetChunking
 */
module.exports = {
  // The name of the CSS bundle file to create using Webpack
  'css.mainFileName': '[name].min.css.liquid',
  // Lint CSS using stylelint?
  'css.lintStyles': true,
  // The glob paths that should be CSS linted
  'css.stylelintPaths'(settings) {
    return [
      // `src/assets/css/**/*.scss`,
      `src/assets/scss/**/*.scss`,
      `src/modules/**/*.scss`,
      `src/sections/**/*.scss`
    ]
  },
  // Add Autoprefixing in "watch" command via PostCSS
  'css.autoprefixInWatch': false,
  // Break out CSS chunks based on module folder names?
  'css.chunk': false,
  // The CSS bundle file to break apart into chunks
  'css.chunk.fileToProcess': 'main.min.css',
  // Module folders to put into a "global" chunk that is included on every page
  'css.chunk.globalFolders': ['global'],
  // Certain CSS files to add into the "global" bucket of styles
  'css.chunk.globalFiles': [],
  // Add chunked CSS inline within the generated Liquid snippet?
  // Defaults to creating a new CSS file for each chunk since chunks can get hefty
  'css.chunk.inline': false,
  // The name of the Liquid snippet that is auto-generated with
  // after this critical css and chunking process completes
  'css.chunk.snippet': 'snippets/stylesheets.liquid',
  // Only deploy compiled & chunked assets to Shopify to test this setup?
  'css.chunk.testSplitting': false,
  // Overwrite the order in which CSS chunks are added to the generated Liquid file?
  // This can be a Function passed into a native .sort() function
  'css.chunk.sortFunction': false,
  // Overwrite the Liquid if/elsif conditional for the CSS chunk
  'css.chunk.conditionalFilter'(obj, defaultString) {
    return defaultString
  },
  // Override the folder name before it is interpreted by the Liquid conditional
  'css.chunk.conditionalFolderMapping': {},
  // The Liquid property to compare to the first part of the folder name "{page-type}-{suffix}"
  'css.chunk.firstConditionalProperty': 'request.page_type',
  // The Liquid property to compare to the second part of the folder name "{page-type}-{suffix}"
  'css.chunk.secondConditionalProperty': 'template.suffix',
  // The Liquid equality keyword to use in the first conditional comparison
  'css.chunk.firstEqualityConditional': 'contains',
  // The Liquid equality keyword to use in the second conditional comparison
  'css.chunk.secondEqualityConditional': 'contains',
  // The delimiting character that is used to split folders into the two-part conditional
  'css.chunk.folderDelimiter': '-',
  // Overwrite the generating Liquid string that represents each chunk in the Liquid snippet
  'css.chunk.snippetFilter'(obj, defaultString) {
    return defaultString
  },
  // Create pre-fetch links for chunks that are not loaded on the current page?
  'css.chunk.createPreFetchLinks': false,
  // Remove chunked CSS from the original file?
  'css.chunk.updateOriginalFile': true,
  // The rendered Liquid of the fallback remaining unchunked, non-critical CSS
  'css.chunk.defaultCSSInclude'(fileName, settings) {
    return `{{ '${fileName}' | asset_url | stylesheet_tag: preload: true }}`
  },
  // Break the CSS into critical and non-critical blocks
  'css.chunk.critical'(settings) {
    return !!settings['css.chunk']
  },
  // Roll certain module folders into other CSS chunks to share across pages
  'css.chunk.partials': {
    // reviews: ['product']
  },
  // The folder names to "whitelist" to split out critical and non-critical CSS
  // To avoid FOUT, this functionality is opt-in rather than opt-out
  'css.chunk.criticalWhitelist': [],
  // The Liquid that wraps the critical CSS chunk
  'css.chunk.criticalChunk'(token, settings) {
    return `<style data-critical data-kit>${token.critical}</style>`
  },
  // The Liquid that loads in the non-critical part of each CSS chunk
  'css.chunk.deferredChunkLink'(assetPath, settings) {
    return `
      <link rel="stylesheet" href="{{ '${assetPath}' | asset_url }}" media="print" onload="this.media='all'" data-kit>
      <noscript><link rel="stylesheet" href="{{ '${assetPath}' | asset_url }}"></noscript>
    `
  },
  // Overwrite the entire Liquid snippet before it is generated
  'css.chunk.filterLiquidSnippetTemplate'(template, settings) {
    return template
  },
  // Filters the HTML comment merge tag that is then replaced with each part of the
  // chunk and critical CSS output. See:
  // - packages/shopify-kit/services/stylesheetChunking/lib/liquidSnippetTemplate.js
  // - packages/shopify-kit/services/stylesheetChunking/lib/liquidSnippet.js
  'css.chunk.filterLiquidSnippetTag'(tag, settings) {
    return tag
  },
  // This is use in testing only, this allows a developer to only upload
  // certain chunks to speed up testing "rinse and repeat" experience.
  'css.chunk.criticalUploadFilter'(token, settings) {
    if (settings.upload) {
      return new RegExp(`main|snippet|${settings.upload}`).test(token.theme)
    }

    return true
  }
}
