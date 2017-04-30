import tape from 'tape';
import {createStore, applyMiddleware, compose} from 'redux';
import {createReactor, reactorEnhancer} from '../index.js';

tape('reactorEnhancer', function(t) {
  var mockInitialState = {};
  var loggedActions = [];
  var mainReducerActions = [];
  var reactorActions = [];
  function loggingMiddleware(store) {
    return function(next) {
      return function(action) {
        loggedActions.push(action);
        return next(action);
      };
    };
  }
  function mockReducer(state, action) {
    mainReducerActions.push(action);
    return state;
  }
  var store = createStore(
    mockReducer,
    mockInitialState,
    compose(applyMiddleware(loggingMiddleware), reactorEnhancer)
  );
  store.dispatch({
    type: 'ACTION_TYPE',
    payload: 'some-value',
  });
  var actionCreator = createReactor('TEST', function(state, action) {
    reactorActions.push(action);
    return {
      test: 'value',
    };
  });
  store.dispatch(
    actionCreator({
      some: 'payload',
    })
  );
  t.equal(loggedActions.length, 2, 'hits the logging middleware for both user dispatched actions');
  t.equal(mainReducerActions.length, 2, 'two actions will go into the main reducer');
  t.equal(reactorActions.length, 1, 'only one action will go into the reactor reducer');
  t.deepLooseEqual(loggedActions[0], {
    type: 'ACTION_TYPE',
    payload: 'some-value'
  }, 'plain dispatched action makes it into logging middleware');
  t.deepLooseEqual(mainReducerActions[0], {
    type: '@@redux/INIT'
  }, 'redux init action hits main reducer');
  t.deepLooseEqual(mainReducerActions[1], {
    type: 'ACTION_TYPE',
    payload: 'some-value'
  }, 'plain dispatched action makes it into main reducer');
  t.equal(loggedActions[1].type, 'TEST', 'reactor action makes it into logging middleware');
  t.equal(reactorActions[0].type, 'TEST', 'reactor action makes it into reactor reducer');
  t.deepLooseEqual(store.getState(), {
    test: 'value',
  }, 'reactor reducer updates state correctly');
  t.end();
});
