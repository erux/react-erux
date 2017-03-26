import { Component, PropTypes, createElement } from 'react';
import { connect } from 'react-redux';
import { actionsWithPathAndReducers, stateAtPath } from 'erux';

export default reducers =>
  WrappedComponent => {
    const wrappedComponentName = WrappedComponent.displayName ||
      WrappedComponent.name;
    class EruxConnected extends Component {
      constructor(props, context) {
        super(props, context);
        const { statePath } = context;
        this.statePath = statePath
          ? `${statePath}.${wrappedComponentName}`
          : wrappedComponentName;
        const path = this.statePath;
        const mapStateToProps = state => stateAtPath({ state, path });
        const actionCreators = actionsWithPathAndReducers({
          path,
          reducers
        });

        this.ConnectedComponent = connect(mapStateToProps, actionCreators)(
          WrappedComponent
        );
      }
      getChildContext() {
        const { statePath } = this;
        return {
          statePath
        };
      }

      render() {
        return createElement(this.ConnectedComponent, this.props);
      }
    }
    EruxConnected.contextTypes = {
      statePath: PropTypes.string
    };
    EruxConnected.childContextTypes = EruxConnected.contextTypes;
    return EruxConnected;
  };
