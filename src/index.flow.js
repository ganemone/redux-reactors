// @flow

import type {StoreCreator, Action, Reducer} from 'redux';

type ReactorAction<S, T> = {|
  type: T,
  payload?: mixed,
  __REACTOR__?: Reducer<S, Action<T>>,
|};

export function reactorEnhancer<
  S,
  ActionType,
  A: ReactorAction<S, ActionType>,
  D
>(createStore: StoreCreator<S, A, D>): StoreCreator<S, A, D> {
  return function storeCreator(reducer, ...remainingArgs) {
    function wrappedReducer(state: S | void, action: A): S {
      if (action.__REACTOR__) {
        return action.__REACTOR__(state, action);
      }
      return reducer(state, action);
    }
    return createStore(wrappedReducer, ...remainingArgs);
  };
}

export function createReactor<S, T>(
  type: T,
  __REACTOR__: Reducer<S, Action<T>>
): (payload: mixed) => ReactorAction<S, T> {
  return function actionCreator(payload: mixed) {
    return {
      type: type,
      payload: payload,
      __REACTOR__: __REACTOR__,
    };
  };
}
