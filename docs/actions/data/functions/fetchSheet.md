**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [actions/data](../README.md) / fetchSheet

# Function: fetchSheet()

> **fetchSheet**(): `AsyncThunkAction`\<`object`, `void`, `AsyncThunkConfig`\>

This action fetches the sheet from the worker.

## Returns

`AsyncThunkAction`\<`object`, `void`, `AsyncThunkConfig`\>

A promise containing the sheetWorker response.

## Example

```tsx
 const dispatch = useAppDispatch()
 const fetchSheet = useCallback(() => dispatch(fetchSheet()), [dispatch])
```

## Source

Projects/clean-tool-app/.yarn/\_\_virtual\_\_/@reduxjs-toolkit-virtual-c3307a0459/3/AppData/Local/Yarn/Berry/cache/@reduxjs-toolkit-npm-1.9.7-b14925495c-10.zip/node\_modules/@reduxjs/toolkit/dist/createAsyncThunk.d.ts:108

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
