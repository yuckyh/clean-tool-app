**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/fp](../README.md) / asTask

# Function: asTask()

> **asTask**\<`As`, `V`\>(`fn`): `Task`\<`V`\>

Converts a function that returns a promise into a task.

## Type parameters

▪ **As** extends readonly `unknown`[]

▪ **V**

## Parameters

▪ **fn**: (...`args`) => `Promise`\<`V`\>

The function that makes a promise.

## Returns

`Task`\<`V`\>

A task representing the function.

## Source

[Projects/clean-tool-app/src/lib/fp.ts:30](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
