**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [components/data/selectors](../README.md) / selectVisit

# Function: selectVisit()

> **selectVisit**(`props`): (`state`) => `string`

Selector function to get the visit.

## Parameters

▪ **props**: `Readonly`\<[`ColProps`](../private/interfaces/ColProps.md)\>

The props for the component.

## Returns

`function`

The visit.

> > (`state`): `string`
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../selectors/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../selectors/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> `string`
>
> ### Source
>
> [Projects/clean-tool-app/src/components/data/selectors.ts:54](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const visit = useAppSelector(selectVisit(props))
```

## Source

[Projects/clean-tool-app/src/components/data/selectors.ts:53](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
