# Module: features/sheet/reducers

## Table of contents

### Type Aliases

- [Flag](../wiki/features.sheet.reducers#flag)
- [FlagReason](../wiki/features.sheet.reducers#flagreason)

### Functions

- [deleteVisits](../wiki/features.sheet.reducers#deletevisits)
- [saveSheetState](../wiki/features.sheet.reducers#savesheetstate)
- [setSheetName](../wiki/features.sheet.reducers#setsheetname)
- [setVisit](../wiki/features.sheet.reducers#setvisit)
- [syncFlaggedCells](../wiki/features.sheet.reducers#syncflaggedcells)
- [syncVisits](../wiki/features.sheet.reducers#syncvisits)

## Type Aliases

### Flag

Ƭ **Flag**: readonly [`string`, `string`, [`FlagReason`](../wiki/features.sheet.reducers#flagreason)]

#### Defined in

[Projects/clean-tool-app/src/features/sheet/reducers.ts:23](https://github.com/yuckyh/clean-tool-app/)

___

### FlagReason

Ƭ **FlagReason**: ``"incorrect"`` \| ``"missing"`` \| ``"outlier"`` \| ``"suspected"``

#### Defined in

[Projects/clean-tool-app/src/features/sheet/reducers.ts:21](https://github.com/yuckyh/clean-tool-app/)

## Functions

### deleteVisits

▸ **deleteVisits**(`noArgument`): `Object`

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

### saveSheetState

▸ **saveSheetState**(`noArgument`): `Object`

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

### setSheetName

▸ **setSheetName**(`payload`): `Object`

Calling this redux#ActionCreator with an argument will
return a PayloadAction of type `T` with a payload of `P`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `string` |

#### Returns

`Object`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAction.d.ts:123

___

### setVisit

▸ **setVisit**(`payload`): `Object`

Calling this redux#ActionCreator with an argument will
return a PayloadAction of type `T` with a payload of `P`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `Object` |
| `payload.pos` | `number` |
| `payload.visit` | `string` |

#### Returns

`Object`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAction.d.ts:123

___

### syncFlaggedCells

▸ **syncFlaggedCells**(`payload`): `Object`

Calling this redux#ActionCreator with an argument will
return a PayloadAction of type `T` with a payload of `P`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`Flag`](../wiki/features.sheet.reducers#flag) |

#### Returns

`Object`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAction.d.ts:123

___

### syncVisits

▸ **syncVisits**(`payload`): `Object`

Calling this redux#ActionCreator with an argument will
return a PayloadAction of type `T` with a payload of `P`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `number` |

#### Returns

`Object`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAction.d.ts:123
