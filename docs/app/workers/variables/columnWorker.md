**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/workers](../README.md) / columnWorker

# Variable: columnWorker

> **`const`** **columnWorker**: `Readonly`\<[`RequestWorker`](../../../types/workers/interfaces/RequestWorker.md)\<[`ColumnRequest`](../../../workers/column/type-aliases/ColumnRequest.md), [`ColumnResponse`](../../../workers/column/type-aliases/ColumnResponse.md)\>\>

The column worker.

## Example

```ts
columnWorker.postMessage({
   columns,
   method: 'get',
 })
```

## Source

[Projects/clean-tool-app/src/app/workers.ts:36](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
