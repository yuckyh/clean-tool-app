# Module: features/sheet/selectors

## Table of contents

### Functions

- [getCell](../wiki/features.sheet.selectors#getcell)
- [getFlaggedRows](../wiki/features.sheet.selectors#getflaggedrows)
- [getFormattedSheet](../wiki/features.sheet.selectors#getformattedsheet)
- [getFormattedWorkbook](../wiki/features.sheet.selectors#getformattedworkbook)
- [getIndexRow](../wiki/features.sheet.selectors#getindexrow)
- [getIndexedNumericalRow](../wiki/features.sheet.selectors#getindexednumericalrow)
- [getIndexedRow](../wiki/features.sheet.selectors#getindexedrow)
- [getIndexedRowIncorrects](../wiki/features.sheet.selectors#getindexedrowincorrects)
- [getIndexedRowMissings](../wiki/features.sheet.selectors#getindexedrowmissings)
- [getNotOutliers](../wiki/features.sheet.selectors#getnotoutliers)
- [getOutliers](../wiki/features.sheet.selectors#getoutliers)
- [getRow](../wiki/features.sheet.selectors#getrow)
- [getVisit](../wiki/features.sheet.selectors#getvisit)

## Functions

### getCell

▸ **getCell**(`state`, `...params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_col: number, row: number] |

#### Returns

`string`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getFlaggedRows

▸ **getFlaggedRows**(`state`, `...params`): `ReadonlySet`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_1: string, reason: FlagReason] |

#### Returns

`ReadonlySet`<`string`\>

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getFormattedSheet

▸ **getFormattedSheet**(`state`, `...params`): `WorkSheet`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [] |

#### Returns

`WorkSheet`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getFormattedWorkbook

▸ **getFormattedWorkbook**(`state`, `...params`): `WorkBook`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [] |

#### Returns

`WorkBook`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getIndexRow

▸ **getIndexRow**(`state`, `...params`): readonly `string`[]

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

### getIndexedNumericalRow

▸ **getIndexedNumericalRow**(`state`, `...params`): readonly readonly [`string`, `number`][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_column: string, visit: string] |

#### Returns

readonly readonly [`string`, `number`][]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getIndexedRow

▸ **getIndexedRow**(`state`, `...params`): readonly readonly [`string`, `string`][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_column: string, visit: string] |

#### Returns

readonly readonly [`string`, `string`][]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getIndexedRowIncorrects

▸ **getIndexedRowIncorrects**(`state`, `...params`): readonly readonly [`string`, `string`][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_column: string, visit: string] |

#### Returns

readonly readonly [`string`, `string`][]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getIndexedRowMissings

▸ **getIndexedRowMissings**(`state`, `...params`): readonly readonly [`string`, `string`][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_column: string, visit: string] |

#### Returns

readonly readonly [`string`, `string`][]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getNotOutliers

▸ **getNotOutliers**(`state`, `...params`): readonly readonly [`string`, `number`][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_column: string, visit: string] |

#### Returns

readonly readonly [`string`, `number`][]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getOutliers

▸ **getOutliers**(`state`, `...params`): readonly readonly [`string`, `number`][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_column: string, visit: string] |

#### Returns

readonly readonly [`string`, `number`][]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getRow

▸ **getRow**(`state`, `...params`): readonly `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [\_column: string, visit: string] |

#### Returns

readonly `string`[]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getVisit

▸ **getVisit**(`state`, `...params`): `string`

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
