**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/array](../README.md) / indexDuplicateSearcher

# Function: indexDuplicateSearcher()

> **indexDuplicateSearcher**\<`T`, `U`\>(`indices`, `filterIndex`): readonly `T`[]

The function to get duplicates in an array.

## Type parameters

▪ **T** extends readonly `U`[]

▪ **U**

## Parameters

▪ **indices**: readonly `T`[]

The array to search for duplicates

▪ **filterIndex**: `T`

The array to filter for duplicates

## Returns

readonly `T`[]

The duplicates in the array

## Example

```ts
const duplicates = indexDuplicateSearcher(indices, filterIndex)
```

## Source

[Projects/clean-tool-app/src/lib/array.ts:22](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
