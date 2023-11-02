**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / lazyComponentImport

# Function: lazyComponentImport()

> **lazyComponentImport**\<`T`\>(`path`): `Task`\<`object`\>

A helper function to import a component lazily from its default export.

## Type parameters

▪ **T**

The component's prop type

## Parameters

▪ **path**: `string`

Path to the component

## Returns

`Task`\<`object`\>

A [`Task`](https://gcanti.github.io/fp-ts/modules/Task.ts.html) that resolves the default export of the component which can be used by the [`lazy`](https://reactrouter.com/en/main/route/lazy) property for a route.

## Source

[Projects/clean-tool-app/src/app/Router.tsx:17](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
