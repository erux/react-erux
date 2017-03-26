const mockCreateStore = (reducer, enhancer) => {
  if (enhancer) {
    return enhancer(mockCreateStore)(reducer);
  }
  let state = {};
  const dispatch = action => {
    state = reducer(state, action);
  };
  return {
    getState: () => state,
    dispatch,
    subscribe: Function.prototype,
    reducer
  };
};

export default mockCreateStore;
