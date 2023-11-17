**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/fp](../README.md) / equals

# Function: equals()

> **equals**\<`V`\>(`eq`): (`x`) => `Predicate`\<`V`\>

Function to check for equality between two values.

## Type parameters

▪ **V**

## Parameters

▪ **eq**: `Eq`\<`V`\>

The equality instance.

## Returns

`function`

A predicate that checks for equality.

> > (`x`): `Predicate`\<`V`\>
>
> ### Parameters
>
> ▪ **x**: `V`
>
> ### Returns
>
> `Predicate`\<`V`\>
>
> ### Source
>
> [Projects/clean-tool-app/src/lib/fp/index.ts:94](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
const eq = number.Eq
 const predicate = equals(eq)(1)
```

## Source

[Projects/clean-tool-app/src/lib/fp/index.ts:93](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
