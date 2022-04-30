module.exports = function replaceNonAscii(string) {
    const parsed = string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return parsed.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, '-').toLowerCase();
}

