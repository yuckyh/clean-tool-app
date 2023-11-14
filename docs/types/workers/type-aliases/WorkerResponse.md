**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [types/workers](../README.md) / WorkerResponse

# Type alias: WorkerResponse`<M, S>`

> **WorkerResponse**\<`M`, `S`\>: [`WorkerFailResponse`](../interfaces/WorkerFailResponse.md) \| [`WorkerOkResponse`](../interfaces/WorkerOkResponse.md) & `object`

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

### method

> **method**: `M`

### status

> **status**: `S`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `M` extends [`RequestMethod`](RequestMethod.md) | - |
| `S` extends [`ResponseStatus`](ResponseStatus.md) | [`ResponseStatus`](ResponseStatus.md) |

## Source

[Projects/clean-tool-app/src/types/workers.d.ts:84](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
