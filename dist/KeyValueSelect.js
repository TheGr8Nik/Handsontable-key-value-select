"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var handsontable_1 = __importDefault(require("handsontable"));
var KeyValueOption_1 = require("./KeyValueOption");
var _a = handsontable_1.default.dom, addClass = _a.addClass, empty = _a.empty, fastInnerHTML = _a.fastInnerHTML, getComputedStyle = _a.getComputedStyle, getCssTransform = _a.getCssTransform, offset = _a.offset, outerHeight = _a.outerHeight, outerWidth = _a.outerWidth, resetCssTransform = _a.resetCssTransform, stopImmediatePropagation = _a.stopImmediatePropagation;
var KEY_CODES = handsontable_1.default.helper.KEY_CODES;
var BaseEditor = handsontable_1.default.editors.BaseEditor;
var objectEach = handsontable_1.default.helper.objectEach;
/**
 * @private
 * @editor KeyValueSelectEditor
 * @class KeyValueSelectEditor
 */
// @ts-ignore
var KeyValueSelectEditor = /** @class */ (function (_super) {
    __extends(KeyValueSelectEditor, _super);
    function KeyValueSelectEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._opened = false;
        return _this;
    }
    /**
     * Initializes editor instance, DOM Element and mount hooks.
     */
    KeyValueSelectEditor.prototype.init = function () {
        this.select = this.hot.rootDocument.createElement('SELECT');
        addClass(this.select, 'htSelectEditor');
        this.select.style.display = 'none';
        this.hot.rootElement.appendChild(this.select);
        this.registerHooks();
    };
    /**
     * Returns select's value.
     *
     * @returns {*}
     */
    KeyValueSelectEditor.prototype.getValue = function () {
        return this.select.value;
    };
    /**
     * Sets value in the select element.
     *
     * @param {*} value A new select's value.
     */
    KeyValueSelectEditor.prototype.setValue = function (value) {
        this.select.value = value;
    };
    /**
     * Opens the editor and adjust its size.
     */
    KeyValueSelectEditor.prototype.open = function () {
        var _this = this;
        this._opened = true;
        this.refreshDimensions();
        this.select.style.display = '';
        this.addHook('beforeKeyDown', function () { return _this.onBeforeKeyDown(); });
    };
    /**
     * Closes the editor.
     */
    KeyValueSelectEditor.prototype.close = function () {
        this._opened = false;
        this.select.style.display = 'none';
        this.clearHooks();
    };
    /**
     * Sets focus state on the select element.
     */
    KeyValueSelectEditor.prototype.focus = function () {
        this.select.focus();
    };
    /**
     * Binds hooks to refresh editor's size after scrolling of the viewport or resizing of columns/rows.
     *
     * @private
     */
    KeyValueSelectEditor.prototype.registerHooks = function () {
        var _this = this;
        this.addHook('afterScrollHorizontally', function () { return _this.refreshDimensions(); });
        this.addHook('afterScrollVertically', function () { return _this.refreshDimensions(); });
        this.addHook('afterColumnResize', function () { return _this.refreshDimensions(); });
        this.addHook('afterRowResize', function () { return _this.refreshDimensions(); });
    };
    /**
     * Prepares editor's meta data and a list of available options.
     *
     * @param {Number} row
     * @param {Number} col
     * @param {Number|String} prop
     * @param {HTMLTableCellElement} td
     * @param {*} originalValue
     * @param {Object} cellProperties
     */
    KeyValueSelectEditor.prototype.prepare = function (row, col, prop, td, originalValue, cellProperties) {
        var _this = this;
        _super.prototype.prepare.call(this, row, col, prop, td, originalValue, cellProperties);
        var selectOptions = this.cellProperties.selectOptions;
        var options;
        if (typeof selectOptions === 'function') {
            options = prepareOptions(selectOptions(this.row, this.col, this.prop));
        }
        else {
            options = prepareOptions(selectOptions);
        }
        empty(this.select);
        objectEach(options, function (value, key) {
            var optionElement = _this.hot.rootDocument.createElement('OPTION');
            optionElement.value = key;
            fastInnerHTML(optionElement, value);
            _this.select.appendChild(optionElement);
        });
    };
    /**
     * Refreshes editor's value using source data.
     *
     * @private
     */
    KeyValueSelectEditor.prototype.refreshValue = function () {
        var sourceData = this.hot.getSourceDataAtCell(this.row, this.prop);
        this.originalValue = sourceData;
        this.setValue(sourceData);
        this.refreshDimensions();
    };
    /**
     * Refreshes editor's size and position.
     *
     * @private
     */
    KeyValueSelectEditor.prototype.refreshDimensions = function () {
        if (this.state !== 'STATE_EDITING') {
            return;
        }
        this.TD = this.getEditedCell();
        // TD is outside of the viewport.
        if (!this.TD) {
            this.close();
            return;
        }
        var wtOverlays = this.hot.view.wt.wtOverlays;
        var currentOffset = offset(this.TD);
        var containerOffset = offset(this.hot.rootElement);
        var scrollableContainer = wtOverlays.scrollableElement;
        var editorSection = this.checkEditorSection();
        var width = outerWidth(this.TD) + 1;
        var height = outerHeight(this.TD) + 1;
        var editTop = currentOffset.top - containerOffset.top - 1 - (scrollableContainer.scrollTop || 0);
        var editLeft = currentOffset.left - containerOffset.left - 1 - (scrollableContainer.scrollLeft || 0);
        var cssTransformOffset;
        switch (editorSection) {
            case 'top':
                cssTransformOffset = getCssTransform(wtOverlays.topOverlay.clone.wtTable.holder.parentNode);
                break;
            case 'left':
                cssTransformOffset = getCssTransform(wtOverlays.leftOverlay.clone.wtTable.holder.parentNode);
                break;
            case 'top-left-corner':
                cssTransformOffset = getCssTransform(wtOverlays.topLeftCornerOverlay.clone.wtTable.holder.parentNode);
                break;
            case 'bottom-left-corner':
                cssTransformOffset = getCssTransform(wtOverlays.bottomLeftCornerOverlay.clone.wtTable.holder.parentNode);
                break;
            case 'bottom':
                cssTransformOffset = getCssTransform(wtOverlays.bottomOverlay.clone.wtTable.holder.parentNode);
                break;
            default:
                break;
        }
        if (this.hot.getSelectedLast()[0] === 0) {
            editTop += 1;
        }
        if (this.hot.getSelectedLast()[1] === 0) {
            editLeft += 1;
        }
        var selectStyle = this.select.style;
        if (cssTransformOffset && cssTransformOffset !== -1) {
            selectStyle[cssTransformOffset[0]] = cssTransformOffset[1];
        }
        else {
            resetCssTransform(this.select);
        }
        var cellComputedStyle = getComputedStyle(this.TD, this.hot.rootWindow);
        if (parseInt(cellComputedStyle.borderTopWidth || '', 10) > 0) {
            height -= 1;
        }
        if (parseInt(cellComputedStyle.borderLeftWidth || '', 10) > 0) {
            width -= 1;
        }
        selectStyle.height = height + "px";
        selectStyle.minWidth = width + "px";
        selectStyle.top = editTop + "px";
        selectStyle.left = editLeft + "px";
        selectStyle.margin = '0px';
    };
    /**
     * Gets HTMLTableCellElement of the edited cell if exist.
     *
     * @private
     * @returns {HTMLTableCellElement|undefined}
     */
    KeyValueSelectEditor.prototype.getEditedCell = function () {
        var wtOverlays = this.hot.view.wt.wtOverlays;
        var editorSection = this.checkEditorSection();
        var editedCell;
        switch (editorSection) {
            case 'top':
                editedCell = wtOverlays.topOverlay.clone.wtTable.getCell({
                    row: this.row,
                    col: this.col
                });
                this.select.style.zIndex = 101;
                break;
            case 'corner':
                editedCell = wtOverlays.topLeftCornerOverlay.clone.wtTable.getCell({
                    row: this.row,
                    col: this.col
                });
                this.select.style.zIndex = 103;
                break;
            case 'left':
                editedCell = wtOverlays.leftOverlay.clone.wtTable.getCell({
                    row: this.row,
                    col: this.col
                });
                this.select.style.zIndex = 102;
                break;
            default:
                editedCell = this.hot.getCell(this.row, this.col);
                this.select.style.zIndex = '';
                break;
        }
        return editedCell < 0 ? void 0 : editedCell;
    };
    /**
     * onBeforeKeyDown callback.
     *
     * @private
     */
    KeyValueSelectEditor.prototype.onBeforeKeyDown = function () {
        var previousOptionIndex = this.select.selectedIndex - 1;
        var nextOptionIndex = this.select.selectedIndex + 1;
        switch (event.keyCode) {
            case KEY_CODES.ARROW_UP:
                if (previousOptionIndex >= 0) {
                    this.select[previousOptionIndex].selected = true;
                }
                if (event) {
                    stopImmediatePropagation(event);
                    event.preventDefault();
                }
                break;
            case KEY_CODES.ARROW_DOWN:
                if (nextOptionIndex <= this.select.length - 1) {
                    this.select[nextOptionIndex].selected = true;
                }
                if (event) {
                    stopImmediatePropagation(event);
                    event.preventDefault();
                }
                break;
            default:
                break;
        }
    };
    return KeyValueSelectEditor;
}(BaseEditor));
/**
 * Creates consistent list of available options.
 *
 * @private
 * @param {Array|Object} optionsToPrepare
 * @returns {Object}
 */
function prepareOptions(optionsToPrepare) {
    var preparedOptions = {};
    if (Array.isArray(optionsToPrepare)) {
        for (var i = 0, len = optionsToPrepare.length; i < len; i++) {
            var option = optionsToPrepare[i];
            if (KeyValueOption_1.isKeyValueOption(option)) {
                preparedOptions[option.value] = option.label;
            }
            else {
                preparedOptions[option] = option;
            }
        }
    }
    else if (typeof optionsToPrepare === 'object') {
        preparedOptions = optionsToPrepare;
    }
    return preparedOptions;
}
exports.prepareOptions = prepareOptions;
exports.default = KeyValueSelectEditor;
