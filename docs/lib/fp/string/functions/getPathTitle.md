**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/string](../README.md) / getPathTitle

# Function: getPathTitle()

> **getPathTitle**(`path`, `depth`): `string`

Utility function to convert a kebab case string to a title case string.

## Parameters

▪ **path**: `string`

The kebab case string to be converted.

▪ **depth**: `number`= `1`

The depth of the path to be converted.

## Returns

`string`

The title case string.

## Example

```ts
kebabToCamel('foo-bar') // 'Foo Bar'
```

## Source

[Projects/clean-tool-app/src/lib/fp/string.ts:60](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
