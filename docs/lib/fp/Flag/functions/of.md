**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/Flag](../README.md) / of

# Function: of()

> **of**(`index`, `column`, `reason`): [`Flag`](../interfaces/Flag.md)

The constructor for a flag.

## Parameters

▪ **index**: `string`

The index of the flag.

▪ **column**: `string`

The column of the flag.

▪ **reason**: [`FlagReason`](../type-aliases/FlagReason.md)

The reason for the flag.

## Returns

[`Flag`](../interfaces/Flag.md)

The flag.

## Example

```ts
const flag = of('foo', 'bar', 'incorrect')
```

## Source

[Projects/clean-tool-app/src/lib/fp/Flag.ts:49](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
