**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/fp](../README.md) / dualMap

# Function: dualMap()

> **dualMap**\<`A`, `B`\>(`fn`): (`tuple`) => [`B`, `B`]

Function to apply a function to a bifunctor.

## Type parameters

▪ **A**

▪ **B**

## Parameters

▪ **fn**: (`a`) => `B`

The function to apply.

## Returns

`function`

A function that applies the function to a bifunctor.

> > (`tuple`): [`B`, `B`]
>
> ### Parameters
>
> ▪ **tuple**: readonly [`A`, `A`]
>
> ### Returns
>
> [`B`, `B`]
>
> ### Source
>
> [Projects/clean-tool-app/src/lib/fp/index.ts:123](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
const fn = (x: number) => x + 1
```

## Source

[Projects/clean-tool-app/src/lib/fp/index.ts:122](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
