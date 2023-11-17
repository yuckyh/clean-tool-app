**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/Flag](../README.md) / isFlagValue

# Function: isFlagValue()

> **isFlagValue**(`a`): `a is readonly [string, string, FlagReason]`

This refinement checks if a string array is a flag value.

## Parameters

▪ **a**: readonly `string`[]

## Returns

`a is readonly [string, string, FlagReason]`

True if the string array is a flag value.

## Example

```ts
const isFlagValue = isFlagValue(['foo', 'bar', 'incorrect']) // true
```

## Source

AppData/Local/Yarn/Berry/cache/fp-ts-npm-2.16.1-8deb3ec2d6-10.zip/node\_modules/fp-ts/lib/Refinement.d.ts:10

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
