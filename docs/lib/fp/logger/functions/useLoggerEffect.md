**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/logger](../README.md) / useLoggerEffect

# Function: useLoggerEffect()

> **useLoggerEffect**\<`T`\>(`dep`): `void`

This hook is used to dump a value with its name to the console.

## Type parameters

▪ **T** extends `unknown`

## Parameters

▪ **dep**: `Record`\<`string`, `T`\>

The value with the key as its name to dump.

## Returns

`void`

## Example

```tsx
 useLoggerEffect({ foo: 'bar' })
```

## Source

[Projects/clean-tool-app/src/lib/fp/logger.ts:131](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
