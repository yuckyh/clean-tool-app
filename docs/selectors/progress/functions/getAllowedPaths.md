**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/progress](../README.md) / getAllowedPaths

# Function: getAllowedPaths()

> **getAllowedPaths**(`state`, ...`params`): readonly `string`[]

Selector function to get the allowed paths

## Parameters

▪ **state**: `object`

The application state [AppState](../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../private/interfaces/State.md)\>

▪ ...**params**: [`string`]

## Returns

readonly `string`[]

The allowed paths.

## Example

```tsx
 const allowedPaths = useAppSelector(getAllowedPaths)
```

## Source

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node\_modules/reselect/es/types.d.ts:8

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
