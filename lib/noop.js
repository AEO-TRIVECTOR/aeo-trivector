// Noop module to replace Pages Router error pages
// Prevents Next.js from trying to render fallback error pages
// using Pages Router code that imports <Html> from next/document
module.exports = function() { return null }
module.exports.default = function() { return null }
