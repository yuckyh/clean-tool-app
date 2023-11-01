# Module: features/columns/reducers

## Table of contents

### Interfaces

- [ColumnMatch](../wiki/features.columns.reducers.ColumnMatch)

### Type Aliases

- [DataType](../wiki/features.columns.reducers#datatype)

### Functions

- [deleteColumns](../wiki/features.columns.reducers#deletecolumns)
- [saveColumnState](../wiki/features.columns.reducers#savecolumnstate)
- [setDataType](../wiki/features.columns.reducers#setdatatype)
- [setMatchColumn](../wiki/features.columns.reducers#setmatchcolumn)
- [setMatchVisit](../wiki/features.columns.reducers#setmatchvisit)

## Type Aliases

### DataType

Ƭ **DataType**: ``"categorical"`` \| ``"numerical"``

#### Defined in

[Projects/clean-tool-app/src/features/columns/reducers.ts:23](https://github.com/yuckyh/clean-tool-app/)

## Functions

### deleteColumns

▸ **deleteColumns**(`noArgument`): `Object`

Calling this redux#ActionCreator will
return a PayloadAction of type `T` with a payload of `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `noArgument` | `void` |

#### Returns

`Object`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAction.d.ts:109

___

### saveColumnState

▸ **saveColumnState**(`noArgument`): `Object`

Calling this redux#ActionCreator will
return a PayloadAction of type `T` with a payload of `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `noArgument` | `void` |

#### Returns

`Object`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAction.d.ts:109

___

### setDataType

▸ **setDataType**(`payload`): `Object`

Calling this redux#ActionCreator with an argument will
return a PayloadAction of type `T` with a payload of `P`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `Object` |
| `payload.dataType` | [`DataType`](../wiki/features.columns.reducers#datatype) |
| `payload.pos` | `number` |

#### Returns

`Object`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAction.d.ts:123

___

### setMatchColumn

▸ **setMatchColumn**(`payload`): `Object`

Calling this redux#ActionCreator with an argument will
return a PayloadAction of type `T` with a payload of `P`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `Object` |
| `payload.matchColumn` | `string` |
| `payload.pos` | `number` |

#### Returns

`Object`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAction.d.ts:123

___

### setMatchVisit

▸ **setMatchVisit**(`payload`): `Object`

Calling this redux#ActionCreator with an argument will
return a PayloadAction of type `T` with a payload of `P`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `Object` |
| `payload.matchVisit` | `number` |
| `payload.pos` | `number` |

#### Returns

`Object`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAction.d.ts:123
