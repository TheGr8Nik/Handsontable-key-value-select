"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var handsontable_1 = __importDefault(require("handsontable"));
var getRenderer = handsontable_1.default.renderers.getRenderer;
var stringify = handsontable_1.default.helper.stringify;
var _a = handsontable_1.default.dom, empty = _a.empty, fastInnerText = _a.fastInnerText;
var KeyValueSelect_1 = require("./KeyValueSelect");
/**
 * Default text renderer
 *
 * @private
 * @renderer TextRenderer
 * @param {Object} instance Handsontable instance
 * @param {Element} TD Table cell where to render
 * @param {Number} row
 * @param {Number} col
 * @param {String|Number} prop Row object property name
 * @param value Value to render (remember to escape unsafe HTML before inserting to DOM!)
 * @param {Object} cellProperties Cell properties (shared by cell renderer and editor)
 */
function keyValueSelectRenderer(instance, TD, row, col, prop, value, cellProperties) {
    var args = [];
    for (var _i = 7; _i < arguments.length; _i++) {
        args[_i - 7] = arguments[_i];
    }
    // @ts-ignore
    getRenderer('base').apply(this, [instance, TD, row, col, prop, value, cellProperties].concat(args));
    var escaped = value;
    if (cellProperties.selectOptions) {
        var preparedOptions = KeyValueSelect_1.prepareOptions(cellProperties.selectOptions);
        escaped = preparedOptions[value] || escaped;
    }
    if (!escaped && cellProperties.placeholder) {
        escaped = cellProperties.placeholder;
    }
    escaped = stringify(escaped);
    if (!instance.getSettings().trimWhitespace) {
        escaped = escaped.replace(/ /g, String.fromCharCode(160));
    }
    if (cellProperties.rendererTemplate) {
        empty(TD);
        var TEMPLATE = instance.rootDocument.createElement('TEMPLATE');
        TEMPLATE.setAttribute('bind', '{{}}');
        TEMPLATE.innerHTML = cellProperties.rendererTemplate;
        HTMLTemplateElement.decorate(TEMPLATE);
        TEMPLATE.model = instance.getSourceDataAtRow(row);
        TD.appendChild(TEMPLATE);
    }
    else {
        // this is faster than innerHTML. See: https://github.com/handsontable/handsontable/wiki/JavaScript-&-DOM-performance-tips
        fastInnerText(TD, escaped);
    }
}
exports.default = keyValueSelectRenderer;
