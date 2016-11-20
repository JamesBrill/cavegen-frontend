import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'

import styles from 'src/components/Spinner.css'

export default class Spinner extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className, ...others } = this.props
    const computedClassName = classNames(styles.Spinner, className)

    return (
      <div className={computedClassName} {...others} />
    )
  }
}
