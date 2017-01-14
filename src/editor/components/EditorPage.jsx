import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import keydown from 'react-keydown'
import { autobind } from 'core-decorators'
import Grid from 'src/editor/components/Grid'
import { getTileFromSymbol, TILE_KEYS } from 'src/editor/utils/tiles'
import EditorBanner from 'src/editor/components/EditorBanner'
import EditorControls from 'src/editor/components/EditorControls'
import CaveInformation from 'src/editor/components/CaveInformation'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import { Cave } from 'src/editor/utils/cave'

import styles from 'src/editor/components/EditorPage.css'

import {
  setGrid,
  setCurrentBrush,
  setCaveWidth,
  setCaveHeight,
  startRebuild
} from 'src/editor/actions'
import {
  loadCaves,
  loadPublicCaves,
  loadCaveIntoGrid
} from 'src/caves/actions'

function mapStateToProps(state) {
  return {
    caveWidth: state.editor.caveWidth,
    caveHeight: state.editor.caveHeight,
    caves: state.caves.caves,
    isOwnedByAnotherUser: state.caves.isOwnedByAnotherUser
  }
}

const mapDispatchToProps = {
  dispatchSetGrid: setGrid,
  dispatchSetCurrentBrush: setCurrentBrush,
  dispatchSetCaveWidth: setCaveWidth,
  dispatchSetCaveHeight: setCaveHeight,
  dispatchStartRebuild: startRebuild,
  dispatchLoadCaves: loadCaves,
  dispatchLoadPublicCaves: loadPublicCaves,
  dispatchLoadCaveIntoGrid: loadCaveIntoGrid
}

@connect(mapStateToProps, mapDispatchToProps)
@requiresAuthentication
export default class EditorPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    caveWidth: PropTypes.number,
    caveHeight: PropTypes.number,
    caves: PropTypes.arrayOf(PropTypes.object),
    isOwnedByAnotherUser: PropTypes.bool,
    dispatchSetGrid: PropTypes.func,
    dispatchSetCurrentBrush: PropTypes.func,
    dispatchSetCaveWidth: PropTypes.func,
    dispatchSetCaveHeight: PropTypes.func,
    dispatchStartRebuild: PropTypes.func,
    dispatchLoadCaves: PropTypes.func,
    dispatchLoadPublicCaves: PropTypes.func,
    dispatchLoadCaveIntoGrid: PropTypes.func
  };

  componentWillMount() {
    this.props.dispatchLoadCaves()
    this.props.dispatchLoadPublicCaves()
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
      case ':':
        tile = getTileFromSymbol('\'')
        break

      default:
        tile = getTileFromSymbol(e.key)
    }
    if (tile) {
      this.props.dispatchSetCurrentBrush(tile)
    }
  }

  render() {
    const { className, isOwnedByAnotherUser } = this.props
    const computedClassName = classNames(styles.EditorPage, className)

    const controls = isOwnedByAnotherUser ?
      <CaveInformation className={styles.editorControls} /> :
      <EditorControls className={styles.editorControls} />

    return (
      <div className={computedClassName}>
        <EditorBanner onCaveRebuild={this.handleRebuild} />
        <div className={styles.editor}>
          {controls}
          <Grid className={styles.grid} ref={grid => (this.grid = grid)} />
        </div>
      </div>
    )
  }
}
