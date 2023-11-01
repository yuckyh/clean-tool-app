# Module: features/columns/selectors

## Table of contents

### Functions

- [getColumnPath](../wiki/features.columns.selectors#getcolumnpath)
- [getColumnPaths](../wiki/features.columns.selectors#getcolumnpaths)
- [getDataType](../wiki/features.columns.selectors#getdatatype)
- [getFormattedColumn](../wiki/features.columns.selectors#getformattedcolumn)
- [getFormattedColumns](../wiki/features.columns.selectors#getformattedcolumns)
- [getIndices](../wiki/features.columns.selectors#getindices)
- [getMatchComparer](../wiki/features.columns.selectors#getmatchcomparer)
- [getMatchIndex](../wiki/features.columns.selectors#getmatchindex)
- [getMatchVisit](../wiki/features.columns.selectors#getmatchvisit)
- [getMatches](../wiki/features.columns.selectors#getmatches)
- [getScore](../wiki/features.columns.selectors#getscore)
- [getScoreComparer](../wiki/features.columns.selectors#getscorecomparer)
- [getScores](../wiki/features.columns.selectors#getscores)
- [getSearchedDataType](../wiki/features.columns.selectors#getsearcheddatatype)
- [getSearchedPos](../wiki/features.columns.selectors#getsearchedpos)
- [getShouldFormat](../wiki/features.columns.selectors#getshouldformat)
- [getVisitByMatchVisit](../wiki/features.columns.selectors#getvisitbymatchvisit)
- [getVisitsComparer](../wiki/features.columns.selectors#getvisitscomparer)

## Functions

### getColumnPath

▸ **getColumnPath**(`state`, `...params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

`string`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getColumnPaths

▸ **getColumnPaths**(`state`, `...params`): readonly `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [] |

#### Returns

readonly `string`[]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getDataType

▸ **getDataType**(`state`, `...params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

`string`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getFormattedColumn

▸ **getFormattedColumn**(`state`, `...params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

`string`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getFormattedColumns

▸ **getFormattedColumns**(`state`, `...params`): readonly `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [] |

#### Returns

readonly `string`[]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getIndices

▸ **getIndices**(`state`, `...params`): readonly readonly [`string`, `number`][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [] |

#### Returns

readonly readonly [`string`, `number`][]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getMatchComparer

▸ **getMatchComparer**(`state`, `...params`): (`a`: `number`, `b`: `number`) => `Ordering`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [] |

#### Returns

`fn`

▸ (`a`, `b`): `Ordering`

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number` |
| `b` | `number` |

##### Returns

`Ordering`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getMatchIndex

▸ **getMatchIndex**(`state`, `...params`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

`number`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getMatchVisit

▸ **getMatchVisit**(`state`, `...params`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

`number`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getMatches

▸ **getMatches**(`state`, `...params`): readonly `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

readonly `string`[]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getScore

▸ **getScore**(`state`, `...params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

`string`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getScoreComparer

▸ **getScoreComparer**(`state`, `...params`): (`a`: `number`, `b`: `number`) => `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [] |

#### Returns

`fn`

▸ (`a`, `b`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number` |
| `b` | `number` |

##### Returns

`number`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getScores

▸ **getScores**(`state`, `...params`): readonly `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

readonly `number`[]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getSearchedDataType

▸ **getSearchedDataType**(`state`, `...params`): [`DataType`](../wiki/features.columns.reducers#datatype)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_column: string, visit: string] |

#### Returns

[`DataType`](../wiki/features.columns.reducers#datatype)

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getSearchedPos

▸ **getSearchedPos**(`state`, `...params`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_column: string, visit: string] |

#### Returns

`number`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getShouldFormat

▸ **getShouldFormat**(`state`, `...params`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

`boolean`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getVisitByMatchVisit

▸ **getVisitByMatchVisit**(`state`, `...params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

`string`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getVisitsComparer

▸ **getVisitsComparer**(`state`, `...params`): (`a`: `number`, `b`: `number`) => `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [] |

#### Returns

`fn`

▸ (`a`, `b`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number` |
| `b` | `number` |

##### Returns

`number`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8
