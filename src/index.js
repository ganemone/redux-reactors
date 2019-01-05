export function reactorEnhancer(createStore) {
  return function storeCreator(reducer, initialState, enhancer) {
    function wrappedReducer(state, action) {
      return reducer(
        action.__REACTOR__ ? action.__REACTOR__(state, action) : state,
        action
      );
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
