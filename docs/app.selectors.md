# Module: app/selectors

## Table of contents

### Functions

- [getColParam](../wiki/app.selectors#getcolparam)
- [getColumnParam](../wiki/app.selectors#getcolumnparam)
- [getColumns](../wiki/app.selectors#getcolumns)
- [getData](../wiki/app.selectors#getdata)
- [getDataTypes](../wiki/app.selectors#getdatatypes)
- [getFlaggedCells](../wiki/app.selectors#getflaggedcells)
- [getMatchColumns](../wiki/app.selectors#getmatchcolumns)
- [getMatchVisits](../wiki/app.selectors#getmatchvisits)
- [getMatchesList](../wiki/app.selectors#getmatcheslist)
- [getProgress](../wiki/app.selectors#getprogress)
- [getReasonParam](../wiki/app.selectors#getreasonparam)
- [getRowParam](../wiki/app.selectors#getrowparam)
- [getScoresList](../wiki/app.selectors#getscoreslist)
- [getSheetName](../wiki/app.selectors#getsheetname)
- [getTitleParam](../wiki/app.selectors#gettitleparam)
- [getVisitParam](../wiki/app.selectors#getvisitparam)
- [getVisits](../wiki/app.selectors#getvisits)
- [searchPos](../wiki/app.selectors#searchpos)

## Functions

### getColParam

▸ **getColParam**(`_state`, `col`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_state` | `Object` |
| `_state.columns` | `Readonly`<`State`\> |
| `_state.progress` | `State` |
| `_state.sheet` | `State` |
| `col` | `number` |

#### Returns

`number`

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:11](https://github.com/yuckyh/clean-tool-app/)

___

### getColumnParam

▸ **getColumnParam**(`_state`, `column`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_state` | `Object` |
| `_state.columns` | `Readonly`<`State`\> |
| `_state.progress` | `State` |
| `_state.sheet` | `State` |
| `column` | `string` |

#### Returns

`string`

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:15](https://github.com/yuckyh/clean-tool-app/)

___

### getColumns

▸ **getColumns**(`«destructured»`): readonly `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

readonly `string`[]

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:38](https://github.com/yuckyh/clean-tool-app/)

___

### getData

▸ **getData**(`«destructured»`): readonly [`CellItem`](../wiki/types.utils#cellitem)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

readonly [`CellItem`](../wiki/types.utils#cellitem)[]

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:40](https://github.com/yuckyh/clean-tool-app/)

___

### getDataTypes

▸ **getDataTypes**(`«destructured»`): readonly [`DataType`](../wiki/features.columns.reducers#datatype)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

readonly [`DataType`](../wiki/features.columns.reducers#datatype)[]

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:52](https://github.com/yuckyh/clean-tool-app/)

___

### getFlaggedCells

▸ **getFlaggedCells**(`«destructured»`): readonly [`Flag`](../wiki/features.sheet.reducers#flag)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

readonly [`Flag`](../wiki/features.sheet.reducers#flag)[]

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:42](https://github.com/yuckyh/clean-tool-app/)

___

### getMatchColumns

▸ **getMatchColumns**(`«destructured»`): readonly `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

readonly `string`[]

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:44](https://github.com/yuckyh/clean-tool-app/)

___

### getMatchVisits

▸ **getMatchVisits**(`«destructured»`): readonly `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

readonly `number`[]

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:46](https://github.com/yuckyh/clean-tool-app/)

___

### getMatchesList

▸ **getMatchesList**(`«destructured»`): readonly readonly string[][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

readonly readonly string[][]

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:50](https://github.com/yuckyh/clean-tool-app/)

___

### getProgress

▸ **getProgress**(`«destructured»`): [`Progress`](../wiki/features.progress.reducers#progress)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

[`Progress`](../wiki/features.progress.reducers#progress)

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:32](https://github.com/yuckyh/clean-tool-app/)

___

### getReasonParam

▸ **getReasonParam**(`_state`, `_1`, `reason`): [`FlagReason`](../wiki/features.sheet.reducers#flagreason)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_state` | `Object` |
| `_state.columns` | `Readonly`<`State`\> |
| `_state.progress` | `State` |
| `_state.sheet` | `State` |
| `_1` | `string` |
| `reason` | [`FlagReason`](../wiki/features.sheet.reducers#flagreason) |

#### Returns

[`FlagReason`](../wiki/features.sheet.reducers#flagreason)

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:25](https://github.com/yuckyh/clean-tool-app/)

___

### getRowParam

▸ **getRowParam**(`_state`, `_col`, `row`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_state` | `Object` |
| `_state.columns` | `Readonly`<`State`\> |
| `_state.progress` | `State` |
| `_state.sheet` | `State` |
| `_col` | `number` |
| `row` | `number` |

#### Returns

`number`

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:13](https://github.com/yuckyh/clean-tool-app/)

___

### getScoresList

▸ **getScoresList**(`«destructured»`): readonly readonly number[][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

readonly readonly number[][]

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:48](https://github.com/yuckyh/clean-tool-app/)

___

### getSheetName

▸ **getSheetName**(`«destructured»`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

`string`

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:34](https://github.com/yuckyh/clean-tool-app/)

___

### getTitleParam

▸ **getTitleParam**(`_state`, `title`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_state` | `Object` |
| `_state.columns` | `Readonly`<`State`\> |
| `_state.progress` | `State` |
| `_state.sheet` | `State` |
| `title` | `string` |

#### Returns

`string`

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:23](https://github.com/yuckyh/clean-tool-app/)

___

### getVisitParam

▸ **getVisitParam**(`_state`, `_column`, `visit`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_state` | `Object` |
| `_state.columns` | `Readonly`<`State`\> |
| `_state.progress` | `State` |
| `_state.sheet` | `State` |
| `_column` | `string` |
| `visit` | `string` |

#### Returns

`string`

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:17](https://github.com/yuckyh/clean-tool-app/)

___

### getVisits

▸ **getVisits**(`«destructured»`): readonly `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `columns` | `Readonly`<`State`\> |
| › `progress` | `State` |
| › `sheet` | `State` |

#### Returns

readonly `string`[]

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:36](https://github.com/yuckyh/clean-tool-app/)

___

### searchPos

▸ **searchPos**(`indices`, `visits`, `searchColumn`, `searchVisit`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `indices` | readonly readonly [`string`, `number`][] |
| `visits` | readonly `string`[] |
| `searchColumn` | `string` |
| `searchVisit` | `string` |

#### Returns

`number`

#### Defined in

[Projects/clean-tool-app/src/app/selectors.ts:54](https://github.com/yuckyh/clean-tool-app/)
