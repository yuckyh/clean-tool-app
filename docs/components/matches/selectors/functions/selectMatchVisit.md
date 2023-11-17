**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [components/matches/selectors](../README.md) / selectMatchVisit

# Function: selectMatchVisit()

> **selectMatchVisit**(`props`): (`state`) => `number`

Selector function to get the match visit.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../private/interfaces/BaseProps.md)\>

The [props](../private/interfaces/BaseProps.md) for the component.

## Returns

`function`

The match visit.

> > (`state`): `number`
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
> `number`
>
> ### Source
>
> [Projects/clean-tool-app/src/components/matches/selectors.ts:50](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const matchVisit = useAppSelector(selectMatchVisit(props))
```

## Source

[Projects/clean-tool-app/src/components/matches/selectors.ts:49](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
