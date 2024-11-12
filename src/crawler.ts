"use strict";

function normalizeURL(url: string): string {
    const urlObj: URL = new URL(url);
    const path =  (urlObj.host + urlObj.pathname).toLowerCase();
    
    if (path.length > 0 && path.slice(-1) === '/') {
        return path.slice(0, -1)
    } else {
        return path;
    }
}

export {
    normalizeURL
}