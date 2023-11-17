**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/logger](../README.md) / dumpName

# Function: dumpName()

> **dumpName**\<`T`\>(`obj`): `T`

The function to dump a value with its name to the console.

## Type parameters

▪ **T**

## Parameters

▪ **obj**: `Readonly`\<`Record`\<`string`, `T`\>\>

The value with the key as its name to dump.

## Returns

`T`

The value that was dumped.

## Example

```ts
const foo = dumpName({ foo: 'bar' }) // foo === 'bar'
```

## Source

[Projects/clean-tool-app/src/lib/fp/logger.ts:120](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
