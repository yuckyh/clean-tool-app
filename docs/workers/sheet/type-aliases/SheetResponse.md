**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [workers/sheet](../README.md) / SheetResponse

# Type alias: SheetResponse`<M, S>`

> **SheetResponse**\<`M`, `S`\>: [`WorkerResponse`](../../../types/workers/type-aliases/WorkerResponse.md)\<`M`, `S`\> & [`SheetOkResponse`](../private/interfaces/SheetOkResponse.md)\<`M`\> \| [`WorkerResponse`](../../../types/workers/type-aliases/WorkerResponse.md)\<[`SheetMethod`](SheetMethod.md), `"fail"`\>

The type of the worker's response.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `M` extends [`SheetMethod`](SheetMethod.md) | [`SheetMethod`](SheetMethod.md) |
| `S` extends [`ResponseStatus`](../../../types/workers/type-aliases/ResponseStatus.md) | [`ResponseStatus`](../../../types/workers/type-aliases/ResponseStatus.md) |

## Source

[Projects/clean-tool-app/src/workers/sheet.ts:55](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
