import Handsontable from 'handsontable';
let { getRenderer } = Handsontable.renderers;
let { stringify } = Handsontable.helper;
let { empty, fastInnerText } = Handsontable.dom;

import { prepareOptions } from './KeyValueSelect';

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
function keyValueSelectRenderer(instance: any, TD: HTMLTableCellElement, row: number, col: number, prop: string|number, value: any, cellProperties: any, ...args: any[]) {
  // @ts-ignore
  getRenderer('base').apply(this, [instance, TD, row, col, prop, value, cellProperties, ...args]);
  let escaped = value;

  if (cellProperties.selectOptions) {
    let preparedOptions = prepareOptions(cellProperties.selectOptions);
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
    const TEMPLATE = instance.rootDocument.createElement('TEMPLATE');
    TEMPLATE.setAttribute('bind', '{{}}');
    TEMPLATE.innerHTML = cellProperties.rendererTemplate;
    (HTMLTemplateElement as any).decorate(TEMPLATE);
    TEMPLATE.model = instance.getSourceDataAtRow(row);
    TD.appendChild(TEMPLATE);

  } else {
    // this is faster than innerHTML. See: https://github.com/handsontable/handsontable/wiki/JavaScript-&-DOM-performance-tips
    fastInnerText(TD, escaped);
  }
}

export default keyValueSelectRenderer;
