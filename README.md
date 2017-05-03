# redux-reactors

[![Greenkeeper badge](https://badges.greenkeeper.io/ganemone/redux-reactors.svg)](https://greenkeeper.io/)

A small library (~20 loc) for creating action/reducer combinations, also known as reactors.

[![build status](https://travis-ci.org/ganemone/redux-reactors.svg?branch=master)](https://travis-ci.org/ganemone/react-redux-lite)

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

