# Module: types/utils

## Table of contents

### Type Aliases

- [AnyArray](../wiki/types.utils#anyarray)
- [ArrayElement](../wiki/types.utils#arrayelement)
- [AsArray](../wiki/types.utils#asarray)
- [CellItem](../wiki/types.utils#cellitem)
- [Column](../wiki/types.utils#column)
- [ExcludeFirst](../wiki/types.utils#excludefirst)
- [IsArray](../wiki/types.utils#isarray)
- [Prettify](../wiki/types.utils#prettify)
- [Primitive](../wiki/types.utils#primitive)
- [Property](../wiki/types.utils#property)
- [ToArray](../wiki/types.utils#toarray)

## Type Aliases

### AnyArray

Ƭ **AnyArray**: readonly `unknown`[]

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:17](https://github.com/yuckyh/clean-tool-app/)

___

### ArrayElement

Ƭ **ArrayElement**<`T`\>: `T` extends readonly infer U[] ? `U` : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AnyArray`](../wiki/types.utils#anyarray) |

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:21](https://github.com/yuckyh/clean-tool-app/)

___

### AsArray

Ƭ **AsArray**<`T`\>: `T` extends readonly `unknown`[] ? `T` : `T`[] \| readonly `T`[]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:15](https://github.com/yuckyh/clean-tool-app/)

___

### CellItem

Ƭ **CellItem**: `Record`<[`Column`](../wiki/types.utils#column), `string`\>

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:29](https://github.com/yuckyh/clean-tool-app/)

___

### Column

Ƭ **Column**: `number` \| `string`

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:30](https://github.com/yuckyh/clean-tool-app/)

___

### ExcludeFirst

Ƭ **ExcludeFirst**<`A`\>: `A` extends [`unknown`, ...(infer U)] ? `U` : `never`

#### Type parameters

| Name |
| :------ |
| `A` |

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:25](https://github.com/yuckyh/clean-tool-app/)

___

### IsArray

Ƭ **IsArray**<`T`\>: `T` extends `unknown`[] ? `T` : `T` extends readonly `unknown`[] ? `T` : `never`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:9](https://github.com/yuckyh/clean-tool-app/)

___

### Prettify

Ƭ **Prettify**<`T`\>: { [K in keyof T]: T[K] }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:3](https://github.com/yuckyh/clean-tool-app/)

___

### Primitive

Ƭ **Primitive**: `boolean` \| `number` \| `string`

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:7](https://github.com/yuckyh/clean-tool-app/)

___

### Property

Ƭ **Property**<`T`\>: `T`[keyof `T`]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:1](https://github.com/yuckyh/clean-tool-app/)

___

### ToArray

Ƭ **ToArray**<`T`\>: readonly `T`[]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[Projects/clean-tool-app/src/types/utils.d.ts:19](https://github.com/yuckyh/clean-tool-app/)
