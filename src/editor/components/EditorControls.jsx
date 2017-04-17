import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import keydown from 'react-keydown'
import Button from 'src/components/Button'
import BrushSizeSelector from 'src/editor/components/BrushSizeSelector'
import CopyToClipboard from 'src/editor/components/CopyToClipboard'
import Play from 'src/editor/components/icons/Play'
import Undo from 'src/editor/components/icons/Undo'
import Redo from 'src/editor/components/icons/Redo'
import Palette from 'src/editor/components/Palette'
import ReactTooltip from 'react-tooltip'

import styles from 'src/editor/components/EditorControls.css'

import {
  playCave
} from 'src/levels/actions'
import {
  setCurrentBrush,
  setBrushSize,
  undoCaveChange,
  redoCaveChange,
  fillRegion
} from 'src/editor/actions'

function mapStateToProps(state) {
  return {
    caveCode: state.editor.caveCode,
    currentBrush: state.editor.currentBrush
  }
}

const mapDispatchToProps = {
  dispatchSetCurrentBrush: setCurrentBrush,
  dispatchSetBrushSize: setBrushSize,
  dispatchUndo: undoCaveChange,
  dispatchRedo: redoCaveChange,
  dispatchPlayCave: playCave,
  dispatchFillRegion: fillRegion
}

const UNDO_KEYS = ['ctrl+z', 'cmd+z']
const REDO_KEYS = ['ctrl+y', 'cmd+y', 'ctrl+shift+z', 'cmd+shift+z']

@connect(mapStateToProps, mapDispatchToProps)
export default class EditorControls extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    caveCode: PropTypes.string,
    dispatchSetCurrentBrush: PropTypes.func,
    dispatchSetBrushSize: PropTypes.func,
    dispatchUndo: PropTypes.func,
    dispatchRedo: PropTypes.func,
    dispatchPlayCave: PropTypes.func,
    dispatchFillRegion: PropTypes.func
  };

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

  render() {
    const { className, caveCode, currentBrush, dispatchSetBrushSize,
            dispatchPlayCave, dispatchSetCurrentBrush, dispatchFillRegion } = this.props
    const computedClassName = classNames(styles.EditorControls, className)

    return (
      <div className={computedClassName}>
        <BrushSizeSelector className={styles.brushSize} onBrushSizeChange={dispatchSetBrushSize} />
        <div className={styles.buttonContainer}>
          <CopyToClipboard caveCode={caveCode} data-tip='Undo' />
          <Button className={styles.iconButton} onClick={this.handleUndo} data-tip='Undo'>
            <Undo className={styles.icon} />
          </Button>
          <Button className={styles.iconButton} onClick={this.handleRedo} data-tip='Redo'>
            <Redo className={styles.icon} />
          </Button>
          <Button className={styles.iconButton} onClick={dispatchPlayCave} data-tip='Play'>
            <Play className={styles.icon} />
          </Button>
          <ReactTooltip effect='solid' delayShow={250} />
        </div>
        <Palette
          onTileClick={dispatchSetCurrentBrush}
          onFillRegion={dispatchFillRegion}
          selectedTile={currentBrush} />
      </div>
    )
  }
}
