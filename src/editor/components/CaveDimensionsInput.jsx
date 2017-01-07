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
    onSave: PropTypes.func,
    updateCave: PropTypes.func,
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

  @autobind
  handleRebuild() {
    const { onCaveRebuild, updateCave } = this.props
    const { width, height } = this.state
    onCaveRebuild(width, height)
    updateCave(width, height)
  }

  render() {
    const { className, caveWidth, caveHeight, onSave } = this.props
    const computedClassName = classNames(styles.CaveDimensionsInput, className)

    return (
      <div className={computedClassName}>
        <h2 className={styles.title}>Width</h2>
        <Input onChange={this.handleWidthChange} key={`width: ${caveWidth}`} defaultValue={caveWidth} />
        <h2 className={styles.title}>Height</h2>
        <Input onChange={this.handleHeightChange} key={`height: ${caveHeight}`} defaultValue={caveHeight} />
        <div className={styles.buttons}>
          <Button className={styles.rebuildButton} onClick={this.handleRebuild}>Rebuild</Button>
          <Button className={styles.saveButton} onClick={onSave}>Save</Button>
        </div>
      </div>
    )
  }
}
