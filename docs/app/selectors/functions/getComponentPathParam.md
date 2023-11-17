**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/selectors](../README.md) / getComponentPathParam

# Function: getComponentPathParam()

> **getComponentPathParam**(`_state`, `componentPath`): `string`

Utility function to get the component path parameter

## Parameters

▪ **\_state**: `object`

The application state [AppState](../../store/type-aliases/AppState.md)

▪ **\_state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **\_state.matches**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **componentPath**: `string`

The progress nav's component path in the router.

## Returns

`string`

The component path parameter

## Example

```ts
const getPaths = createSelector(
   [getComponentPathParam],
   (componentPath) =>
      ...
 )
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:103](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
