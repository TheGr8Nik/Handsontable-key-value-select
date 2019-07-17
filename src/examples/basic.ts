import Handsontable from 'handsontable';
import {KeyValueOptions, KeyValueRenderer, KeyValueSelect} from '../';

var data = [
  ['2017', 'honda', 10],
  ['2018', 'toyota', 20],
  ['2019', 'nissan', 30]
];

var selectOptions: KeyValueOptions = [
  {value: 'kia', label: 'Kia Motors'},
  {value: 'toyota', label: 'Toyota Motor Corp'},
  {value: 'nissan', label: 'Nissan Motor Co., Ltd.'},
  {value: 'honda', label: 'Honda Motor Co., Ltd.'},
]

var container = document.getElementById('basic_example');
var debug_table_data = document.getElementById('debug_table_data');
if (container) {
  var hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    colHeaders: true,
    filters: true,
    dropdownMenu: true,
    columns: [
      {},
      {
        editor: KeyValueSelect,
        renderer: KeyValueRenderer,
        selectOptions: selectOptions as any,
      },
      {}
    ],
    afterChange() {
      if (debug_table_data) {
        debug_table_data.innerHTML = JSON.stringify(data, null, 2);
      }
    }
  })
} else {
  console.error('Unable to find table container with id `basic_example`')
}
