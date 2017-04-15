import React, { PureComponent, PropTypes } from 'react'
import { Link } from 'react-router'
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
          <Link to='/play'>
            <div className={styles.tab}>
              <p>Play</p>
            </div>
          </Link>
          <Link to='/build'>
            <div className={styles.tab}>
              <p>Editor</p>
            </div>
          </Link>
          <Link to='/learn'>
            <div className={styles.tab}>
              <p>Learn</p>
            </div>
          </Link>
          <Link to='/profile'>
            <div className={styles.tab}>
              <p>Profile</p>
            </div>
          </Link>
        </div>
      </div>
    )
  }
}
