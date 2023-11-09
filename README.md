# CLEaN Tool

Welcome to the CLEaN Tool Documentation. This is a guide for the tool's continued development and maintenance.

## The Tool

### What it Does

The CLEaN Tool is a tool with four core functions which are:

1. Checking

    This feature provides a robust user interface to quickly find data errors for cleaning.

2. Logging

    This feature allows the user to save information pertaining to the modifications made on the loaded dataset for cleaning and/or further cleaning.

3. Evaluation

    This feature provides an index to loaded datasets for further review on the best data practive using mDQI.

4. Nesting

    This features allows multiple datasets to be concatenated and joined together with an organized and standardized format according to the mDQI.

### Targets

1. Checking

    - [x] Upload data
    - [x] Configure visits
    - [x] Load wide data
    - [ ] Load long data

        Currently users need to reshape the data using a spreadsheet software

    - [ ] Support for dataset joining and concatenation

        Currently users need to work on a sheet at a time in the tool and nest datasets in a spreadsheet software

2. Logging

    - [ ] Flaggable data errors
    - [ ] Download preview

3. Evaluation

    - [ ]

4. Nesting

    - [ ] Column name matching
    - [ ] Long to wide reshaping

## Before Starting

Before starting development on the project, it is important to take some time to learn more about the things that are used in this project.

### Prequisites

This tool is build using Typescript and React built using Vite. It has a SPA architecture that works as a static web application that doesn't rely on the server. The logical architecture of the code mainly comprises of functional programming code.

- Typescript (4/5)

    This project uses typescript with the purpose of the project being more readable and maintainable for the next person.

- React (4/5)

    This project uses react as it is the most widely used framework for applications that mainly run on web. The reason this application is build on webkit/browser engine is because it will be able to support code migration to a server if it is ever needed in the future.

- Redux (3/5)

    Since there are no servers used in this application, the state management of the application needs to be supported by a centralized state store library like redux. It makes code separation for logic and rendering easier.

- Functional Programming (3/5)

    Although not the most popular method of programming, the approach to functional programming promotes code security as it doesn't allow users to write code that can return null and undefined values.

### Other Libraries

The other libraries that might not needed further reading to get started for the project are the following:

- React Dropzone
- Fluent UI React Components 9
- Plotly.js
- React Plotly.js
- Tauri

### Resources

- [Typescript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Documentation](https://react-redux.js.org/)
- [React Plotly.js Documentation](https://plotly.com/javascript/react/)
- [Plotly.js Documentation](https://plotly.com/javascript/)
- [fp-ts Documentation](https://gcanti.github.io/fp-ts/)
- [React Dropzone Documentation](https://react-dropzone.js.org/)
- [Tauri Documentation](https://tauri.app/)

## Environment Setup

After cloning the repository, there are a few things that needs to be set up. Being environment variables are pertained to the machine, it is important to copy the env files using the following commands:

```bash
cp .env.development.example .env.development
cp .env.production.example .env.production
cp src-tauri/tauri.conf.example.json src-tauri/tauri.conf.json
```

After the environment variables are set up, the file to build the desktop application needs to be set up too with the following command:

In the file that we've copied `src-tauri/tauri.conf.json`, some changes needs to be done

By default, the project uses yarn. If the configuration for yarn was too difficult, these few lines can be changed to use npm or pnpm instead:

```diff
{
-   "$schema": "../.yarn/unplugged/@tauri-apps-cli-npm-1.5.6-0eb3dca329/node_modules/@tauri-apps/cli/schema.json"
+   "$schema": "../node_modules/@tauri-apps/cli/schema.json"
    ...
    "build": {
-       "beforeBuildCommand": "yarn build",
+       "beforeBuildCommand": "npm run build",
-       "beforeDevCommand": "yarn dev",
+       "beforeDevCommand": "npm run dev",
        ...
    },
    ...
}

```

After setting the files ready, the build tools necessary for this application is needed. Since this application is based on react using vite, it will need a node runtime to build the web files. However, the desktop build also requires a rust compiler which in turn requires the MSVC++ build tools as instructed in their [instructions](https://www.rust-lang.org/tools/install).

As mentioned, this project uses vite and tauri, however there's no need to change any of those files unless a migration is needed.

Currently, there is linting with ESLint set up. If some of the rules are too restrictive, please reconsider removing them if ever needed.

## Testing

After the project environment is setup, the project can be started for testing. There are two different modes that has been set up.

### Development

This mode allows for a debuggable build of the application. It supports hot reloading along with source maps when used inside the browser dev tools.

To start the application in this mode, run the following commands:

- NPM

```bash
npm run dev
```

- Yarn

```bash
yarn dev
```

With built support for desktop application using tauri, to run a desktop version for development, run the following command:

- NPM

```bash
npm run tauri dev
```

- Yarn

```bash
yarn tauri dev
```

### Production

This mode has been optimized as all the developer friendly tools for debugging is disabled. This is useful for shipping the actual product and also to profile the application's performance if there's ever a need for that.

To use this mode without the desktop application there are three commands provided for the testing.

The first command is for building the application making it preview ready.

- NPM

```bash
npm run build
```

- Yarn

```bash
yarn build
```

The second one is to simply preview the application after building.

- NPM

```bash
npm run preview
```

- Yarn

```bash
yarn preview
```

Finally, the third one is to do both as a reset and safer way that also takes more time to execute.

- NPM

```bash
npm run preview:clean
```

- Yarn

```bash
yarn preview:clean
```

To build the desktop application that is ready for shipping, run the following command:

- NPM

```bash
npm run tauri build
```

- Yarn

```bash
yarn tauri build
```

## Deployment

After running the command for the desktop build, the installer executables can be located in `src-tauri/target/release/bundle`

There will be two folders that contains the two types of installers that can be used.

## Known Issues

Most of the functionalities are not robust enough and are deemed as buggy and faulty for user experience.
