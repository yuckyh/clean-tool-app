# Module: app/store

## Table of contents

### Type Aliases

- [AppDispatch](../wiki/app.store#appdispatch)
- [RootState](../wiki/app.store#rootstate)

### Variables

- [default](../wiki/app.store#default)

## Type Aliases

### AppDispatch

Ƭ **AppDispatch**: typeof `store.dispatch`

#### Defined in

[Projects/clean-tool-app/src/app/store.ts:11](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/app/store.ts#L11)

___

### RootState

Ƭ **RootState**: `ReturnType`<typeof `store.getState`\>

#### Defined in

[Projects/clean-tool-app/src/app/store.ts:10](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/app/store.ts#L10)

## Variables

### default

• `Const` **default**: `ToolkitStore`<{ `columns`: `Readonly`<`State`\> ; `progress`: `State` ; `sheet`: `State`  }, `AnyAction`, [`ThunkMiddleware`<{ `columns`: `Readonly`<`State`\> ; `progress`: `State` ; `sheet`: `State`  }, `AnyAction`\>]\>

#### Defined in

[Projects/clean-tool-app/src/app/store.ts:6](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/app/store.ts#L6)
