**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/selectors](../README.md) / getLocationPathParam

# Function: getLocationPathParam()

> **getLocationPathParam**(`_state`, `_componentPath`, `locationPath`): `string`

Utility function to get the location path parameter

## Parameters

▪ **\_state**: `object`

The application state [AppState](../../store/type-aliases/AppState.md)

▪ **\_state.data**: `Readonly`\<[`State`](../../../features/sheet/reducers/interfaces/State.md)\>

▪ **\_state.matches**: `Readonly`\<[`State`](../../../selectors/progress/paths/private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../../../selectors/progress/paths/private/interfaces/State.md)\>

▪ **\_componentPath**: `string`

The component path parameter

▪ **locationPath**: `string`

The location path parameter

## Returns

`string`

The location path parameter

## Example

```ts
const getTitle = createSelector(
   [getLocationPathParam, getLocationHasVisit, getIsAtEda],
   (locationPath, locationHasVisit, isAtEda) =>
     ...
 )
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:84](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
