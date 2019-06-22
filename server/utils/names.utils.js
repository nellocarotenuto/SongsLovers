// Module dependencies
const diacritics = require('./diacritics.utils');

// Converts unicode chars to ASCII and returns a lowercase string
function normalize(string) {
    return diacritics
        .remove(string)
        .replace(/[,.’'"]/g, '')
        .replace(/[-‐‑⁃−‒–—―]/g, '')
        .replace(/[()]/g, '')
        .replace(/\s\s+/g, ' ')
        .trim()
        .toLowerCase();
}


function slugify(text) {
    return normalize(text)
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Export the normalize function
module.exports.normalize = normalize;
module.exports.slugify = slugify;
