**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [workers/column](../README.md) / ColumnResponse

# Type alias: ColumnResponse`<S>`

> **ColumnResponse**\<`S`\>: [`WorkerResponse`](../../../types/workers/type-aliases/WorkerResponse.md)\<`"get"`, `S`\> & [`ColumnOkResponse`](../private/type-aliases/ColumnOkResponse.md)

The type of the worker's response.

## Example

```ts
const response: ColumnResponse = {
  matches: [
    [
      {
        item: {
          category: 'quux',
          description: 'baz',
          name: 'foo',
          type: 'bar',
          unit: 'qux',
        },
        refIndex: 0,
        score: 0.5,
      },
      {
        item: {
          category: 'quux',
          description: 'baz2',
          name: 'foo2',
          type: 'bar',
          unit: 'qux',
        },
        refIndex: 1,
        score: 0.4,
      },
    ],
    [
      {
        item: {
          category: 'quux',
          description: 'baz',
          name: 'foo2',
          type: 'bar',
          unit: 'qux',
        },
        refIndex: 1,
        score: 0.5,
      },
    ],
  ],
  status: 'ok',
}
```

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `S` extends [`ResponseStatus`](../../../types/workers/type-aliases/ResponseStatus.md) | [`ResponseStatus`](../../../types/workers/type-aliases/ResponseStatus.md) |

## Source

[Projects/clean-tool-app/src/workers/column.ts:100](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
