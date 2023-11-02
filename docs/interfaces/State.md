**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / State

# Interface: State

The state struct for the sheet slice.

This typically contains the information for the sheet.

## Contents

- [See](State.md#see)
- [Properties](State.md#properties)
  - [bookType](State.md#booktype)
  - [data](State.md#data)
  - [fileName](State.md#filename)
  - [flaggedCells](State.md#flaggedcells)
  - [originalColumns](State.md#originalcolumns)
  - [sheetName](State.md#sheetname)
  - [sheetNames](State.md#sheetnames)
  - [visits](State.md#visits)

## See

[sheetSlice]([object Object])

## Properties

### bookType

> **bookType**?: `BookType`

The type of the workbook. This determines whether to show the sheet picker input in the case of using a csv file.

#### Source

[Projects/clean-tool-app/src/features/sheet/reducers.ts:37](https://github.com/yuckyh/clean-tool-app/)

***

### data

> **data**: readonly [`CellItem`](../type-aliases/CellItem.md)[]

The data from the selected sheet. The data is a list of records with keys as the column names.

#### Source

[Projects/clean-tool-app/src/features/sheet/reducers.ts:41](https://github.com/yuckyh/clean-tool-app/)

***

### fileName

> **fileName**: `string`

The name of the file.

#### Source

[Projects/clean-tool-app/src/features/sheet/reducers.ts:45](https://github.com/yuckyh/clean-tool-app/)

***

### flaggedCells

> **flaggedCells**: readonly [`Flag`](../type-aliases/Flag.md)[]

The list of flagged cells.

#### Source

[Projects/clean-tool-app/src/features/sheet/reducers.ts:49](https://github.com/yuckyh/clean-tool-app/)

***

### originalColumns

> **originalColumns**: readonly `string`[]

The list of original column names.

#### Source

[Projects/clean-tool-app/src/features/sheet/reducers.ts:53](https://github.com/yuckyh/clean-tool-app/)

***

### sheetName

> **sheetName**: `string`

The name of the selected sheet.

#### Source

[Projects/clean-tool-app/src/features/sheet/reducers.ts:57](https://github.com/yuckyh/clean-tool-app/)

***

### sheetNames

> **sheetNames**: readonly `string`[]

#### Source

[Projects/clean-tool-app/src/features/sheet/reducers.ts:58](https://github.com/yuckyh/clean-tool-app/)

***

### visits

> **visits**: readonly `string`[]

#### Source

[Projects/clean-tool-app/src/features/sheet/reducers.ts:59](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
