**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/CellItem](../README.md) / unwrap

# Function: unwrap()

> **unwrap**\<`V`\>(`cellItem`): `Readonly`\<`Record`\<`string`, `V`\>\>

The function to unwrap a cell item.

## Type parameters

▪ **V** extends [`Value`](../type-aliases/Value.md)

## Parameters

▪ **cellItem**: `Readonly`\<[`CellItem`](../interfaces/CellItem.md)\<`V`\>\>

The cell item instance.

## Returns

`Readonly`\<`Record`\<`string`, `V`\>\>

The value of the cell item.

## Example

```ts
const value = unwrap(cellItem)
```

## Source

[Projects/clean-tool-app/src/lib/fp/CellItem.ts:51](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
