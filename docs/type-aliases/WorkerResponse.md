**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / WorkerResponse

# Type alias: WorkerResponse`<S>`

> **WorkerResponse**\<`S`\>: `object` \| `object` & `object`

The response object that is sent back to the main thread.

## Example

The two possible response types:
```ts
const okResponse: WorkerResponse = {
  status: 'ok',
}

const failResponse: WorkerResponse = {
  error: new Error('foo'),
  status: 'fail',
}
```

## Type declaration

### status

> **status**: `S`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `S` extends [`ResponseStatus`](ResponseStatus.md) | [`ResponseStatus`](ResponseStatus.md) |

## Source

[Projects/clean-tool-app/src/types/workers.d.ts:39](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
