import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'

import styles from 'src/editor/components/EditorBanner.css'

export default class EditorBanner extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func
  };

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.EditorBanner, className)

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
