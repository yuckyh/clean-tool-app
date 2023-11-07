**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / recordMap

# Function: recordMap()

> **recordMap**\<`A`, `B`\>(`fn`): (`cellItem`) => `Readonly`\<[`CellItem`](../interfaces/CellItem.md)\<`B`\>\>

## Type parameters

▪ **A** extends [`Value`](../type-aliases/Value.md)

▪ **B** extends [`Value`](../type-aliases/Value.md)

## Parameters

▪ **fn**: (`a`) => `Readonly`\<`Record`\<`string`, `B`\>\>

## Returns

`function`

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
> [Projects/clean-tool-app/src/lib/fp/CellItem.ts:25](https://github.com/yuckyh/clean-tool-app/)
>

## Source

[Projects/clean-tool-app/src/lib/fp/CellItem.ts:22](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
