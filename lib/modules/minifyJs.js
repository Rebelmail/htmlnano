'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = minifyJs;

var _uglifyJs = require('uglify-js');

var _uglifyJs2 = _interopRequireDefault(_uglifyJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Minify JS with UglifyJS */
function minifyJs(tree, options, uglifyJsOptions) {
    uglifyJsOptions.fromString = true;

    tree.match({ tag: 'script' }, function (node) {
        var nodeAttrs = node.attrs || {};
        var mimeType = nodeAttrs.type || 'text/javascript';
        if (mimeType === 'text/javascript' || mimeType === 'application/javascript') {
            return processScriptNode(node, uglifyJsOptions);
        }

        return node;
    });

    tree.match({ attrs: true }, function (node) {
        return processNodeWithOnAttrs(node, uglifyJsOptions);
    });

    return tree;
}

function processScriptNode(scriptNode, uglifyJsOptions) {
    var js = (scriptNode.content || []).join(' ').trim();
    if (!js) {
        return scriptNode;
    }

    var result = _uglifyJs2.default.minify(js, uglifyJsOptions);
    scriptNode.content = [result.code];

    return scriptNode;
}

function processNodeWithOnAttrs(node, uglifyJsOptions) {
    var jsWrapperStart = 'function _(){';
    var jsWrapperEnd = '}';

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(node.attrs || {})[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var attrName = _step.value;

            if (attrName.search('on') !== 0) {
                continue;
            }

            // For example onclick="return false" is valid,
            // but "return false;" is invalid (error: 'return' outside of function)
            // Therefore the attribute's code should be wrapped inside function:
            // "function _(){return false;}"
            var wrappedJs = jsWrapperStart + node.attrs[attrName] + jsWrapperEnd;
            var wrappedMinifiedJs = _uglifyJs2.default.minify(wrappedJs, uglifyJsOptions).code;
            var minifiedJs = wrappedMinifiedJs.substring(jsWrapperStart.length, wrappedMinifiedJs.length - jsWrapperEnd.length);
            node.attrs[attrName] = minifiedJs;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return node;
}