**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/fp](../README.md) / promisedTaskOption

# Function: promisedTaskOption()

> **promisedTaskOption**\<`V`\>(...`a`): `TaskOption`\<`V`\>

Converts a promise into a task option.

## Type parameters

▪ **V**

## Parameters

▪ ...**a**: [`Promise`\<`V`\>]

## Returns

`TaskOption`\<`V`\>

A task option representing the promise.

## Example

```ts
const promise = Promise.resolve(1)
 const taskOption = promisedTaskOption(() => promise)
```

## Source

AppData/Local/Yarn/Berry/cache/fp-ts-npm-2.16.1-8deb3ec2d6-10.zip/node\_modules/fp-ts/lib/function.d.ts:166

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
