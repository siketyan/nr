# nr - Modern and pretty alternative of npm-run-all

[![NPM Version](https://img.shields.io/npm/v/@siketyan/nr)](https://www.npmjs.com/package/@siketyan/nr)
[![MIT License](https://img.shields.io/npm/l/@siketyan/nr)](./LICENCE.md)

## Prerequisites

- Node.js v20+

## Installation

```shell
npm install -D @siketyan/nr
```

or

```shell
pnpm add -D @siketyan/nr
```

or

```shell
yarn add -D @siketyan/nr
```

## Usage

> [!NOTE]
> You can specify target scripts using wildcards, braces, or globs.
> For details, please refer the documentation of [minimatch](https://github.com/isaacs/minimatch).

### Run in serial (default)

```shell
nr foo bar baz
```

### Run in parallel

```shell
nr -p foo bar baz
```
