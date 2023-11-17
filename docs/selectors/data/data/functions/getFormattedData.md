**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/data/data](../README.md) / getFormattedData

# Function: getFormattedData()

> **getFormattedData**(`state`, ...`params`): readonly [`CellItem`](../../../../lib/fp/CellItem/interfaces/CellItem.md)\<[`Value`](../../../../lib/fp/CellItem/type-aliases/Value.md)\>[]

Selector function to get the formatted data.

To get the formatted data, the original, formatted, and empty columns are used to create a new array of [CellItem](../../../../lib/fp/CellItem/interfaces/CellItem.md) objects.

Using the data types, the values of the [CellItem](../../../../lib/fp/CellItem/interfaces/CellItem.md) objects are converted to the correct type.

The empty columns are then used to insert empty values into the [CellItem](../../../../lib/fp/CellItem/interfaces/CellItem.md) objects.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../../progress/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../../progress/private/interfaces/State.md)\>

▪ ...**params**: []

## Returns

readonly [`CellItem`](../../../../lib/fp/CellItem/interfaces/CellItem.md)\<[`Value`](../../../../lib/fp/CellItem/type-aliases/Value.md)\>[]

The formatted data

## Example

```ts
const getRenamedSheet = createSelector([getFormattedData],
   (formattedData) =>
   utils.json_to_sheet(formattedData as CellItem.CellItem[]),
 )
```

## Source

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node\_modules/reselect/es/types.d.ts:8

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
