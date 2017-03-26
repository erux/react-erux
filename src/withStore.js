import { createStore } from 'redux';
import withCreateStore from './withCreateStore';
import withStoreAndProvider from './withStoreAndProvider';

export default (...args) =>
  WrappedComponent =>
    withStoreAndProvider(withCreateStore(...args)(createStore))(
      WrappedComponent
    );
