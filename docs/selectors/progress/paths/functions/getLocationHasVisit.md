**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/progress/paths](../README.md) / getLocationHasVisit

# Function: getLocationHasVisit()

> **getLocationHasVisit**(`state`, ...`params`): `boolean`

The selector to get whether the current location has a visit in the path.

## Parameters

▪ **state**: `object`

▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../private/interfaces/State.md)\>

▪ ...**params**: [`string`, `string`]

## Returns

`boolean`

The selector.

## Example

```ts
   const { pathname: locationPath } = useLocation()
   const locationHasVisit = useAppSelector((state) => getLocationHasVisit(state, locationPath))
```

## Source

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node\_modules/reselect/es/types.d.ts:8

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
