"use strict";
// Polyfill para crypto en entornos que no lo tienen
if (typeof window !== 'undefined' && !window.crypto) {
    // @ts-ignore
    window.crypto = {
        getRandomValues: function (arr) {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = Math.floor(Math.random() * 256);
            }
            return arr;
        }
    };
}
