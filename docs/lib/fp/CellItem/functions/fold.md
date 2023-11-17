**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/CellItem](../README.md) / fold

# Function: fold()

> **fold**\<`A`, `T`\>(`fn`): (`cellItem`) => `T`

The function to fold a cell item.

## Type parameters

▪ **A** extends [`Value`](../type-aliases/Value.md)

▪ **T**

## Parameters

▪ **fn**: (`a`) => `T`

The function that converts the value of the cell item.

## Returns

`function`

The converted value.

> > (`cellItem`): `T`
>
> ### Parameters
>
> ▪ **cellItem**: `Readonly`\<[`CellItem`](../interfaces/CellItem.md)\<`A`\>\>
>
> ### Returns
>
> `T`
>
> ### Source
>
> [Projects/clean-tool-app/src/lib/fp/CellItem.ts:78](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
const value = fold((x) => x['a'])(cellItem)
```

## Source

[Projects/clean-tool-app/src/lib/fp/CellItem.ts:77](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
