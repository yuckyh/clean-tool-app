**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [features/progress/selectors](../README.md) / getPosition

# Function: getPosition()

> **getPosition**(`state`, ...`params`): `number`

The selector to get the position for the current progress nav item.

## Parameters

▪ **state**: `object`

▪ **state.columns**: `Readonly`\<[`State`](../../../../selectors/columns/selectors/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../../../selectors/columns/selectors/private/interfaces/State.md)\>

▪ **state.sheet**: `Readonly`\<[`State`](../../../sheet/reducers/interfaces/State.md)\>

▪ ...**params**: [`string`, `string`]

## Returns

`number`

The selector.

## Example

```ts
   const { pathname: locationPath } = useLocation()
   const position = useAppSelector((state) => getPosition(state, locationPath))
```

## Source

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node\_modules/reselect/es/types.d.ts:8

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
