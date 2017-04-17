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
          <Link to='/my-levels'>
            <div className={classNames(styles.tab, styles.levelsTab)}>
              <p>Levels</p>
              <div className={styles.levelsSubTabs}>
                <Link to='/my-levels'>
                  <div className={styles.tab}>
                    <p className={styles.smallFont}>My Levels</p>
                  </div>
                </Link>
                <Link to='/public-levels'>
                  <div className={styles.tab}>
                    <p className={styles.smallFont}>Public Levels</p>
                  </div>
                </Link>
              </div>
            </div>
          </Link>
          <Link to='/build'>
            <div className={classNames(styles.tab, styles.editorTab)}>
              <p>Editor</p>
              <div className={styles.editorSubTabs}>
                <div className={styles.tab}>
                  <p className={styles.smallFont}>New Level</p>
                </div>
                <Link to='/build'>
                  <div className={styles.tab}>
                    <p className={styles.smallFont}>Build</p>
                  </div>
                </Link>
                <div className={styles.tab}>
                  <p className={styles.smallFont}>Play</p>
                </div>
                <Link to='/checkpoints'>
                  <div className={styles.tab}>
                    <p className={styles.smallFont}>Checkpoints</p>
                  </div>
                </Link>
                <Link to='/properties'>
                  <div className={styles.tab}>
                    <p className={styles.smallFont}>Properties</p>
                  </div>
                </Link>
              </div>
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
