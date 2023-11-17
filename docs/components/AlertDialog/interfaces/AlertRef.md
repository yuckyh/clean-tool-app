**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [components/AlertDialog](../README.md) / AlertRef

# Interface: AlertRef

The ref for [AlertDialog](../functions/AlertDialog.md).

## Contents

- [Properties](AlertRef.md#properties)
  - [open](AlertRef.md#open)
  - [setContent](AlertRef.md#setcontent)
  - [setTitle](AlertRef.md#settitle)

## Properties

### open

> **open**: `IO`\<`void`\>

Function to open the dialog.

#### Source

[Projects/clean-tool-app/src/components/AlertDialog.tsx:33](https://github.com/yuckyh/clean-tool-app/)

***

### setContent

> **setContent**: (`content`) => `void`

Function to set the content of the dialog.

#### Parameters

▪ **content**: `string`

The content to set.

#### Returns

`void`

#### Example

```tsx
 alertRef.current?.setContent('Hello World')
```

#### Source

[Projects/clean-tool-app/src/components/AlertDialog.tsx:42](https://github.com/yuckyh/clean-tool-app/)

***

### setTitle

> **setTitle**: (`title`) => `void`

Function to set the title of the dialog.

#### Parameters

▪ **title**: `string`

The title to set.

#### Returns

`void`

#### Example

```tsx
 alertRef.current?.setTitle('Hello World')
```

#### Source

[Projects/clean-tool-app/src/components/AlertDialog.tsx:51](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
