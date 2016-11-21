import React, { PureComponent, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import { PALETTE_BRUSHES, PALETTE_IMAGE_PATHS } from 'src/utils/ImageLoader'

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

  renderTileImage(src, index) {
    const brush = PALETTE_BRUSHES[index]
    return (
      <img className={styles.tile} key={brush.fileName} src={src} onClick={() => this.handlePaletteTileClick(brush)} />
    )
  }

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.Palette, className)

    return (
      <div className={computedClassName}>
        {PALETTE_IMAGE_PATHS.map(this.renderTileImage)}
      </div>
    )
  }
}
