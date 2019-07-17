import Handsontable from 'handsontable';
import { KeyValueOptions, isKeyValueOption } from './KeyValueOption';
let {
  addClass,
  empty,
  fastInnerHTML,
  getComputedStyle,
  getCssTransform,
  offset,
  outerHeight,
  outerWidth,
  resetCssTransform,
  stopImmediatePropagation,
} = Handsontable.dom;
let { KEY_CODES } = Handsontable.helper;
let BaseEditor = Handsontable.editors.BaseEditor;
let { objectEach } = Handsontable.helper;

/**
 * @private
 * @editor KeyValueSelectEditor
 * @class KeyValueSelectEditor
 */
// @ts-ignore
class KeyValueSelectEditor extends BaseEditor {
  select: any;
  hot: any;
  _opened: boolean = false;
  addHook: any;
  clearHooks: any;

  /**
   * Initializes editor instance, DOM Element and mount hooks.
   */
  init() {
    this.select = this.hot.rootDocument.createElement('SELECT');
    addClass(this.select, 'htSelectEditor');
    this.select.style.display = 'none';

    this.hot.rootElement.appendChild(this.select);
    this.registerHooks();
  }

  /**
   * Returns select's value.
   *
   * @returns {*}
   */
  getValue() {
    return this.select.value;
  }

  /**
   * Sets value in the select element.
   *
   * @param {*} value A new select's value.
   */
  setValue(value: any) {
    this.select.value = value;
  }

  /**
   * Opens the editor and adjust its size.
   */
  open() {
    this._opened = true;
    this.refreshDimensions();
    this.select.style.display = '';
    this.addHook('beforeKeyDown', () => this.onBeforeKeyDown());
  }

  /**
   * Closes the editor.
   */
  close() {
    this._opened = false;
    this.select.style.display = 'none';
    this.clearHooks();
  }

  /**
   * Sets focus state on the select element.
   */
  focus() {
    this.select.focus();
  }

  /**
   * Binds hooks to refresh editor's size after scrolling of the viewport or resizing of columns/rows.
   *
   * @private
   */
  registerHooks() {
    this.addHook('afterScrollHorizontally', () => this.refreshDimensions());
    this.addHook('afterScrollVertically', () => this.refreshDimensions());
    this.addHook('afterColumnResize', () => this.refreshDimensions());
    this.addHook('afterRowResize', () => this.refreshDimensions());
  }

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
  prepare(row: number, col: number, prop: number | string, td: HTMLTableCellElement, originalValue: any, cellProperties: any) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);

    const selectOptions: any = this.cellProperties.selectOptions;
    let options;

    if (typeof selectOptions === 'function') {
      options = prepareOptions(selectOptions(this.row, this.col, this.prop));
    } else {
      options = prepareOptions(selectOptions);
    }

    empty(this.select);

    objectEach(options, (value, key) => {
      const optionElement = this.hot.rootDocument.createElement('OPTION');
      optionElement.value = key;

      fastInnerHTML(optionElement, value);
      this.select.appendChild(optionElement);
    });
  }

  /**
   * Refreshes editor's value using source data.
   *
   * @private
   */
  refreshValue() {
    const sourceData = this.hot.getSourceDataAtCell(this.row, this.prop);
    this.originalValue = sourceData;

    this.setValue(sourceData);
    this.refreshDimensions();
  }

  /**
   * Refreshes editor's size and position.
   *
   * @private
   */
  refreshDimensions() {
    if (this.state !== 'STATE_EDITING') {
      return;
    }

    this.TD = this.getEditedCell();

    // TD is outside of the viewport.
    if (!this.TD) {
      this.close();

      return;
    }
    const { wtOverlays } = this.hot.view.wt;
    const currentOffset: any = offset(this.TD);
    const containerOffset: any = offset(this.hot.rootElement);
    const scrollableContainer = wtOverlays.scrollableElement;
    const editorSection = this.checkEditorSection();
    let width = outerWidth(this.TD) + 1;
    let height = outerHeight(this.TD) + 1;
    let editTop = currentOffset.top - containerOffset.top - 1 - (scrollableContainer.scrollTop || 0);
    let editLeft = currentOffset.left - containerOffset.left - 1 - (scrollableContainer.scrollLeft || 0);
    let cssTransformOffset: any;

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

    const selectStyle = this.select.style;

    if (cssTransformOffset && cssTransformOffset !== -1) {
      selectStyle[cssTransformOffset[0]] = cssTransformOffset[1];
    } else {
      resetCssTransform(this.select);
    }

    const cellComputedStyle = getComputedStyle(this.TD, this.hot.rootWindow) as CSSStyleDeclaration;

    if (parseInt(cellComputedStyle.borderTopWidth || '', 10) > 0) {
      height -= 1;
    }
    if (parseInt(cellComputedStyle.borderLeftWidth || '', 10) > 0) {
      width -= 1;
    }

    selectStyle.height = `${height}px`;
    selectStyle.minWidth = `${width}px`;
    selectStyle.top = `${editTop}px`;
    selectStyle.left = `${editLeft}px`;
    selectStyle.margin = '0px';
  }

  /**
   * Gets HTMLTableCellElement of the edited cell if exist.
   *
   * @private
   * @returns {HTMLTableCellElement|undefined}
   */
  getEditedCell() {
    const { wtOverlays } = this.hot.view.wt;
    const editorSection = this.checkEditorSection() as string;
    let editedCell;

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
  }

  /**
   * onBeforeKeyDown callback.
   *
   * @private
   */
  onBeforeKeyDown() {
    const previousOptionIndex = this.select.selectedIndex - 1;
    const nextOptionIndex = this.select.selectedIndex + 1;

    switch ((event as any).keyCode) {
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
  }
}

/**
 * Creates consistent list of available options.
 *
 * @private
 * @param {Array|Object} optionsToPrepare
 * @returns {Object}
 */
export function prepareOptions(optionsToPrepare: KeyValueOptions) {
  let preparedOptions: Record<string, string> = {};

  if (Array.isArray(optionsToPrepare)) {
    for (let i = 0, len = optionsToPrepare.length; i < len; i++) {
      let option = optionsToPrepare[i];
      if (isKeyValueOption(option)) {
        preparedOptions[option.value] = option.label;
      } else {
        preparedOptions[option] = option;
      }
    }

  } else if (typeof optionsToPrepare === 'object') {
    preparedOptions = optionsToPrepare;
  }

  return preparedOptions;
}

export default KeyValueSelectEditor;
