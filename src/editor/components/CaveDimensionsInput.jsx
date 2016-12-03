import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import Input from 'src/components/Input'
import Button from 'src/components/Button'

import styles from 'src/editor/components/CaveDimensionsInput.css'

export default class CaveDimensionsInput extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onCaveRebuild: PropTypes.func,
    caveWidth: PropTypes.number,
    caveHeight: PropTypes.number
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
    this.setState({
      width: parseInt(e.target.value, 10)
    })
  }

  @autobind
  handleHeightChange(e) {
    this.setState({
      height: parseInt(e.target.value, 10)
    })
  }

  render() {
    const { className, onCaveRebuild, caveWidth, caveHeight } = this.props
    const { width, height } = this.state
    const computedClassName = classNames(styles.CaveDimensionsInput, className)

    return (
      <div className={computedClassName}>
        <h2 className={styles.title}>Width</h2>
        <Input onChange={this.handleWidthChange} key={`width: ${caveWidth}`} defaultValue={caveWidth} />
        <h2 className={styles.title}>Height</h2>
        <Input onChange={this.handleHeightChange} key={`height: ${caveHeight}`} defaultValue={caveHeight} />
        <Button className={styles.button} onClick={() => onCaveRebuild(width, height)}>Rebuild</Button>
      </div>
    )
  }
}
