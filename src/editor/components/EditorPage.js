import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import Palette from 'src/editor/components/Palette'

import styles from 'src/editor/components/EditorPage.css'

export default class EditorPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.EditorPage, className)

    return (
      <div className={computedClassName}>
        <Palette className={styles.palette} />
      </div>
    )
  }
}
