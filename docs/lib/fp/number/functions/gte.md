**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [lib/fp/number](../README.md) / gte

# Function: gte()

> **gte**(`x`): (`y`) => `boolean`

The function to compare whether the first is greater than or equal to the second.

## Parameters

▪ **x**: `number`

The first number.

## Returns

`function`

A function that takes a number and compares it to the first number.

> > (`y`): `boolean`
>
> ### Parameters
>
> ▪ **y**: `number`
>
> ### Returns
>
> `boolean`
>
> ### Source
>
> [Projects/clean-tool-app/src/lib/fp/number.ts:39](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
const isGreaterThanOrEqualToFive = gte(5) // isGreaterThanOrEqualToFive(5) === true
```

## Source

[Projects/clean-tool-app/src/lib/fp/number.ts:39](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
