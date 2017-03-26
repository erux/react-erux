import { applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { makeReducer } from 'erux';

export default (...allArgs) =>
  createStore => {
    const [firstArg, ...remainingArgs] = allArgs;
    const firstArgIsFunction = firstArg && typeof firstArg === 'function';
    // The first argument is middleware if it is a function and returns a function
    const firstArgIsMiddleware = firstArgIsFunction &&
      typeof firstArg() === 'function';
    // First argument is a reducer if it is not middleware but still a function
    const firstArgIsReducer = !firstArgIsMiddleware && firstArgIsFunction;

    // Reducer is either the first argument or an identity (no-op) instance
    const reducer = firstArgIsReducer ? firstArg : state => state;
    // Middlewares are either all arguments after the first if using reducer, or all arguments
    const middlewares = firstArgIsReducer ? remainingArgs : allArgs;
    // Create a store with the eRux-wrapped reducer and middlewares
    return createStore(
      makeReducer(reducer),
      composeWithDevTools(applyMiddleware(...middlewares))
    );
  };
