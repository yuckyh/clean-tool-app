# Module: lib/fp

## Table of contents

### Variables

- [FlagEq](../wiki/lib.fp#flageq)
- [FlagOrd](../wiki/lib.fp#flagord)

### Functions

- [asIO](../wiki/lib.fp#asio)
- [asTask](../wiki/lib.fp#astask)
- [equals](../wiki/lib.fp#equals)
- [isCorrectNumber](../wiki/lib.fp#iscorrectnumber)
- [length](../wiki/lib.fp#length)
- [numEquals](../wiki/lib.fp#numequals)
- [promisedTask](../wiki/lib.fp#promisedtask)
- [promisedTaskOption](../wiki/lib.fp#promisedtaskoption)
- [strEquals](../wiki/lib.fp#strequals)
- [stubEq](../wiki/lib.fp#stubeq)
- [toString](../wiki/lib.fp#tostring)
- [typedEq](../wiki/lib.fp#typedeq)
- [typedIdentity](../wiki/lib.fp#typedidentity)

## Variables

### FlagEq

• `Const` **FlagEq**: `Eq.Eq`<[`Flag`](../wiki/features.sheet.reducers#flag)\>

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:58](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L58)

___

### FlagOrd

• `Const` **FlagOrd**: `Ord.Ord`<[`Flag`](../wiki/features.sheet.reducers#flag)\>

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:59](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L59)

## Functions

### asIO

▸ **asIO**<`As`, `V`\>(`fn`): `IO`<`V`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `As` | extends readonly `unknown`[] |
| `V` | `V` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (...`args`: `As`) => `V` |

#### Returns

`IO`<`V`\>

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:34](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L34)

___

### asTask

▸ **asTask**<`As`, `V`\>(`fn`): `Task`<`V`\>

Converts a function that returns a promise into a task.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `As` | extends readonly `unknown`[] |
| `V` | `V` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (...`args`: `As`) => `Promise`<`V`\> | The function that makes a promise. |

#### Returns

`Task`<`V`\>

A task representing the function.

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:30](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L30)

___

### equals

▸ **equals**<`V`\>(`eq`): (`x`: `V`) => `Predicate`<`V`\>

#### Type parameters

| Name |
| :------ |
| `V` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eq` | `Eq`<`V`\> |

#### Returns

`fn`

▸ (`x`): `Predicate`<`V`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `V` |

##### Returns

`Predicate`<`V`\>

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:65](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L65)

___

### isCorrectNumber

▸ **isCorrectNumber**(`val`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `string` |

#### Returns

`boolean`

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:44](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L44)

___

### length

▸ **length**<`V`, `K`\>(`arrLike`): `number`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `V` | extends `string` \| `ArrayLike`<`K`\> |
| `K` | `K` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arrLike` | `V` |

#### Returns

`number`

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:61](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L61)

___

### numEquals

▸ **numEquals**(`num`): (`other`: `number`) => `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | `number` |

#### Returns

`fn`

▸ (`other`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `number` |

##### Returns

`boolean`

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:41](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L41)

___

### promisedTask

▸ **promisedTask**<`V`\>(`promise`): () => `Promise`<`V`\>

#### Type parameters

| Name |
| :------ |
| `V` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `promise` | `Promise`<`V`\> |

#### Returns

`fn`

▸ (): `Promise`<`V`\>

##### Returns

`Promise`<`V`\>

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:14](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L14)

___

### promisedTaskOption

▸ **promisedTaskOption**<`V`\>(`...a`): `TaskOption`<`V`\>

Converts a promise into a task option.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...a` | [promise: Promise<V\>] |

#### Returns

`TaskOption`<`V`\>

A task option representing the promise.

#### Defined in

AppData/Local/Yarn/Berry/cache/fp-ts-npm-2.16.1-8deb3ec2d6-10.zip/node_modules/fp-ts/lib/function.d.ts:166

___

### strEquals

▸ **strEquals**(`str`): (`other`: `string`) => `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`fn`

▸ (`other`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `string` |

##### Returns

`boolean`

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:38](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L38)

___

### stubEq

▸ **stubEq**<`V`\>(): `Eq`<`V`\>

#### Type parameters

| Name |
| :------ |
| `V` |

#### Returns

`Eq`<`V`\>

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:51](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L51)

___

### toString

▸ **toString**<`V`\>(`val`): `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `V` | extends `string` \| `number` \| `boolean` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `V` |

#### Returns

`string`

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:47](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L47)

___

### typedEq

▸ **typedEq**<`V`, `K`\>(`eq`): `Eq`<`V`\>

#### Type parameters

| Name |
| :------ |
| `V` |
| `K` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eq` | `Eq`<`K`\> |

#### Returns

`Eq`<`V`\>

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:55](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L55)

___

### typedIdentity

▸ **typedIdentity**<`V`\>(`val`): `V`

#### Type parameters

| Name |
| :------ |
| `V` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `unknown` |

#### Returns

`V`

#### Defined in

[Projects/clean-tool-app/src/lib/fp.ts:56](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/fp.ts#L56)
