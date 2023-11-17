**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/matches](../README.md) / getMatchColumn

# Function: getMatchColumn()

> **getMatchColumn**(`state`, ...`params`): `string`

The selector to get the match column

## Parameters

▪ **state**: `object`

▪ **state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../progress/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../progress/private/interfaces/State.md)\>

▪ ...**params**: [`number`]

## Returns

`string`

The match column

## Example

```ts
const matchColumn = useAppSelector(selectMatchColumn(pos))
```

## Source

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node\_modules/reselect/es/types.d.ts:8

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
