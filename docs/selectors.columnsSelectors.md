# Module: selectors/columnsSelectors

## Table of contents

### Functions

- [getColumn](../wiki/selectors.columnsSelectors#getcolumn)
- [getColumnComparer](../wiki/selectors.columnsSelectors#getcolumncomparer)
- [getColumnDuplicates](../wiki/selectors.columnsSelectors#getcolumnduplicates)
- [getColumnDuplicatesList](../wiki/selectors.columnsSelectors#getcolumnduplicateslist)
- [getColumnsLength](../wiki/selectors.columnsSelectors#getcolumnslength)
- [getMatchColumn](../wiki/selectors.columnsSelectors#getmatchcolumn)

## Functions

### getColumn

▸ **getColumn**(`state`, `...params`): `string`

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

### getColumnComparer

▸ **getColumnComparer**(`state`, `...params`): (`posA`: `number`, `posB`: `number`) => `Ordering`

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

▸ (`posA`, `posB`): `Ordering`

##### Parameters

| Name | Type |
| :------ | :------ |
| `posA` | `number` |
| `posB` | `number` |

##### Returns

`Ordering`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getColumnDuplicates

▸ **getColumnDuplicates**(`state`, `...params`): readonly readonly string[][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [col: number] |

#### Returns

readonly readonly string[][]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getColumnDuplicatesList

▸ **getColumnDuplicatesList**(`state`, `...params`): readonly readonly (readonly string[])[][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [] |

#### Returns

readonly readonly (readonly string[])[][]

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getColumnsLength

▸ **getColumnsLength**(`state`, `...params`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.columns` | `Readonly`<`State`\> |
| `state.progress` | `State` |
| `state.sheet` | `State` |
| `...params` | [] |

#### Returns

`number`

#### Defined in

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node_modules/reselect/es/types.d.ts:8

___

### getMatchColumn

▸ **getMatchColumn**(`state`, `...params`): `string`

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
