# Connect Redux and Effects-as-data

This module contains Redux cmds and handlers for seamless Redux and effects-as-data connection.  It also exposes helper functions to autogenerate cmds and effects-as-data functions from Redux actions.

## Installation
```
npm i effects-as-data-redux --save
```

### How it works

Redux -> React -> Effect-as-data -> Redux -> React -> (repeat)

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
  ...reduxCmds,
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
  yield cmds.setUser(user)
}
```

### Setting up handlers
```js
import { handlers } from 'effects-as-data-universal'
import { buildReduxHandlers } from 'effects-as-data-redux'

// export a function that takes a Redux store and builds all the handers
export default (store) => ({
  ...buildReduxHandlers(store),
  handlers
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
