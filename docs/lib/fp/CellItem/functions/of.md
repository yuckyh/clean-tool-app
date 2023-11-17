**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/CellItem](../README.md) / of

# Function: of()

> **of**\<`V`\>(`value`): `Readonly`\<[`CellItem`](../interfaces/CellItem.md)\<`V`\>\>

The constructor for a cell item.

## Type parameters

▪ **V** extends [`Value`](../type-aliases/Value.md)

## Parameters

▪ **value**: `Readonly`\<`Record`\<`string`, `V`\>\>

The value of the cell item.

## Returns

`Readonly`\<[`CellItem`](../interfaces/CellItem.md)\<`V`\>\>

The cell item.

## Example

```ts
const cellItem = of({ foo: 1, bar: 'baz' })
```

## Source

[Projects/clean-tool-app/src/lib/fp/CellItem.ts:36](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
