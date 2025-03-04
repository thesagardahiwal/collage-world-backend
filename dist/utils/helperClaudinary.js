"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationOfFile = exports.getResourceTypeFromUrl = void 0;
const getResourceTypeFromUrl = (url) => {
    if (url.includes('.jpg') || url.includes('.jpeg')) {
        return 'image';
    }
    else if (url.includes('.mp3')) {
        return 'video';
    }
    else {
        return 'unknown';
    }
};
exports.getResourceTypeFromUrl = getResourceTypeFromUrl;
const getLocationOfFile = (contentId) => {
    return "uploads/" + contentId;
};
exports.getLocationOfFile = getLocationOfFile;
