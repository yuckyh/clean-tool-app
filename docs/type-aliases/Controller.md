**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / Controller

# Type alias: Controller`<Request, Response>`

> **Controller**\<`Request`, `Response`\>: `Record`\<`Request`\[`"method"`\], [`RequestHandler`](RequestHandler.md)\<`Request`, `Response`\>\>

The controller object that maps the request method to the handler.

## Type parameters

| Parameter |
| :------ |
| `Request` extends [`WorkerRequest`](WorkerRequest.md) |
| `Response` extends [`WorkerResponse`](WorkerResponse.md) |

## Source

[Projects/clean-tool-app/src/types/workers.d.ts:82](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
