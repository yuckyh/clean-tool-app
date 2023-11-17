**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/CellItem](../README.md) / CellItem

# Interface: CellItem`<V>`

A cell item is a record of string keys and values.

## Contents

- [Type parameters](CellItem.md#type-parameters)
- [Properties](CellItem.md#properties)
  - [\_tag](CellItem.md#tag)
  - [value](CellItem.md#value)

## Type parameters

▪ **V** extends [`Value`](../type-aliases/Value.md) = [`Value`](../type-aliases/Value.md)

## Properties

### \_tag

> **`readonly`** **\_tag**: `"CellItem"`

The tag for the cell item HKT.

#### Source

[Projects/clean-tool-app/src/lib/fp/CellItem.ts:22](https://github.com/yuckyh/clean-tool-app/)

***

### value

> **value**: `Readonly`\<`Record`\<`string`, `V`\>\>

The value of the cell item.

#### Source

[Projects/clean-tool-app/src/lib/fp/CellItem.ts:26](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
