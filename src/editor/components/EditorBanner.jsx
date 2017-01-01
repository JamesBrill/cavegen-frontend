import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

import styles from 'src/editor/components/EditorBanner.css'

export default class EditorBanner extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.EditorBanner, className)

    return (
      <div className={computedClassName}>
        INSERT THINGS HERE
      </div>
    )
  }
}
