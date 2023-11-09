**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / defaultLazyComponent

# Function: defaultLazyComponent()

> **defaultLazyComponent**\<`T`\>(`promise`): `Task`\<`object`\>

A helper function to import a component lazily from its default export.

## Type parameters

▪ **T**

The component's prop type.

## Parameters

▪ **promise**: `Promise`\<`object`\>

A promise that resolves the default export of the component.

## Returns

`Task`\<`object`\>

A [`Task`](https://gcanti.github.io/fp-ts/modules/Task.ts.html) that resolves the default export of the component which can be used by the [`lazy`](https://reactrouter.com/en/main/route/lazy) property for a [`route`](https://reactrouter.com/en/main/route/route).

## Example

To create a lazy import for the home page a route will be declared as such:
```tsx
<Route index lazy={defaultLazyComponent(import('@/pages'))} />
```

## Source

[Projects/clean-tool-app/src/lib/utils.ts:40](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
