**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [components/Plot](../README.md) / Plot

# Function: Plot()

> **Plot**(`props`): `Element`

This component is a wrapper around [Plotly]([object Object]) from react-plotly.js.

The purpose of this component is to have a base Plot component that can be
used throughout the application. It also helps to minimize the bundle size.

It provides a default config and layout, and uses Fluent UI tokens for
colors. This components also defaults the component to be responsive.

## Parameters

▪ **props**: `Readonly`\<[`Props`](../private/interfaces/Props.md)\>

The [props](../private/interfaces/Props.md) passed to the component.

## Returns

`Element`

- The [Plotly]([object Object]) component.

## Example

```tsx
`<Plot
  data={[
   {
     x: [1, 2, 3],
     y: [2, 6, 3],
     type: 'scatter',
     mode: 'lines+points',
     marker: {color: 'red'},
   },
   {
     type: 'bar',
     x: [1, 2, 3],
     y: [2, 5, 3]},
 ]}
/>` 

## Source

[Projects/clean-tool-app/src/components/Plot.tsx:61](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
