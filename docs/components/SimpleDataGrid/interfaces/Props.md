**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [components/SimpleDataGrid](../README.md) / Props

# Interface: Props`<T>`

The props for [SimpleDataGrid](../functions/SimpleDataGrid.md).

## Contents

- [Extends](Props.md#extends)
- [Type parameters](Props.md#type-parameters)
- [Properties](Props.md#properties)
  - [columns](Props.md#columns)
  - [items](Props.md#items)

## Extends

- `Partial`\<`Omit`\<`DataGridProps`, `"columns"` \| `"items"`\>\>

## Type parameters

▪ **T**

The type of the items.

## Properties

### columns

> **columns**: readonly `TableColumnDefinition`\<`T`\>[]

The columns definitions of the data grid made using createTableColumn.

#### Source

[Projects/clean-tool-app/src/components/SimpleDataGrid.tsx:60](https://github.com/yuckyh/clean-tool-app/)

***

### items

> **items**: readonly `T`[]

The items to display in the data grid.

#### Source

[Projects/clean-tool-app/src/components/SimpleDataGrid.tsx:64](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
