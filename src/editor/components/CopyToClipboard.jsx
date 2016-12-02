import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import ReactZeroClipboard from 'react-zeroclipboard'
import 'src/editor/components/ZeroClipboard.css'
import Button from 'src/components/Button'

import styles from 'src/editor/components/CopyToClipboard.css'

export default class CopyToClipboard extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    caveCode: PropTypes.string
  };

  render() {
    const { className, caveCode } = this.props
    const computedClassName = classNames(styles.CopyToClipboard, className)

    return (
      <div className={computedClassName}>
        <ReactZeroClipboard text={caveCode} swfPath='static/zero-clipboard/ZeroClipboard.swf'>
          <Button className={styles.button}>Copy to clipboard</Button>
        </ReactZeroClipboard>
      </div>
    )
  }
}
