**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/logger](../README.md) / ioDumpName

# Function: ioDumpName()

> **ioDumpName**\<`T`\>(`obj`): `IO`\<readonly `T`[]\>

The function to dump a value with its name to the console.

## Type parameters

▪ **T**

## Parameters

▪ **obj**: `Readonly`\<`Record`\<`string`, `T`\>\>

The value with the key as its name to dump.

## Returns

`IO`\<readonly `T`[]\>

An IO that dumps the value to the console.

## Example

```ts
const ioDumpName = dumpName({ foo: 'bar' })
```

## Source

[Projects/clean-tool-app/src/lib/fp/logger.ts:96](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
