**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/data/cells](../README.md) / getCell

# Function: getCell()

> **getCell**(`state`, ...`params`): [`Value`](../../../../lib/fp/CellItem/type-aliases/Value.md)

Selector function to get the cell from the data array.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../../progress/progress/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../../progress/progress/private/interfaces/State.md)\>

▪ ...**params**: [`number`, `number`]

## Returns

[`Value`](../../../../lib/fp/CellItem/type-aliases/Value.md)

The cell from the data array

## Example

```ts
const cell = useAppSelector(selectCell(col, row))
```

## Source

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node\_modules/reselect/es/types.d.ts:8

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
