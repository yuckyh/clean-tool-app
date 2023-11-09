**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / ColumnResponse

# Type alias: ColumnResponse`<S>`

> **ColumnResponse**\<`S`\>: [`WorkerResponse`](WorkerResponse.md)\<`"get"`, `S`\> & `object`

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

## Type declaration

### matches

> **matches**: readonly readonly [`MatchlessFuseResult`](../private/type-aliases/MatchlessFuseResult.md)[][]

The search results.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `S` extends [`ResponseStatus`](ResponseStatus.md) | [`ResponseStatus`](ResponseStatus.md) |

## Source

[Projects/clean-tool-app/src/workers/column.ts:93](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
