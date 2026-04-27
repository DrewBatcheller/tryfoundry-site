// Eleventy config for tryfoundry-site.
//
// Scope: Eleventy is used ONLY for the /blog section. The root pages
// (index.html, faq.html, build-notes.html, privacy.html) remain
// hand-written HTML and are passed through unchanged.
//
// Anyone editing this file should preserve that boundary: don't
// pull root pages into the template engine, don't add features that
// require Eleventy to process them.

const rssPlugin = require('@11ty/eleventy-plugin-rss');

module.exports = function (eleventyConfig) {
  // RSS feed for /blog/feed.xml
  eleventyConfig.addPlugin(rssPlugin);

  // Pass-through copies: existing static assets keep working as-is.
  eleventyConfig.addPassthroughCopy('index.html');
  eleventyConfig.addPassthroughCopy('faq.html');
  eleventyConfig.addPassthroughCopy('build-notes.html');
  eleventyConfig.addPassthroughCopy('privacy.html');
  eleventyConfig.addPassthroughCopy('screenshots');
  eleventyConfig.addPassthroughCopy('robots');
  eleventyConfig.addPassthroughCopy('.nojekyll');

  // Don't run root HTML through the template engine. They predate
  // Eleventy and use plain HTML, no template syntax.
  eleventyConfig.ignores.add('index.html');
  eleventyConfig.ignores.add('faq.html');
  eleventyConfig.ignores.add('build-notes.html');
  eleventyConfig.ignores.add('privacy.html');
  eleventyConfig.ignores.add('README.md');

  // Pretty date for post pages and the index list.
  eleventyConfig.addFilter('postDate', (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  // ISO date for <time datetime="..."> attributes.
  eleventyConfig.addFilter('isoDate', (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString();
  });

  // The posts collection: every markdown file under blog/posts/, newest first.
  eleventyConfig.addCollection('posts', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('blog/posts/*.md')
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: '.',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', 'html'],
  };
};
