import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import keydown from 'react-keydown'
import { autobind } from 'core-decorators'
import Palette from 'src/editor/components/Palette'
import Grid from 'src/editor/components/Grid'
import { getTileFromSymbol, TILE_KEYS } from 'src/editor/utils/tiles'
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
  redoCaveChange,
  playCave
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
  dispatchRedo: redoCaveChange,
  dispatchPlayCave: playCave
}

const UNDO_KEYS = ['ctrl+z', 'cmd+z']
const REDO_KEYS = ['ctrl+y', 'cmd+y', 'ctrl+shift+z', 'cmd+shift+z']

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
    dispatchRedo: PropTypes.func,
    dispatchPlayCave: PropTypes.func
  };

  @autobind
  handleRebuild(width, height) {
    const { dispatchSetCaveWidth, dispatchSetCaveHeight, dispatchStartRebuild } = this.props
    dispatchSetCaveWidth(width)
    dispatchSetCaveHeight(height)
    dispatchStartRebuild()
  }

  @autobind
  @keydown(UNDO_KEYS)
  handleUndo() {
    this.props.dispatchUndo()
  }

  @autobind
  @keydown(REDO_KEYS)
  handleRedo() {
    this.props.dispatchRedo()
  }

  @autobind
  @keydown(TILE_KEYS)
  handleTileKeyPress(e) {
    if (e.key === 's') {
      this.props.dispatchSetCurrentBrush(getTileFromSymbol(' '))
    } else {
      this.props.dispatchSetCurrentBrush(e.key)
    }
  }

  render() {
    const { className, caveWidth, caveHeight, caveCode, dispatchSetCurrentBrush, dispatchSetBrushSize, dispatchPlayCave } = this.props
    const computedClassName = classNames(styles.EditorPage, className)

    return (
      <div className={computedClassName}>
        <div className={styles.editorControls}>
          <BrushSizeSelector className={styles.brushSize} onBrushSizeChange={dispatchSetBrushSize} />
          <CaveDimensionsInput
            className={styles.dimensions}
            onCaveRebuild={this.handleRebuild}
            caveWidth={caveWidth}
            caveHeight={caveHeight} />
          <CopyToClipboard caveCode={caveCode} />
          <div className={styles.undoRedoContainer}>
            <Button className={styles.undoRedoButton} onClick={this.handleUndo}>Undo</Button>
            <Button className={styles.undoRedoButton} onClick={this.handleRedo}>Redo</Button>
          </div>
          <div className={styles.playButtonContainer}>
            <Button className={styles.playButton} onClick={dispatchPlayCave}>Play</Button>
          </div>
          <Palette onTileClick={dispatchSetCurrentBrush} />
        </div>
        <Grid className={styles.grid} ref={grid => (this.grid = grid)} />
      </div>
    )
  }
}
