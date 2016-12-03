import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import Palette from 'src/editor/components/Palette'
import Grid from 'src/editor/components/Grid'
import BrushSizeSelector from 'src/editor/components/BrushSizeSelector'
import CaveDimensionsInput from 'src/editor/components/CaveDimensionsInput'
import CopyToClipboard from 'src/editor/components/CopyToClipboard'
import Button from 'src/components/Button'

import styles from 'src/editor/components/EditorPage.css'

import {
  setCurrentBrush,
  setBrushSize,
  setCaveWidth,
  setCaveHeight,
  startRebuild,
  undoCaveChange,
  redoCaveChange
} from 'src/editor/actions'

function mapStateToProps(state) {
  return {
    caveWidth: state.editor.caveWidth,
    caveHeight: state.editor.caveHeight,
    caveCode: state.editor.caveCode
  }
}

const mapDispatchToProps = {
  dispatchSetCurrentBrush: setCurrentBrush,
  dispatchSetBrushSize: setBrushSize,
  dispatchSetCaveWidth: setCaveWidth,
  dispatchSetCaveHeight: setCaveHeight,
  dispatchStartRebuild: startRebuild,
  dispatchUndo: undoCaveChange,
  dispatchRedo: redoCaveChange
}

@connect(mapStateToProps, mapDispatchToProps)
export default class EditorPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    caveWidth: PropTypes.number,
    caveHeight: PropTypes.number,
    dispatchSetCurrentBrush: PropTypes.func,
    dispatchSetBrushSize: PropTypes.func,
    dispatchSetCaveWidth: PropTypes.func,
    dispatchSetCaveHeight: PropTypes.func,
    dispatchStartRebuild: PropTypes.func,
    dispatchUndo: PropTypes.func,
    dispatchRedo: PropTypes.func
  };

  @autobind
  handleRebuild(width, height) {
    const { dispatchSetCaveWidth, dispatchSetCaveHeight, dispatchStartRebuild } = this.props
    dispatchSetCaveWidth(width)
    dispatchSetCaveHeight(height)
    dispatchStartRebuild()
  }

  render() {
    const { className, caveCode, dispatchSetCurrentBrush, dispatchSetBrushSize, dispatchUndo, dispatchRedo } = this.props
    const computedClassName = classNames(styles.EditorPage, className)

    return (
      <div className={computedClassName}>
        <div className={styles.editorControls}>
          <BrushSizeSelector className={styles.brushSize} onBrushSizeChange={dispatchSetBrushSize} />
          <CaveDimensionsInput className={styles.dimensions} onCaveRebuild={this.handleRebuild} />
          <CopyToClipboard caveCode={caveCode} />
          <div className={styles.undoRedoContainer}>
            <Button className={styles.undoRedoButton} onClick={dispatchUndo}>Undo</Button>
            <Button className={styles.undoRedoButton} onClick={dispatchRedo}>Redo</Button>
          </div>
          <Palette onTileClick={dispatchSetCurrentBrush} />
        </div>
        <Grid className={styles.grid} />
      </div>
    )
  }
}
