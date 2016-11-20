import React, { PureComponent, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import { allBackgroundColors, backgroundClass } from 'src/utils/palette'

import styles from 'src/components/Button.css'

export default class Button extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    color: PropTypes.oneOf(allBackgroundColors()),
    shape: PropTypes.oneOf(['pill', 'block']),
    disabled: PropTypes.bool,
    onClick: PropTypes.func
  };

  static defaultProps = {
    shape: 'pill'
  };

  @autobind
  handleClick(...args) {
    const { disabled, onClick } = this.props

    if (!disabled && onClick) {
      onClick(...args)
    }
  }

  render() {
    const { children, className, color, shape, disabled, ...others } = this.props
    const computedClassName = classNames(
      className,
      styles.Button,
      styles[color],
      styles[shape],
      {
        [styles.whiteText]: !!color,
        [styles.defaultBackground]: !color,
        [styles.disabled]: disabled
      },
      backgroundClass(color)
    )

    return (
      <button className={computedClassName} {...others} onClick={this.handleClick}>
        {children}
      </button>
    )
  }
}
