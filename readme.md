# Key Value Select for Handsontable

This repository defines a Key-Value selector and a relative Renderer.
The code is an extension for base Select editor and Renderer.

## Usage

Install the package:

```bash
npm install handsontable-key-value-select
```

Import the Renderer and the Editor components:

```typescript
import {KeyValueOptions, KeyValueRenderer, KeyValueSelect} from 'handsontable-key-value-select';
```

Use the components in the table:

```typescript
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

var container = document.getElementById('container');
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
  ]
})
```

Full example implemented in `src/examples` folder
