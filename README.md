# redux-reactors

[![Greenkeeper badge](https://badges.greenkeeper.io/ganemone/redux-reactors.svg)](https://greenkeeper.io/)

A small library (~20 loc) for creating action/reducer combinations, also known as reactors.

[![build status](https://travis-ci.org/ganemone/redux-reactors.svg?branch=master)](https://travis-ci.org/ganemone/redux-reactors)
[![npm version](https://img.shields.io/npm/v/redux-reactors.svg)](https://www.npmjs.com/package/redux-reactors)

## Motivation

Colocating actions and reducers makes it very easy to trace through your code. If a component dispatches an action, you can easily see what state transformation will occur by inspecting the reactor. This pattern of colocating actions and reducers is not new, and was originally popularized by the (ducks pattern)[https://github.com/erikras/ducks-modular-redux]. `redux-reactors` takes some ideas from the ducks pattern one step further and formalizes it into an api.

#### Performance

In a large application, your root reducer can become bloated from the combination of many reducers via `combineReducers`, `reduceReducers` and the like. This can cause performance issues if you are dispatching a high frequency of actions. With reactors, you only execute a single well scoped reducer for each action.

#### Code Splitting

Code splitting is very difficult with standard redux reducers. This is due to the fact that all your reducers are combined into a single root reducer. There are some solutions using `store.replaceReducer` however it is very difficult to do in a robust way, and you can end up with unexpected errors if an action is dispatched before the corresponding reducer is loaded.

#### Hot Reloading

Hot reloading reducers using standard redux requires hacks using `store.replaceReducer`. Hot reloading reactors works out of the box with no changes to your code.

## Quickstart

### Install the library
```sh
$ npm install redux-reactors --save
```

### Add the store enhancer
```javascript
import {reactorEnhancer} from 'redux-reactors';
import {createStore, compose} from 'redux';
// ...
const store = createStore(reducer, initialState, compose(reactorEnhancer, ...otherEnhancers));
```

### Create reactors
```javascript
import {createReactor} from 'redux-reactors';
export const incrementReactor = createReactor('INCREMENT', (state, action) => {
  return Object.assign({}, {
    counter: state.counter + action.payload,
    state,
  });
});
```

### Use reactors in your components
```javascript
import {incrementReactor} from './my-reactors';
import {connect} from 'react-redux';

function MyComponent(props) {
  const {increment, counter} = props;
  return (
    <div>
      <div>The count is {counter}</div>
      <button onClick={() => increment(1)}>Increment by one</button>
      <button onClick={() => increment(2)}>Increment by two</button>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    counter: state.counter,
  };
};

// Since createReactor returns an action creator,
// you can use it easily with mapDispatchToProps
const mapDispatchToProps = {
  increment: incrementReactor,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```

