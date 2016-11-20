import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { preloadImages } from 'src/editor/utils/image-preloader'
import { getBorder, getTileSize } from 'src/editor/utils/tiles'
import { addMouseEventListeners, addKeyboardEventListeners } from 'src/editor/utils/event-listener-builder'
import { Cave } from 'src/editor/utils/cave'
import { CaveView } from 'src/editor/utils/cave-view'
import { connect } from 'react-redux'

import { setGrid, setCaveView } from 'src/editor/actions'

import styles from 'src/editor/components/Grid.css'

function mapStateToProps(state) {
  return {
    grid: state.editor.grid,
    caveView: state.editor.caveView,
    caveViewModel: state.editor.caveViewModel,
    caveStorage: state.editor.caveStorage,
    currentBrush: state.editor.currentBrush
  }
}

@connect(mapStateToProps)
export default class Grid extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func,
    grid: PropTypes.object,
    caveView: PropTypes.object,
    caveViewModel: PropTypes.object,
    caveStorage: PropTypes.object
  };

  componentWillMount() {
    const { dispatch, grid, caveView, caveViewModel } = this.props
    preloadImages()
    dispatch(setGrid(new Cave(40, 40)))
    const tileSize = getTileSize(40, 40)
    const border = getBorder(40, 40)
    dispatch(setCaveView(new CaveView(40, 40, tileSize, border)))
    caveView.draw(grid)
    addMouseEventListeners(caveView, caveViewModel)
    addKeyboardEventListeners(caveView)
  }

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.Grid, className)

    return (
      <div className={computedClassName}>
        <canvas className={styles.canvas} />
      </div>
    )
  }
}
