// Module dependencies
const diacritics = require('./diacritics.utils');

// Converts unicode chars to ASCII and returns a lowercase string
function normalize(string) {
    let normalized = diacritics.remove(string).replace(/[--‐‑⁃−,.'"]/g, '').toLowerCase();

    return normalized;
}

// Export the normalize function
module.exports.normalize = normalize;