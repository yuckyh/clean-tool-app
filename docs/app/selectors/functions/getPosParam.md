**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/selectors](../README.md) / getPosParam

# Function: getPosParam()

> **getPosParam**(`_state`, `_componentPath`, `_locationPath`, `pos`): `number`

Utility function to get the position parameter when used with the location path parameter.

## Parameters

▪ **\_state**: `object`

The application state [AppState](../../store/type-aliases/AppState.md)

▪ **\_state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **\_state.matches**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **\_componentPath**: `string`

The component path parameter

▪ **\_locationPath**: `string`

The location path parameter

▪ **pos**: `number`

The position parameter

## Returns

`number`

The position parameter

## Example

```ts
const getPath = createSelector([getPaths, getPosParam], (paths, pos) =>
   arrayLookup(paths)('')(pos),
 )
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:129](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
