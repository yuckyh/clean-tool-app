**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/Flag](../README.md) / unwrap

# Function: unwrap()

> **unwrap**(`flag`): readonly [`string`, `string`, [`FlagReason`](../type-aliases/FlagReason.md)]

The function to unwrap a flag.

## Parameters

▪ **flag**: `Readonly`\<[`Flag`](../interfaces/Flag.md)\>

The flag instance.

## Returns

readonly [`string`, `string`, [`FlagReason`](../type-aliases/FlagReason.md)]

The value of the flag.

## Example

```ts
const value = unwrap(flag)
```

## Source

[Projects/clean-tool-app/src/lib/fp/Flag.ts:63](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
