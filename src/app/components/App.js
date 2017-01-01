import React, { PureComponent, PropTypes, Children, cloneElement } from 'react'

import styles from 'src/app/components/App.css'

export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <div className={styles.App}>
        {cloneElement(Children.only(this.props.children), { className: styles.page })}
      </div>
    )
  }
}
