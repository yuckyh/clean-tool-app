**CLEaN Tool - v1.0.0** ( [Readme](../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../modules.md) / [components/progress/ProgressNav/selectors](../README.md) / selectShouldNavigateToAllowed

# Function: selectShouldNavigateToAllowed()

> **selectShouldNavigateToAllowed**(`componentPath`, `locationPath`): (`state`) => `boolean`

The selector to get whether the user should be navigated to the allowed path.

## Parameters

▪ **componentPath**: `string`

The progress nav's component path in the router.

▪ **locationPath**: `string`

The current location path.

## Returns

`function`

The selector function.

> > (`state`): `boolean`
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.data**: `Readonly`\<[`State`](../../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../../selectors/progress/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../../selectors/progress/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> `boolean`
>
> ### Source
>
> [Projects/clean-tool-app/src/components/progress/ProgressNav/selectors.ts:40](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
   const shouldNavigateToAllowed = useAppSelector(
     selectShouldNavigateToAllowed(componentPath, locationPath),
   )
```

## Source

[Projects/clean-tool-app/src/components/progress/ProgressNav/selectors.ts:40](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
