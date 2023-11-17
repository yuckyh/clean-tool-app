**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/CellItem](../README.md) / recordMap

# Function: recordMap()

> **recordMap**\<`A`, `B`\>(`fn`): (`cellItem`) => `Readonly`\<[`CellItem`](../interfaces/CellItem.md)\<`B`\>\>

The function to map over a cell item.

## Type parameters

▪ **A** extends [`Value`](../type-aliases/Value.md)

▪ **B** extends [`Value`](../type-aliases/Value.md)

## Parameters

▪ **fn**: (`a`) => `Readonly`\<`Record`\<`string`, `B`\>\>

The function to map over the cell item.

## Returns

`function`

The mapped cell item.

> > (`cellItem`): `Readonly`\<[`CellItem`](../interfaces/CellItem.md)\<`B`\>\>
>
> ### Parameters
>
> ▪ **cellItem**: `Readonly`\<[`CellItem`](../interfaces/CellItem.md)\<`A`\>\>
>
> ### Returns
>
> `Readonly`\<[`CellItem`](../interfaces/CellItem.md)\<`B`\>\>
>
> ### Source
>
> [Projects/clean-tool-app/src/lib/fp/CellItem.ts:66](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
const mappedCellItem = map((x) => {...x, a: 'foo'})(cellItem)
```

## Source

[Projects/clean-tool-app/src/lib/fp/CellItem.ts:63](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
