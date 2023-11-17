**CLEaN Tool - v1.0.0** ( [Readme](../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../modules.md) / [components/progress/ProgressNav/selectors](../README.md) / selectProgressValue

# Function: selectProgressValue()

> **selectProgressValue**(`componentPath`, `locationPath`): (`state`) => `number`

The selector to get the progress value for the current progress navigation.

## Parameters

▪ **componentPath**: `string`

The progress nav's component path in the router.

▪ **locationPath**: `string`

The current location path.

## Returns

`function`

The selector function.

> > (`state`): `number`
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.data**: `Readonly`\<[`State`](../../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> `number`
>
> ### Source
>
> [Projects/clean-tool-app/src/components/progress/ProgressNav/selectors.ts:101](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
   const progressValue = useAppSelector(selectProgressValue(componentPath, locationPath))
```

## Source

[Projects/clean-tool-app/src/components/progress/ProgressNav/selectors.ts:101](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
