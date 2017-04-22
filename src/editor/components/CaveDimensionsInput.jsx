import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import Input from 'src/components/Input'
import Button from 'src/components/Button'

import styles from 'src/editor/components/CaveDimensionsInput.css'

export default class CaveDimensionsInput extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onCreate: PropTypes.func
  };

  constructor(props) {
    super(props)

    this.state = {
      width: 40,
      height: 40
    }
  }

  @autobind
  handleWidthChange(e) {
    const width = e.target.value === '' ? 0 : parseInt(e.target.value, 10)
    this.setState({ width })
  }

  @autobind
  handleHeightChange(e) {
    const height = e.target.value === '' ? 0 : parseInt(e.target.value, 10)
    this.setState({ height })
  }

  @autobind
  handleCreate() {
    const { width, height } = this.state
    this.props.onCreate(width, height)
  }

  render() {
    const { className } = this.props
    const { width, height } = this.state
    const computedClassName = classNames(styles.CaveDimensionsInput, className)

    return (
      <div className={computedClassName}>
        <h2 className={styles.title}>Width</h2>
        <Input onChange={this.handleWidthChange} key='width' value={width} />
        <h2 className={styles.title}>Height</h2>
        <Input onChange={this.handleHeightChange} key='height' value={height} />
        <div className={styles.buttons}>
          <Button className={styles.createButton} onClick={this.handleCreate}>Create</Button>
        </div>
      </div>
    )
  }
}
