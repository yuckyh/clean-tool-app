# Module: workers/column

## Table of contents

### Interfaces

- [ColumnRequest](../wiki/workers.column.ColumnRequest)

### Type Aliases

- [CodebookEntry](../wiki/workers.column#codebookentry)
- [ColumnResponse](../wiki/workers.column#columnresponse)

## Type Aliases

### CodebookEntry

Ƭ **CodebookEntry**: [`ArrayElement`](../wiki/types.utils#arrayelement)<typeof [`codebook`](../wiki/data#codebook)\>

#### Defined in

[Projects/clean-tool-app/src/workers/column.ts:10](https://github.com/yuckyh/clean-tool-app/)

___

### ColumnResponse

Ƭ **ColumnResponse**: [`WorkerResponse`](../wiki/types.workers#workerresponse) & { `matches`: readonly readonly `Omit`<`Fuse.FuseResult`<[`CodebookEntry`](../wiki/workers.column#codebookentry)\>, ``"matches"``\>[][]  }

#### Defined in

[Projects/clean-tool-app/src/workers/column.ts:17](https://github.com/yuckyh/clean-tool-app/)
