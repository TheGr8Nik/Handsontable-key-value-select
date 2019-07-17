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
declare function keyValueSelectRenderer(instance: any, TD: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: any, ...args: any[]): void;
export default keyValueSelectRenderer;
