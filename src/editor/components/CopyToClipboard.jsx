import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { CopyToClipboard as ReactCopytoClipboard } from 'react-copy-to-clipboard'
import Button from 'src/components/Button'
import CopyIcon from 'src/editor/components/icons/CopyIcon'

import styles from 'src/editor/components/CopyToClipboard.css'

export default class CopyToClipboard extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    caveCode: PropTypes.string
  }

  render() {
    const { className, caveCode } = this.props
    const computedClassName = classNames(styles.CopyToClipboard, className)

    return (
      <div className={computedClassName}>
        <ReactCopytoClipboard text={caveCode}>
          <Button className={styles.button} data-tip='Copy'>
            <CopyIcon className={styles.copyIcon} />
          </Button>
        </ReactCopytoClipboard>
      </div>
    )
  }
}
