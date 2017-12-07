# babel-plugin-s2s-redux-sagas

> generate redux sagas

Here is the sample repository using this s2s plugin.
[https://github.com/cndlhvn/s2s-redux-actions-sample](https://github.com/cndlhvn/s2s-redux-actions-sample)

## Install

```
$ yarn add --dev babel-plugin-s2s-redux-sagas
```

## Create redux-sagas template

You should create babel-plugin-s2s-redux-sagas template. \
In your node project, you create a folder named templates in the same direcotry as the package.json

`mkdir templates`

And create a saga.js

`touch templates/saga.js`

Write this code.This is a template code.

```js
import { put, call,takeLatest } from 'redux-saga/effects';
import * as actions from '../actions';
import api from '../api';

export default [];
```

## s2s.config.js

s2s-redux-sagas plugin watch the `src/sagas/*.js` files.

```js
module.exports = {
  watch: './**/*.js',
  plugins: [
    {
       test: /src\/sagas\/(?!.*index).*\.js/,
       plugin: ['s2s-redux-sagas']
    }
  ],
  templates: [
    {
      test: /src\/sagas\/.*\.js/, input: 'saga.js'
    }
  ]
}
```
## Start s2s

Start the s2s with yarn command

`yarn run s2s`

## Usage

#### When create a saga file

When you create a `src/sagas/*.js`, the below code is inserted automatically.

```js
import { put, call,takeLatest } from 'redux-saga/effects';
import * as actions from '../actions';
import api from '../api';

export default [];
```

#### In:

In the saga file, type action name with camelcase such as `searchPokemon` and save it.

```js
import { put, call,takeLatest } from 'redux-saga/effects';
import * as actions from '../actions';
import api from '../api';

searchPokemon

export default [];
```

It will be expanded like this.

#### Out:

```js
import { put, call,takeLatest } from 'redux-saga/effects';
import * as actions from '../actions';
import api from '../api';

export function* handleSearchPokemon(action) {
  try {
    const { data } = yield call(api.searchPokemon, action.payload);
    yield put(actions.searchPokemonSuccess(data));
  } catch (error) {
    yield put(actions.searchPokemonFailure(error));
  }
}

export default [
  takeLatest(actions.searchPokemon.toString(), handleSearchPokemon)
];
```

# Test

This plugin has two test files. \
First is babel plugin main test file named `test.js` on root directory. \
Next is a `test/index.js` that will be transformed by the plugin.

Run this command.

` npm run test`

Test will run and you can see what happen.

If you modify the target javascript source code, please change the `test/index.js`.
