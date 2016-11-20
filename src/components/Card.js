import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'

import styles from 'src/components/Card.css'

export default class Card extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const { className, children, ...others } = this.props
    const computedClassName = classNames(styles.Card, className)

    return (
      <div className={computedClassName} {...others}>
        {children}
      </div>
    )
  }
}
