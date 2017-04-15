import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'

import styles from 'src/app/components/Navbar.css'

export default class Navbar extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func
  };

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.Navbar, className)

    return (
      <div className={computedClassName}>
        <div className={styles.left}>

        </div>
        <div className={styles.right}>

        </div>
      </div>
    )
  }
}
