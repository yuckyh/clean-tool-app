# Module: lib/logger

## Table of contents

### Functions

- [dump](../wiki/lib.logger#dump)
- [dumpError](../wiki/lib.logger#dumperror)
- [dumpName](../wiki/lib.logger#dumpname)
- [dumpTrace](../wiki/lib.logger#dumptrace)
- [ioDump](../wiki/lib.logger#iodump)
- [ioDumpError](../wiki/lib.logger#iodumperror)
- [ioDumpName](../wiki/lib.logger#iodumpname)
- [ioDumpTrace](../wiki/lib.logger#iodumptrace)
- [useLoggerEffect](../wiki/lib.logger#useloggereffect)

## Functions

### dump

▸ **dump**<`T`\>(`arg`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `T` |

#### Returns

`T`

#### Defined in

[Projects/clean-tool-app/src/lib/logger.ts:38](https://github.com/yuckyh/clean-tool-app/)

___

### dumpError

▸ **dumpError**<`E`\>(`err`): `void`

#### Type parameters

| Name |
| :------ |
| `E` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `E` |

#### Returns

`void`

#### Defined in

[Projects/clean-tool-app/src/lib/logger.ts:32](https://github.com/yuckyh/clean-tool-app/)

___

### dumpName

▸ **dumpName**<`T`\>(`obj`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `Readonly`<`Record`<`string`, `T`\>\> |

#### Returns

`T`

#### Defined in

[Projects/clean-tool-app/src/lib/logger.ts:58](https://github.com/yuckyh/clean-tool-app/)

___

### dumpTrace

▸ **dumpTrace**<`T`\>(`arg`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `T` |

#### Returns

`T`

#### Defined in

[Projects/clean-tool-app/src/lib/logger.ts:24](https://github.com/yuckyh/clean-tool-app/)

___

### ioDump

▸ **ioDump**<`A`\>(`a`): `IO`<`void`\>

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `A` |

#### Returns

`IO`<`void`\>

**`Since`**

2.0.0

#### Defined in

AppData/Local/Yarn/Berry/cache/fp-ts-npm-2.16.1-8deb3ec2d6-10.zip/node_modules/fp-ts/lib/Console.d.ts:8

___

### ioDumpError

▸ **ioDumpError**<`E`\>(`err`): `IO`<`void`\>

#### Type parameters

| Name |
| :------ |
| `E` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `E` |

#### Returns

`IO`<`void`\>

#### Defined in

[Projects/clean-tool-app/src/lib/logger.ts:30](https://github.com/yuckyh/clean-tool-app/)

___

### ioDumpName

▸ **ioDumpName**<`T`\>(`obj`): `IO`<readonly `T`[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `Readonly`<`Record`<`string`, `T`\>\> |

#### Returns

`IO`<readonly `T`[]\>

#### Defined in

[Projects/clean-tool-app/src/lib/logger.ts:43](https://github.com/yuckyh/clean-tool-app/)

___

### ioDumpTrace

▸ **ioDumpTrace**<`T`\>(`arg`): `IO`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `T` |

#### Returns

`IO`<`T`\>

#### Defined in

[Projects/clean-tool-app/src/lib/logger.ts:10](https://github.com/yuckyh/clean-tool-app/)

___

### useLoggerEffect

▸ **useLoggerEffect**<`T`\>(`dep`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `dep` | `Record`<`string`, `T`\> |

#### Returns

`void`

#### Defined in

[Projects/clean-tool-app/src/lib/logger.ts:62](https://github.com/yuckyh/clean-tool-app/)
