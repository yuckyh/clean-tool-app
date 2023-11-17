**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/progress](../README.md) / getShouldNavigateToAllowed

# Function: getShouldNavigateToAllowed()

> **getShouldNavigateToAllowed**(`state`, ...`params`): `boolean`

Selector function to get whether the user should be navigated to the allowed path.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../private/interfaces/State.md)\>

▪ ...**params**: [`string`, `string`]

## Returns

`boolean`

Whether the user should be navigated to the allowed path.

## Example

```tsx
 const shouldNavigateToAllowed = useAppSelector(getShouldNavigateToAllowed)
```

## Source

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node\_modules/reselect/es/types.d.ts:8

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
