import React from 'react';
import { Provider } from 'react-redux';

export default store =>
  WrappedComponent => {
    // Return a named component with a Provider wrapper using the store
    const ProvidedComponent = props => (
      <Provider store={store}>
        <WrappedComponent {...props} />
      </Provider>
    );
    return ProvidedComponent;
  };
