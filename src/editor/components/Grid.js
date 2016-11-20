import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'

import styles from 'src/editor/components/Grid.css'

export default class Grid extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.Grid, className)

    return (
      <div className={computedClassName}>
        <canvas className={styles.canvas} />
      </div>
    )
  }
}
