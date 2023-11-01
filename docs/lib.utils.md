# Module: lib/utils

## Table of contents

### Functions

- [createLazyMemo](../wiki/lib.utils#createlazymemo)
- [createMemo](../wiki/lib.utils#creatememo)
- [noOpIO](../wiki/lib.utils#noopio)
- [noOpTask](../wiki/lib.utils#nooptask)

## Functions

### createLazyMemo

▸ **createLazyMemo**<`T`\>(`displayName`, `promise`): `MemoExoticComponent`<`LazyExoticComponent`<`ComponentType`<`T`\>\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `displayName` | `string` |
| `promise` | `Promise`<{ `default`: `ComponentType`<`T`\>  }\> |

#### Returns

`MemoExoticComponent`<`LazyExoticComponent`<`ComponentType`<`T`\>\>\>

#### Defined in

[Projects/clean-tool-app/src/lib/utils.ts:18](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/utils.ts#L18)

___

### createMemo

▸ **createMemo**<`T`\>(`displayName`, `component`): `MemoExoticComponent`<`ComponentType`<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `displayName` | `string` |
| `component` | `ComponentType`<`T`\> |

#### Returns

`MemoExoticComponent`<`ComponentType`<`T`\>\>

#### Defined in

[Projects/clean-tool-app/src/lib/utils.ts:7](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/utils.ts#L7)

___

### noOpIO

▸ **noOpIO**(): () => `void`

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

AppData/Local/Yarn/Berry/cache/fp-ts-npm-2.16.1-8deb3ec2d6-10.zip/node_modules/fp-ts/lib/IO.d.ts:33

___

### noOpTask

▸ **noOpTask**(): `Promise`<() => `void`\>

#### Returns

`Promise`<() => `void`\>

#### Defined in

AppData/Local/Yarn/Berry/cache/fp-ts-npm-2.16.1-8deb3ec2d6-10.zip/node_modules/fp-ts/lib/Task.d.ts:32
