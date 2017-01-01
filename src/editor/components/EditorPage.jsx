import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import keydown from 'react-keydown'
import { browserHistory } from 'react-router'
import { autobind } from 'core-decorators'
import Palette from 'src/editor/components/Palette'
import Grid from 'src/editor/components/Grid'
import { getTileFromSymbol, TILE_KEYS } from 'src/editor/utils/tiles'
import BrushSizeSelector from 'src/editor/components/BrushSizeSelector'
import CaveDimensionsInput from 'src/editor/components/CaveDimensionsInput'
import CopyToClipboard from 'src/editor/components/CopyToClipboard'
import EditorBanner from 'src/editor/components/EditorBanner'
import Button from 'src/components/Button'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'

import styles from 'src/editor/components/EditorPage.css'

import {
  setCurrentBrush,
  setBrushSize,
  setCaveWidth,
  setCaveHeight,
  startRebuild,
  undoCaveChange,
  redoCaveChange,
  playCave,
  loadImages
} from 'src/editor/actions'
import { logout } from 'src/authentication/actions'
import {
  loadCaves,
  loadCaveIntoGrid
} from 'src/caves/actions'

function mapStateToProps(state) {
  return {
    caveWidth: state.editor.caveWidth,
    caveHeight: state.editor.caveHeight,
    caveCode: state.editor.caveCode,
    caves: state.caves.caves
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
  dispatchPlayCave: playCave,
  dispatchLogout: logout,
  dispatchLoadCaves: loadCaves,
  dispatchLoadCaveIntoGrid: loadCaveIntoGrid,
  dispatchLoadImages: loadImages
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
    dispatchSetCurrentBrush: PropTypes.func,
    dispatchSetBrushSize: PropTypes.func,
    dispatchSetCaveWidth: PropTypes.func,
    dispatchSetCaveHeight: PropTypes.func,
    dispatchStartRebuild: PropTypes.func,
    dispatchUndo: PropTypes.func,
    dispatchRedo: PropTypes.func,
    dispatchPlayCave: PropTypes.func,
    dispatchLogout: PropTypes.func,
    dispatchLoadCaves: PropTypes.func,
    dispatchLoadCaveIntoGrid: PropTypes.func,
    dispatchLoadImages: PropTypes.func
  };

  componentWillMount() {
    this.props.dispatchLoadImages().then(this.props.dispatchLoadCaves)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.caves.length === 0 && nextProps.caves.length > 0) {
      const mostRecentlyOpenedCave = nextProps.caves[0] // TODO: actually get most recently opened cave
      this.props.dispatchLoadCaveIntoGrid(mostRecentlyOpenedCave)
    }
  }

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

  @autobind
  handleLogout() {
    this.props.dispatchLogout()
    browserHistory.replace('/')
  }

  render() {
    const { className, caveWidth, caveHeight, caveCode,
            dispatchSetCurrentBrush, dispatchSetBrushSize,
            dispatchPlayCave } = this.props
    const computedClassName = classNames(styles.EditorPage, className)

    return (
      <div className={computedClassName}>
        <EditorBanner />
        <div className={styles.editor}>
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
            <div className={styles.playButtonContainer}>
              <Button className={styles.playButton} onClick={this.handleLogout}>Logout</Button>
            </div>
            <Palette onTileClick={dispatchSetCurrentBrush} />
          </div>
          <Grid className={styles.grid} ref={grid => (this.grid = grid)} />
        </div>
      </div>
    )
  }
}