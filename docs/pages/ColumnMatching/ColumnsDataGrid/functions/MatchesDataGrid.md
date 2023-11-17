**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [pages/ColumnMatching/ColumnsDataGrid](../README.md) / MatchesDataGrid

# Function: MatchesDataGrid()

> **MatchesDataGrid**(`props`): `Element`

This data grid provides the special column matching functionality.
It consists of 4 columns:
1. The original column names
2. The possible replacements
3. The matching visit number
4. The fuzzy search score

## Parameters

▪ **props**: `Readonly`\<[`Props`](../private/interfaces/Props.md)\>

The [props](../private/interfaces/Props.md) for the component.

## Returns

`Element`

A data grid for the user to match columns

## Example

```ts
<ColumnsDataGrid errorAlertRef={errorAlertRef} infoAlertRef={infoAlertRef} />
```

## Source

[Projects/clean-tool-app/src/pages/ColumnMatching/MatchesDataGrid.tsx:142](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
