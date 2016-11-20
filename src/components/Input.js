import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'

import styles from 'src/components/Input.css'

export default class Input extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    maxLength: PropTypes.string
  };

  render() {
    const { className, maxLength, ...others } = this.props
    const computedClassName = classNames(styles.Input, className)

    return <input className={computedClassName} maxLength={maxLength} {...others} />
  }
}
