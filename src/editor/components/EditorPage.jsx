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
import EditorBanner from 'src/editor/components/EditorBanner'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import { Cave } from 'src/editor/utils/cave'
import { getCaveCodeOfDimensions } from 'src/editor/utils/cave-code'

import styles from 'src/editor/components/EditorPage.css'

import {
  setGrid,
  setCurrentBrush,
  setBrushSize,
  setCaveWidth,
  setCaveHeight,
  startRebuild,
  undoCaveChange,
  redoCaveChange,
  playCave
} from 'src/editor/actions'
import {
  loadCaves,
  loadCaveIntoGrid,
  updateCave
} from 'src/caves/actions'

function mapStateToProps(state) {
  return {
    caveWidth: state.editor.caveWidth,
    caveHeight: state.editor.caveHeight,
    caveCode: state.editor.caveCode,
    currentCaveName: state.caves.currentCaveName,
    currentCaveUuid: state.caves.currentCaveUuid,
    caves: state.caves.caves
  }
}

const mapDispatchToProps = {
  dispatchSetGrid: setGrid,
  dispatchSetCurrentBrush: setCurrentBrush,
  dispatchSetBrushSize: setBrushSize,
  dispatchSetCaveWidth: setCaveWidth,
  dispatchSetCaveHeight: setCaveHeight,
  dispatchStartRebuild: startRebuild,
  dispatchUndo: undoCaveChange,
  dispatchRedo: redoCaveChange,
  dispatchPlayCave: playCave,
  dispatchLoadCaves: loadCaves,
  dispatchLoadCaveIntoGrid: loadCaveIntoGrid,
  dispatchUpdateCave: updateCave
}

const UNDO_KEYS = ['ctrl+z', 'cmd+z']
const REDO_KEYS = ['ctrl+y', 'cmd+y', 'ctrl+shift+z', 'cmd+shift+z']

@connect(mapStateToProps, mapDispatchToProps)
@requiresAuthentication
export default class EditorPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    caveWidth: PropTypes.number,
    caveHeight: PropTypes.number,
    caves: PropTypes.arrayOf(PropTypes.object),
    currentCaveName: PropTypes.string,
    currentCaveUuid: PropTypes.string,
    dispatchSetGrid: PropTypes.func,
    dispatchSetCurrentBrush: PropTypes.func,
    dispatchSetBrushSize: PropTypes.func,
    dispatchSetCaveWidth: PropTypes.func,
    dispatchSetCaveHeight: PropTypes.func,
    dispatchStartRebuild: PropTypes.func,
    dispatchUndo: PropTypes.func,
    dispatchRedo: PropTypes.func,
    dispatchPlayCave: PropTypes.func,
    dispatchLoadCaves: PropTypes.func,
    dispatchLoadCaveIntoGrid: PropTypes.func,
    dispatchUpdateCave: PropTypes.func
  };

  componentWillMount() {
    this.props.dispatchLoadCaves()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.caves.length === 0 && nextProps.caves.length > 0) {
      this.props.dispatchLoadCaveIntoGrid(nextProps.caves[0])
    }
  }

  @autobind
  handleRebuild(width, height) {
    const {
      caveWidth,
      caveHeight,
      dispatchSetGrid,
      dispatchSetCaveWidth,
      dispatchSetCaveHeight,
      dispatchStartRebuild
    } = this.props
    dispatchSetCaveWidth(width || caveWidth)
    dispatchSetCaveHeight(height || caveHeight)
    dispatchStartRebuild()
    dispatchSetGrid(new Cave({
      width: width || caveWidth,
      height: height || caveHeight
    }))
  }

  @autobind
  handleUpdateCave(width, height) {
    const caveCode = getCaveCodeOfDimensions(width, height)
    this.props.dispatchUpdateCave({ text: caveCode })
  }

  @autobind
  @keydown(UNDO_KEYS)
  handleUndo(e) {
    e.preventDefault()
    this.props.dispatchUndo()
  }

  @autobind
  @keydown(REDO_KEYS)
  handleRedo(e) {
    e.preventDefault()
    this.props.dispatchRedo()
  }

  @autobind
  @keydown(TILE_KEYS)
  handleTileKeyPress(e) {
    let tile
    switch (e.key) {
      case 's':
        tile = getTileFromSymbol(' ')
        break
      case ';':
        tile = getTileFromSymbol('\"')
        break

      default:
        tile = getTileFromSymbol(e.key)
    }
    if (tile) {
      this.props.dispatchSetCurrentBrush(tile)
    }
  }

  @autobind
  handleNameChange(e) {
    const name = e.target.value
    this.props.dispatchUpdateCave({ name })
  }

  render() {
    const { className, caveWidth, caveHeight, caveCode, currentCaveName, currentCaveUuid,
            dispatchSetCurrentBrush, dispatchSetBrushSize,
            dispatchPlayCave } = this.props
    const computedClassName = classNames(styles.EditorPage, className)

    return (
      <div className={computedClassName}>
        <EditorBanner onCaveRebuild={this.handleRebuild} />
        <div className={styles.editor}>
          <div className={styles.editorControls}>
            <BrushSizeSelector className={styles.brushSize} onBrushSizeChange={dispatchSetBrushSize} />
            <h2 className={styles.title}>Name</h2>
            <Input onChange={this.handleNameChange} key={currentCaveUuid} defaultValue={currentCaveName} />
            <CaveDimensionsInput
              className={styles.dimensions}
              onCaveRebuild={this.handleRebuild}
              updateCave={this.handleUpdateCave}
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
      </div>
    )
  }
}
