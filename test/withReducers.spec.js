import React, { PropTypes } from 'react';
import { assert, expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import withCreateStore from '../src/withCreateStore';
import withReducers from '../src/withReducers';
import mockCreateStore from './mockCreateStore';

describe('withReducers', () => {
  it('should be a function', () => {
    assert.isFunction(withReducers);
  });
  it('should return a function', () => {
    assert.isFunction(withReducers());
  });
  describe('when mounted with reducers and component', () => {
    const Display = ({ id, title, counter, children, inc }) => (
      <div id={id}>
        <p className="title">{title}</p>
        <p className="counter">{counter}</p>
        <button onClick={inc}>INC</button>
        {children}
      </div>
    );
    Display.propTypes = {
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      counter: PropTypes.number,
      inc: PropTypes.func.isRequired,
      children: PropTypes.element
    };
    const inc = ({ counter = 0 }) => ({ counter: counter + 1 });
    const reducers = {
      inc
    };
    const Child = props => (
      <Display id="child" title="child title" {...props} />
    );
    const ChildWithReducers = withReducers(reducers)(Child);
    const Parent = ({ children, ...props }) => (
      <Display id="parent" title="parent title" {...props}>{children}</Display>
    );
    Parent.propTypes = {
      children: PropTypes.element.isRequired
    };
    const ParentWithReducers = withReducers(reducers)(Parent);
    const mountComponentAndStore = () => {
      const store = withCreateStore()(mockCreateStore);
      const mountedComponent = mount(
        <Provider store={store}>
          <ParentWithReducers>
            <ChildWithReducers />
          </ParentWithReducers>
        </Provider>
      );
      return {
        mountedComponent,
        store
      };
    };
    describe('parent element', () => {
      const mountedComponentAndStore = mountComponentAndStore();
      const { mountedComponent, store } = mountedComponentAndStore;
      const parentElement = mountedComponent.find('#parent');
      it('should exist', () => {
        expect(parentElement).to.have.length.greaterThan(0);
      });
      it('should include title', () => {
        expect(parentElement.find('> .title').text()).to.equal('parent title');
      });
      it('should inc counter when clicked', () => {
        parentElement.find('> button').simulate('click');
        expect(store.getState()).to.deep.equal({
          Parent: {
            counter: 1,
            Child: {
              counter: 1
            }
          }
        });
      });
    });
    describe('child element', () => {
      const mountedComponentAndStore = mountComponentAndStore();
      const { mountedComponent, store } = mountedComponentAndStore;
      const childElement = mountedComponent.find('#child');
      it('should exist', () => {
        expect(childElement).to.have.length.greaterThan(0);
      });
      it('should include title', () => {
        expect(childElement.find('> .title').text()).to.equal('child title');
      });
      it('should inc counter when clicked', () => {
        childElement.find('> button').simulate('click');
        expect(store.getState()).to.deep.equal({
          Parent: {
            counter: 1,
            Child: {
              counter: 1
            }
          }
        });
      });
    });
  });
});
