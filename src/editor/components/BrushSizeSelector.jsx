import React, { PureComponent, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import Slider from 'react-rangeslider'
import 'src/editor/components/Slider.css'

import styles from 'src/editor/components/BrushSizeSelector.css'

export default class BrushSizeSelector extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onBrushSizeChange: PropTypes.func
  };

  constructor(props) {
    super(props)

    this.state = {
      value: 1
    }
  }

  @autobind
  handleChange(value) {
    this.setState({ value })
    this.props.onBrushSizeChange(value)
  }

  render() {
    const { className } = this.props
    const { value } = this.state
    const computedClassName = classNames(styles.BrushSizeSelector, className)

    return (
      <div className={computedClassName}>
        <div className={styles.label}>Brush size: {value}</div>
        <Slider
          min={1}
          max={6}
          value={value}
          onChange={this.handleChange} />
      </div>
    )
  }
}
