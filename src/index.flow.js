// @flow

import type {StoreCreator, Action, Reducer} from 'redux';

export type ReactorAction<S, T> = {|
  type: T,
  payload: mixed,
  __REACTOR__: Reducer<S, ReactorAction<S, T>>,
|};

export function reactorEnhancer<
  S,
  ActionType,
  A: Action<ActionType> | ReactorAction<S, ActionType>,
  D
>(createStore: StoreCreator<S, A, D>): StoreCreator<S, A, D> {
  return function storeCreator(reducer, ...remainingArgs) {
    function wrappedReducer(state: S | void, action: A): S {
      if (action.__REACTOR__) {
        // $FlowFixMe
        return action.__REACTOR__(state, action);
      }
      return reducer(state, action);
    }
    return createStore(wrappedReducer, ...remainingArgs);
  };
}

export function createReactor<S, T>(
  type: T,
  __REACTOR__: Reducer<S, ReactorAction<S, T>>
): (payload: mixed) => ReactorAction<S, T> {
  return function actionCreator(payload: mixed): ReactorAction<S, T> {
    return {
      type: type,
      payload: payload,
      __REACTOR__: __REACTOR__,
    };
  };
}
