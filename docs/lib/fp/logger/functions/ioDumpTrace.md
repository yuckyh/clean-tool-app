**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/logger](../README.md) / ioDumpTrace

# Function: ioDumpTrace()

> **ioDumpTrace**\<`T`\>(`arg`): `IO`\<`T`\>

The function to dump a value with its trace to the console.

## Type parameters

▪ **T** extends `unknown`

## Parameters

▪ **arg**: `T`

The value to dump.

## Returns

`IO`\<`T`\>

An IO that dumps the value to the console.

## Example

```ts
const ioDumpTrace = dumpTrace('foo')
```

## Source

[Projects/clean-tool-app/src/lib/fp/logger.ts:22](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
