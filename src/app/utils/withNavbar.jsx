import React, { PureComponent, PropTypes } from 'react'
import Navbar from 'src/app/components/Navbar'

export default function withNavbar(WrappedComponent) {
  class ComponentWithNavbar extends PureComponent {
    static propTypes = {
      children: PropTypes.node
    };

    render() {
      return (
        <WrappedComponent {...this.props}>
          <Navbar />
          {this.props.children}
        </WrappedComponent>
      )
    }
  }

  return ComponentWithNavbar
}
