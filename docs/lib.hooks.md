# Module: lib/hooks

## Table of contents

### Functions

- [useAppDispatch](../wiki/lib.hooks#useappdispatch)
- [useAppSelector](../wiki/lib.hooks#useappselector)
- [useDebounced](../wiki/lib.hooks#usedebounced)
- [useGlobalStyles](../wiki/lib.hooks#useglobalstyles)
- [useLoadingTransition](../wiki/lib.hooks#useloadingtransition)
- [useStorage](../wiki/lib.hooks#usestorage)
- [useSyncedSelectionHandler](../wiki/lib.hooks#usesyncedselectionhandler)
- [useThemePreference](../wiki/lib.hooks#usethemepreference)
- [useTokenToHex](../wiki/lib.hooks#usetokentohex)

## Functions

### useAppDispatch

▸ **useAppDispatch**(): `ThunkDispatch`<{ `columns`: `Readonly`<`State`\> ; `progress`: `State` ; `sheet`: `State`  }, `undefined`, `AnyAction`\> & `Dispatch`<`AnyAction`\>

#### Returns

`ThunkDispatch`<{ `columns`: `Readonly`<`State`\> ; `progress`: `State` ; `sheet`: `State`  }, `undefined`, `AnyAction`\> & `Dispatch`<`AnyAction`\>

#### Defined in

[Projects/clean-tool-app/src/lib/hooks.ts:36](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/hooks.ts#L36)

___

### useAppSelector

▸ **useAppSelector**<`TSelected`\>(`selector`, `equalityFn?`): `TSelected`

#### Type parameters

| Name |
| :------ |
| `TSelected` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | (`state`: { `columns`: `Readonly`<`State`\> ; `progress`: `State` ; `sheet`: `State`  }) => `TSelected` |
| `equalityFn?` | `EqualityFn`<`NoInfer`<`TSelected`\>\> |

#### Returns

`TSelected`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/react-redux-virtual-277aa6bf95/3/AppData/Local/Yarn/Berry/cache/react-redux-npm-8.1.3-1c8300c001-10.zip/node_modules/react-redux/es/types.d.ts:76

▸ **useAppSelector**<`Selected`\>(`selector`, `options?`): `Selected`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Selected` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | (`state`: { `columns`: `Readonly`<`State`\> ; `progress`: `State` ; `sheet`: `State`  }) => `Selected` |
| `options?` | `UseSelectorOptions`<`Selected`\> |

#### Returns

`Selected`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/react-redux-virtual-277aa6bf95/3/AppData/Local/Yarn/Berry/cache/react-redux-npm-8.1.3-1c8300c001-10.zip/node_modules/react-redux/es/types.d.ts:77

___

### useDebounced

▸ **useDebounced**<`T`\>(`value`, `delay?`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `T` | `undefined` |
| `delay` | `number` | `100` |

#### Returns

`T`

#### Defined in

[Projects/clean-tool-app/src/lib/hooks.ts:39](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/hooks.ts#L39)

___

### useGlobalStyles

▸ **useGlobalStyles**(): `void`

#### Returns

`void`

#### Defined in

Projects/clean-tool-app/.yarn/__virtual__/@griffel-react-virtual-f92dbd0a4c/3/AppData/Local/Yarn/Berry/cache/@griffel-react-npm-1.5.16-35554db5c8-10.zip/node_modules/@griffel/react/src/makeStaticStyles.d.ts:2

___

### useLoadingTransition

▸ **useLoadingTransition**(): readonly [`boolean`, `IO`<`void`\>]

#### Returns

readonly [`boolean`, `IO`<`void`\>]

#### Defined in

AppData/Local/Yarn/Berry/cache/fp-ts-npm-2.16.1-8deb3ec2d6-10.zip/node_modules/fp-ts/lib/IO.d.ts:33

___

### useStorage

▸ **useStorage**(): `void`

#### Returns

`void`

#### Defined in

[Projects/clean-tool-app/src/lib/hooks.ts:113](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/hooks.ts#L113)

___

### useSyncedSelectionHandler

▸ **useSyncedSelectionHandler**(`reason`, `title`, `series`): (`e`: `MouseEvent`<`Element`, `MouseEvent`\> \| `KeyboardEvent`<`Element`\>, `data`: `OnSelectionChangeData`) => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason` | [`FlagReason`](../wiki/features.sheet.reducers#flagreason) |
| `title` | `string` |
| `series` | readonly readonly [`string`, `string` \| `number`][] |

#### Returns

`fn`

▸ (`e`, `data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `MouseEvent`<`Element`, `MouseEvent`\> \| `KeyboardEvent`<`Element`\> |
| `data` | `OnSelectionChangeData` |

##### Returns

`void`

#### Defined in

[Projects/clean-tool-app/src/lib/hooks.ts:126](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/hooks.ts#L126)

___

### useThemePreference

▸ **useThemePreference**(`dark?`, `light?`): `Theme`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dark` | `Theme` | `webDarkTheme` |
| `light` | `Theme` | `webLightTheme` |

#### Returns

`Theme`

#### Defined in

[Projects/clean-tool-app/src/lib/hooks.ts:70](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/hooks.ts#L70)

___

### useTokenToHex

▸ **useTokenToHex**(`token`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

`string`

#### Defined in

[Projects/clean-tool-app/src/lib/hooks.ts:92](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/lib/hooks.ts#L92)
