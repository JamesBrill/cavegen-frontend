import React, { PureComponent, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import ReactModal from 'react-modal'
import { allTextColors, textColorClass } from 'src/utils/palette'

import styles from 'src/components/Modal.css'

export default class Modal extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    unstyled: PropTypes.bool,
    colorlessOverlay: PropTypes.bool,
    closeButtonColor: PropTypes.oneOf(allTextColors()),
    onRequestClose: PropTypes.func
  };

  static defaultProps = {
    closeButtonColor: 'brownish-grey'
  };

  @autobind
  handleClick() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose()
    }
  }

  render() {
    const {
      className,
      children,
      unstyled,
      colorlessOverlay,
      closeButtonColor,
      ...others
    } = this.props
    const computedClassName = classNames(styles.Modal, className, {
      [styles.cardlike]: !unstyled
    })
    const overlayClassName = classNames(styles.overlay, {
      [styles.colorless]: colorlessOverlay
    })
    const closeButtonClass = classNames(styles.closeButton, textColorClass(closeButtonColor))

    return (
      <ReactModal
        className={computedClassName}
        overlayClassName={overlayClassName}
        closeTimeoutMS={500}
        {...others}
      >
        <span className={closeButtonClass} onClick={this.handleClick}>×</span>
        {children}
      </ReactModal>
    )
  }
}
