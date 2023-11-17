**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/progress/paths](../README.md) / getTitle

# Function: getTitle()

> **getTitle**(`state`, ...`params`): `string`

The selector to get the title for the current progress nav item.

## Parameters

▪ **state**: `object`

▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../private/interfaces/State.md)\>

▪ ...**params**: [`string`, `string`]

## Returns

`string`

The selector.

## Example

```ts
   const { pathname: locationPath } = useLocation()
   const title = useAppSelector((state) => getTitle(state, locationPath))
```

## Source

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node\_modules/reselect/es/types.d.ts:8

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
