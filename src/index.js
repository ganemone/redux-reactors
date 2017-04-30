export function reactorEnhancer(createStore) {
  return function storeCreator(reducer, initialState, enhancer) {
    function wrappedReducer(state, action) {
      if (action.__REACTOR__) {
        return action.__REACTOR__(state, action);
      }
      return reducer(state, action);
    }
    return createStore(wrappedReducer, initialState, enhancer);
  };
}

export function createReactor(type, __REACTOR__) {
  return function actionCreator(payload) {
    return {
      type: type,
      payload: payload,
      __REACTOR__: __REACTOR__,
    };
  };
}
