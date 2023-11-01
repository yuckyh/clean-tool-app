# Module: features/sheet/actions

## Table of contents

### Variables

- [sliceName](../wiki/features.sheet.actions#slicename)

### Functions

- [deleteSheet](../wiki/features.sheet.actions#deletesheet)
- [fetchSheet](../wiki/features.sheet.actions#fetchsheet)
- [postFile](../wiki/features.sheet.actions#postfile)

## Variables

### sliceName

• `Const` **sliceName**: ``"sheet"``

#### Defined in

[Projects/clean-tool-app/src/features/sheet/actions.ts:11](https://github.com/yuckyh/clean-tool-app/)

## Functions

### deleteSheet

▸ **deleteSheet**(): `AsyncThunkAction`<`void`, `void`, `AsyncThunkConfig`\>

#### Returns

`AsyncThunkAction`<`void`, `void`, `AsyncThunkConfig`\>

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAsyncThunk.d.ts:108

___

### fetchSheet

▸ **fetchSheet**(): `AsyncThunkAction`<{ `SheetNames`: `undefined` \| `string`[] = workbook.SheetNames; `Sheets`: `undefined` \| { `[sheet: string]`: `WorkSheet`;  } = workbook.Sheets; `bookType`: `undefined` \| `BookType` = workbook.bookType; `fileName`: `string`  }, `void`, `AsyncThunkConfig`\>

#### Returns

`AsyncThunkAction`<{ `SheetNames`: `undefined` \| `string`[] = workbook.SheetNames; `Sheets`: `undefined` \| { `[sheet: string]`: `WorkSheet`;  } = workbook.Sheets; `bookType`: `undefined` \| `BookType` = workbook.bookType; `fileName`: `string`  }, `void`, `AsyncThunkConfig`\>

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAsyncThunk.d.ts:108

___

### postFile

▸ **postFile**(`arg`): `AsyncThunkAction`<`string`, `File`, `AsyncThunkConfig`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `File` |

#### Returns

`AsyncThunkAction`<`string`, `File`, `AsyncThunkConfig`\>

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node_modules/@reduxjs/toolkit/dist/createAsyncThunk.d.ts:108
