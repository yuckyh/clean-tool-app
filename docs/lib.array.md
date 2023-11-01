# Module: lib/array

## Table of contents

### Functions

- [getIndexedIndex](../wiki/lib.array#getindexedindex)
- [getIndexedValue](../wiki/lib.array#getindexedvalue)
- [head](../wiki/lib.array#head)
- [indexDuplicateSearcher](../wiki/lib.array#indexduplicatesearcher)
- [lookup](../wiki/lib.array#lookup)
- [stringLookup](../wiki/lib.array#stringlookup)

## Functions

### getIndexedIndex

▸ **getIndexedIndex**<`I`, `V`\>(`tuple`): `I`

Retrieves the index from an indexed tuple.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `I` | The index type. |
| `V` | The value type. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tuple` | readonly [`I`, `V`] | The indexed tuple. |

#### Returns

`I`

The index from the tuple.

#### Defined in

[Projects/clean-tool-app/src/lib/array.ts:49](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/array.ts#L49)

___

### getIndexedValue

▸ **getIndexedValue**<`I`, `V`\>(`tuple`): `V`

Retrieves the value from an indexed tuple.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `I` | The index type. |
| `V` | The value type. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tuple` | readonly [`I`, `V`] | The indexed tuple. |

#### Returns

`V`

The value from the tuple.

#### Defined in

[Projects/clean-tool-app/src/lib/array.ts:40](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/array.ts#L40)

___

### head

▸ **head**<`T`\>(`arr`): (`defaultValue`: `T`) => `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | readonly `T`[] |

#### Returns

`fn`

▸ (`defaultValue`): `T`

##### Parameters

| Name | Type |
| :------ | :------ |
| `defaultValue` | `T` |

##### Returns

`T`

#### Defined in

[Projects/clean-tool-app/src/lib/array.ts:29](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/array.ts#L29)

___

### indexDuplicateSearcher

▸ **indexDuplicateSearcher**<`T`, `U`\>(`indices`, `filterIndex`): readonly `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends readonly `U`[] |
| `U` | `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `indices` | readonly `T`[] |
| `filterIndex` | `T` |

#### Returns

readonly `T`[]

#### Defined in

[Projects/clean-tool-app/src/lib/array.ts:5](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/array.ts#L5)

___

### lookup

▸ **lookup**<`T`\>(`arr`): (`defaultValue`: `T`) => (`pos`: `number`) => `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | readonly `T`[] |

#### Returns

`fn`

▸ (`defaultValue`): (`pos`: `number`) => `T`

##### Parameters

| Name | Type |
| :------ | :------ |
| `defaultValue` | `T` |

##### Returns

`fn`

▸ (`pos`): `T`

##### Parameters

| Name | Type |
| :------ | :------ |
| `pos` | `number` |

##### Returns

`T`

#### Defined in

[Projects/clean-tool-app/src/lib/array.ts:23](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/array.ts#L23)

___

### stringLookup

▸ **stringLookup**(`arr`): (`pos`: `number`) => `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | readonly `string`[] |

#### Returns

`fn`

▸ (`pos`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `pos` | `number` |

##### Returns

`string`

#### Defined in

[Projects/clean-tool-app/src/lib/array.ts:19](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/array.ts#L19)
