import React, { PureComponent, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import { PALETTE_BRUSHES } from 'src/utils/ImageLoader'

import styles from 'src/editor/components/Palette.css'

export default class Palette extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onTileClick: PropTypes.func
  };

  @autobind
  handlePaletteTileClick(brush) {
    const { onTileClick } = this.props
    onTileClick(brush)
  }

  @autobind
  renderTiles(category) {
    const brushes = PALETTE_BRUSHES[category]
    return (
      <div>
        <h2 className={styles.title}>{category}</h2>
        <div className={styles.tiles}>
          {brushes.map(this.renderTile)}
        </div>
      </div>
    )
  }

  @autobind
  renderTile(brush) {
    return (
      <img
        className={styles.tile}
        key={brush.fileName}
        src={brush.imagePath}
        onClick={() => this.handlePaletteTileClick(brush)}
        data-tip={brush.tooltip}
        data-effect='float' />
    )
  }

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.Palette, className)

    return (
      <div className={computedClassName}>
        <div>
          {Object.keys(PALETTE_BRUSHES).map(this.renderTiles)}
        </div>
      </div>
    )
  }
}
