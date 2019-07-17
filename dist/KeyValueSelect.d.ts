import Handsontable from 'handsontable';
import { KeyValueOptions } from './KeyValueOption';
declare let BaseEditor: typeof Handsontable._editors.Base;
/**
 * @private
 * @editor KeyValueSelectEditor
 * @class KeyValueSelectEditor
 */
declare class KeyValueSelectEditor extends BaseEditor {
    select: any;
    hot: any;
    _opened: boolean;
    addHook: any;
    clearHooks: any;
    /**
     * Initializes editor instance, DOM Element and mount hooks.
     */
    init(): void;
    /**
     * Returns select's value.
     *
     * @returns {*}
     */
    getValue(): any;
    /**
     * Sets value in the select element.
     *
     * @param {*} value A new select's value.
     */
    setValue(value: any): void;
    /**
     * Opens the editor and adjust its size.
     */
    open(): void;
    /**
     * Closes the editor.
     */
    close(): void;
    /**
     * Sets focus state on the select element.
     */
    focus(): void;
    /**
     * Binds hooks to refresh editor's size after scrolling of the viewport or resizing of columns/rows.
     *
     * @private
     */
    registerHooks(): void;
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
    prepare(row: number, col: number, prop: number | string, td: HTMLTableCellElement, originalValue: any, cellProperties: any): void;
    /**
     * Refreshes editor's value using source data.
     *
     * @private
     */
    refreshValue(): void;
    /**
     * Refreshes editor's size and position.
     *
     * @private
     */
    refreshDimensions(): void;
    /**
     * Gets HTMLTableCellElement of the edited cell if exist.
     *
     * @private
     * @returns {HTMLTableCellElement|undefined}
     */
    getEditedCell(): any;
    /**
     * onBeforeKeyDown callback.
     *
     * @private
     */
    onBeforeKeyDown(): void;
}
/**
 * Creates consistent list of available options.
 *
 * @private
 * @param {Array|Object} optionsToPrepare
 * @returns {Object}
 */
export declare function prepareOptions(optionsToPrepare: KeyValueOptions): Record<string, string>;
export default KeyValueSelectEditor;
