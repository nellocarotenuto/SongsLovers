// Module dependencies
const diacritics = require('./diacritics.utils');

// Converts unicode chars to ASCII and returns a lowercase string
function normalize(string) {
    let normalized = diacritics.remove(string).replace(/[,.'"]/g, '').replace(/[-‐‑⁃−‒–—―]/g, '-').trim().toLowerCase();

    return normalized;
}


function slugify(text) {
    return normalize(text)
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// Export the normalize function
module.exports.normalize = normalize;
module.exports.slugify = slugify;