import { assert, expect } from 'chai';
import sinon, { spy } from 'sinon';
import withCreateStore from '../src/withCreateStore';
import mockCreateStore from './mockCreateStore';

describe('withCreateStore', () => {
  it('should be a function', () => {
    assert.isFunction(withCreateStore);
  });
  it('should return a function', () => {
    assert.isFunction(withCreateStore());
  });
  describe('when called with createStore', () => {
    const action = { type: 'TEST' };
    it('should create a store with identity reducer with no args', () => {
      const store = withCreateStore()(mockCreateStore);

      const stateBefore = store.getState();
      store.dispatch(action);
      const stateAfter = store.getState();

      expect(stateAfter).to.deep.equal(stateBefore);
    });
    it('should accept a reducer as the first arg', () => {
      const expectStateAfter = { key: 'new value' };
      const reducer = spy(() => expectStateAfter);
      const store = withCreateStore(reducer)(mockCreateStore);

      const stateBefore = store.getState();
      store.dispatch(action);
      const stateAfter = store.getState();

      sinon.assert.calledWithExactly(reducer, stateBefore, action);
      expect(stateAfter).to.deep.equal(expectStateAfter);
    });
    it('should accept middleware as the first arg', () => {
      const middlewareAction = spy();
      const middleware = () => () => middlewareAction;
      const store = withCreateStore(middleware)(mockCreateStore);

      const stateBefore = store.getState();
      store.dispatch(action);
      const stateAfter = store.getState();

      sinon.assert.alwaysCalledWithExactly(middlewareAction, action);
      expect(stateAfter).to.deep.equal(stateBefore);
    });
    it('should accept reducer and middleware as args', () => {
      const expectStateAfter = { key: 'another value' };
      const reducer = spy(() => {
        return expectStateAfter;
      });
      const middlewareAction = spy();
      const middleware = () =>
        next =>
          action => {
            middlewareAction(action);
            next(action);
          };
      const store = withCreateStore(reducer, middleware)(mockCreateStore);

      const stateBefore = store.getState();
      store.dispatch(action);
      const stateAfter = store.getState();

      sinon.assert.alwaysCalledWithExactly(middlewareAction, action);
      sinon.assert.calledWithExactly(reducer, stateBefore, action);
      expect(stateAfter).to.deep.equal(expectStateAfter);
    });
    it('should accept multiple middleware as args', () => {
      const middleware1Action = spy();
      const middleware1 = () =>
        next =>
          action => {
            middleware1Action(action);
            next(action);
          };
      const middleware2Action = spy();
      const middleware2 = () =>
        next =>
          action => {
            middleware2Action(action);
            next(action);
          };
      const store = withCreateStore(middleware1, middleware2)(mockCreateStore);

      const stateBefore = store.getState();
      store.dispatch(action);
      const stateAfter = store.getState();

      sinon.assert.alwaysCalledWithExactly(middleware1Action, action);
      sinon.assert.alwaysCalledWithExactly(middleware2Action, action);
      expect(stateAfter).to.deep.equal(stateBefore);
    });
    it('should accept reducer and multiple middleware as args', () => {
      const expectStateAfter = { key: 'another value' };
      const reducer = spy(() => {
        return expectStateAfter;
      });
      const middleware1Action = spy();
      const middleware1 = () =>
        next =>
          action => {
            middleware1Action(action);
            next(action);
          };
      const middleware2Action = spy();
      const middleware2 = () =>
        next =>
          action => {
            middleware2Action(action);
            next(action);
          };
      const store = withCreateStore(reducer, middleware1, middleware2)(
        mockCreateStore
      );

      const stateBefore = store.getState();
      store.dispatch(action);
      const stateAfter = store.getState();

      sinon.assert.alwaysCalledWithExactly(middleware1Action, action);
      sinon.assert.alwaysCalledWithExactly(middleware2Action, action);
      sinon.assert.calledWithExactly(reducer, stateBefore, action);
      expect(stateAfter).to.deep.equal(expectStateAfter);
    });
  });
});
