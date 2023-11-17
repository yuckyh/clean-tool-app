**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/logger](../README.md) / ioDumpError

# Function: ioDumpError()

> **ioDumpError**\<`E`\>(`err`): `IO`\<`void`\>

The function to dump an error to the console.

## Type parameters

▪ **E**

## Parameters

▪ **err**: `E`

The error to dump.

## Returns

`IO`\<`void`\>

An IO that dumps the error to the console.

## Example

```ts
const fooError = dumpError(new Error('foo'))
```

## Source

[Projects/clean-tool-app/src/lib/fp/logger.ts:56](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
