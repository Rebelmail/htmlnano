"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = example;
/**
 * Example module
 *
 * @param {object} tree - PostHTML tree (https://github.com/posthtml/posthtml/blob/master/README.md)
 * @param {object} options - Options that were passed to htmlnano
 * @param moduleOptions — Module options. For most modules this is just "true" (indication that the module was enabled)
 */
function example(tree, options, moduleOptions) {
    // Module filename (example.es6), exported default function name (example),
    // and test filename (example.js) must be the same.

    // You can traverse the tree...
    tree.walk(function (node) {
        // ...and make some minification
    });

    // At the end you must return the tree
    return tree;

    // Or a promise with the tree
    return somePromise.then(function () {
        return tree;
    });
}