**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [features/columns/reducers](../README.md) / reducer

# Function: reducer()

> **reducer**(`state`, `action`): `Readonly`\<[`State`](../../../../selectors/progress/private/interfaces/State.md)\>

A *reducer* (also called a *reducing function*) is a function that accepts
an accumulation and a value and returns a new accumulation. They are used
to reduce a collection of values down to a single value

Reducers are not unique to Redux—they are a fundamental concept in
functional programming.  Even most non-functional languages, like
JavaScript, have a built-in API for reducing. In JavaScript, it's
`Array.prototype.reduce()`.

In Redux, the accumulated value is the state object, and the values being
accumulated are actions. Reducers calculate a new state given the previous
state and an action. They must be *pure functions*—functions that return
the exact same output for given inputs. They should also be free of
side-effects. This is what enables exciting features like hot reloading and
time travel.

Reducers are the most important concept in Redux.

*Do not put API calls into reducers.*

## Parameters

▪ **state**: `undefined` \| `Readonly`\<[`State`](../../../../selectors/progress/private/interfaces/State.md)\>

▪ **action**: `AnyAction`

## Returns

`Readonly`\<[`State`](../../../../selectors/progress/private/interfaces/State.md)\>

## Source

AppData/Local/Yarn/Berry/cache/redux-npm-4.2.1-e7e2cf2e37-10.zip/node\_modules/redux/index.d.ts:102

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
