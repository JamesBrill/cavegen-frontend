import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { PALETTE_BRUSHES_LIST } from 'src/utils/ImageLoader'
import { Cave } from 'src/editor/utils/cave'

import styles from 'src/levels/components/LevelPreview.css'

const WIDTH = 250
const HEIGHT = 250

function mapStateToProps(state, ownProps) {
  const levelId = ownProps.levelId
  const levels = state.levels.myLevels.concat(state.levels.publicLevels)
  const level = levels.find(x => x.id === levelId)
  const grid = new Cave({ caveString: level.text })
  const imageMap = state.editor.imageMap
  return { grid, imageMap }
}

@connect(mapStateToProps)
export default class LevelPreview extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    grid: PropTypes.object,
    imageMap: PropTypes.arrayOf(PropTypes.object)
  };

  componentDidMount() {
    this.renderGrid()
  }

  @autobind
  renderCell(cell) {
    if (cell.symbol === ' ') {
      return (
        <div className={styles.cellWrapper}>
          <img className={styles.cell} src='/static/misc/black.png' />
        </div>
      )
    }
    const imagePath = PALETTE_BRUSHES_LIST[cell.symbol]
    return (
      <div className={styles.cellWrapper}>
        <img className={styles.cell} src={imagePath} />
      </div>
    )
  }

  @autobind
  renderGrid() {
    const { grid, imageMap } = this.props
    const context = this.canvas.getContext('2d')
    const tileWidth = WIDTH / grid.width
    const tileHeight = HEIGHT / grid.height
    const tileSize = Math.floor((tileWidth * grid.height > HEIGHT) ? tileHeight : tileWidth)
    const xOffset = Math.floor((WIDTH - (tileSize * grid.width)) / 2)
    const yOffset = Math.floor((HEIGHT - (tileSize * grid.height)) / 2)
    grid.grid.forEach((column, columnIndex) => {
      column.forEach((cell, rowIndex) => {
        const fileName = PALETTE_BRUSHES_LIST.find(x => x.symbol === cell.symbol).fileName
        const image = imageMap.filter(x => x.fileName === fileName)[0].image
        const left = Math.floor(columnIndex * tileSize)
        const top = Math.floor(rowIndex * tileSize)
        context.drawImage(image, left + xOffset, top + yOffset, tileSize, tileSize)
      })
    })
  }

  @autobind
  getCanvasWidth() {
    return (this.canvas && this.canvas.clientWidth) || WIDTH
  }

  @autobind
  getCanvasHeight() {
    return (this.canvas && this.canvas.clientHeight) || HEIGHT
  }

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.LevelPreview, className)
    const newCanvasWidth = this.getCanvasWidth()
    const newCanvasHeight = this.getCanvasHeight()
    return (
      <div className={computedClassName}>
        <canvas
          width={newCanvasWidth}
          height={newCanvasHeight}
          ref={canvas => (this.canvas = canvas)} />
      </div>
    )
  }
}
