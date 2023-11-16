**CLEaN Tool - v1.0.0** ( [Readme](../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../modules.md) / [components/progress/ProgressNav/hooks](../README.md) / saveStates

# Function: saveStates()

> **saveStates**(`dispatch`): `IO`\<readonly (`object` \| `object` \| `object`)[]\>

The function to save the current app state.

## Parameters

▪ **dispatch**: `ThunkDispatch`\<`object`, `undefined`, `AnyAction`\> & `Dispatch`\<`AnyAction`\>

The app dispatch.

## Returns

`IO`\<readonly (`object` \| `object` \| `object`)[]\>

The IO action.

## Example

```tsx
   const dispatch = useAppDispatch()
   const saveStates = useCallback(() => saveStates(dispatch), [dispatch])
```

## Source

[Projects/clean-tool-app/src/hooks/progress.ts:44](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
