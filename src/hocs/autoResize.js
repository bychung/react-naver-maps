import React from 'react';
import PropTypes from 'prop-types';
import { wrapDisplayName } from 'recompose';
import ResizeDetector from 'react-resize-detector';
import hoistNonReactStatics from 'hoist-non-react-statics';

const autoResize = WrappedComponent => {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        style: {
          width: '100%',
          height: '100%',
        },
      };

      this.handleResize = this.handleResize.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
      if (props.size) {
        return {
          ...state,
          size: props.size,
        };
      }

      return null;
    }

    handleResize(width, height) {
      this.setState({
        size: {
          width,
          height,
        },
      });
    }

    render() {
      const { id, className, style, ...restProps } = this.props;
      return (
        <div id={id} className={className} style={style}>
          <WrappedComponent
            {...restProps}
            id={`wrapped-${id}`}
            style={this.state.style}
            size={this.state.size}
          />
          <ResizeDetector
            handleWidth
            handleHeight
            onResize={this.handleResize}
            refreshMode="debounce"
            refreshRate={100}
          />
        </div>
      );
    }
  }

  Wrapper.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  };
  Wrapper.displayName = wrapDisplayName(WrappedComponent, 'autoResize');

  hoistNonReactStatics(Wrapper, WrappedComponent);
  return Wrapper;
};

export default autoResize;
