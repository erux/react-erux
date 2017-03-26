import React, { PropTypes } from 'react';
import { assert, expect } from 'chai';
import { connect } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import withStoreAndProvider from '../src/withStoreAndProvider';

describe('withStoreAndProvider', () => {
  it('should be a function', () => {
    assert.isFunction(withStoreAndProvider);
  });
  it('should return a function', () => {
    assert.isFunction(withStoreAndProvider());
  });
  describe('when mounted with store and connected component', () => {
    const Component = ({ text, stateProp, action }) => (
      <div onClick={action}>
        <p id="text">{text}</p>
        <p id="stateProp">{stateProp}</p>
      </div>
    );
    Component.propTypes = {
      text: PropTypes.string.isRequired,
      stateProp: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired
    };
    const mapStateToProps = state => state;
    const action = () => ({ type: 'ACTION' });
    const mapDispatchToProps = {
      action
    };
    const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(
      Component
    );
    const text = 'test text';
    const props = {
      text
    };
    const stateProp = 'value';
    const mockStore = configureStore();
    const store = mockStore({ stateProp });
    const ComponentToMount = withStoreAndProvider(store)(ConnectedComponent);
    const mountedComponent = mount(<ComponentToMount {...props} />);
    it('should include the text prop', () => {
      expect(mountedComponent.prop('text')).to.equal(text);
    });
    it('should include the store prop', () => {
      const storeElements = mountedComponent.findWhere(element =>
        element.prop('store'));
      expect(storeElements).to.have.length.greaterThan(0);
    });
    it('should include mapped stateProp', () => {
      const statePropElement = mountedComponent.find('#stateProp');
      expect(statePropElement).to.have.length.greaterThan(0);
      expect(statePropElement.text()).to.equal(stateProp);
    });
    it('should dispatch action when clicked', () => {
      store.clearActions();
      expect(store.getActions()).to.deep.equal([]);
      mountedComponent.simulate('click');
      expect(store.getActions()).to.deep.equal([action()]);
    });
  });
});
