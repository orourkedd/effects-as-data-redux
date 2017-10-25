# Connect Redux and Effects-as-data

This module contains Redux cmds and handlers for a seamless Redux and effects-as-data connection.  It also exposes helper functions to autogenerate cmds and effects-as-data functions from Redux actions.

This module is meant to be used with [effects-as-data](https://github.com/orourkedd/effects-as-data).

## Installation
```
npm i effects-as-data-redux --save
```
## Usage with create-react-app

`create-react-app` doesn't play nice with generators.  To fix this:
* `npm install regenerator-runtime`.
* Follow the example of `src/index.js` and `src/app.js` in: https://github.com/orourkedd/effects-as-data-examples/tree/master/todoapp

#### src/index.js
```js
// Expose regenerator runtime globally at the entrypoint of the app.
// The is required to support generators in create-react-app
const regeneratorRuntime = require("regenerator-runtime");
global.regeneratorRuntime = regeneratorRuntime;
// app.js is the normal index.js renamed
require("./app");
```

### How it works

#### Data flow
  1. Redux passes state to React using `react-redux`.
  1. React handles UI events and calls effects-as-data functions that have been passed in as props.
  1. Effect-as-data dispatches Redux actions.

Using effects-as-data to control Redux further decouples the view layer from Redux and gives you the full power of effects-as-data to execute business logic and dispatch Redux actions at the appropriate times.  This breaks the (IMHO) bad habit of using the Redux dispatch cycle as a general purpose message bus for the application and instead allows Redux to be used only for dispatching actions for state mutation.

## Usage

### Using commands
```js
// actions.js - Redux actions
export const setUser = (payload) => { type: 'SET_USER', payload }
```

```js
// cmds.js
import * as actions from './actions'
import { generateCmdsFromActions } from 'effects-as-data-redux'
import { cmds } from 'effects-as-data-universal'

const reduxCmds = generateCmdsFromActions(actions)

// combine and export universal cmds and the redux cmds generated above
export default {
  state: reduxCmds,
  ...cmds
}
```

```js
// sample effects-as-data function
import cmds from './cmds'

function * setUser (id) {
  //  the httpGet cmds comes from effects-as-data-universal
  const user = yield cmds.httpGet(`https://example.com/api/users/${id}`)
  // this will dispatch a SET_USER action to the Redux store
  yield cmds.state.setUser(user)
}
```

### Setting up handlers
```js
import { handlers } from 'effects-as-data-universal'
import { buildReduxHandlers } from 'effects-as-data-redux'

// export a function that takes a Redux store and builds all the handers
export default (store) => ({
  ...buildReduxHandlers(store),
  ...handlers
})
```

### Generating effects-as-data functions

```js
import { buildFunctions } from 'effects-as-data'
import { generateFunctionsFromActions } from 'effects-as-data-redux'
import buildHandlers from './handlers'
import functions from './functions'
import * as reduxActions from './actions'

// It is not necessary to generate these functions but is convenient
// so that your application can talk to Redux indirectly through
// effects-as-data.  If your view only talks to effects-as-data,
// and effects-as-data talk to Redux, you'll have a clean unidirectional
// data-flow through the application.
const reduxFunctions = generateFunctionsFromActions(reduxActions)

// Combine functions from project and reduxFunctions generated above
const allFunctions = {
  ...functions,
  ...reduxFunctions
}

const config = {
  onCommandComplete: console.log //for telemetry
}

// create the redux store and pass it to the handlers
const store = createStore()
const handlers = buildHandlers(store)

// This will export an object of promise return functions
// that have been generated from the effects-as-data functions
// represented by allFunctions
export default buildFunctions(config, handlers, allFunctions)
```
