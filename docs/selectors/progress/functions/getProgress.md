**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/progress](../README.md) / getProgress

# Function: getProgress()

> **getProgress**(`state`): [`Progress`](../../../reducers/progress/type-aliases/Progress.md)

Selector function to get the progress.

## Parameters

▪ **state**: `object`

The [state](../../../app/store/type-aliases/AppState.md) of the app.

▪ **state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../private/interfaces/State.md)\>

The progress value.

## Returns

[`Progress`](../../../reducers/progress/type-aliases/Progress.md)

The progress.

## Example

```tsx
 const progress = useAppSelector(getProgress)
```

## Source

[Projects/clean-tool-app/src/selectors/progress/index.ts:21](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
