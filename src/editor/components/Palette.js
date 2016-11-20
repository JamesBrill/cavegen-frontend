import React, { PureComponent, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import { PALETTE_IMAGE_NAMES, PALETTE_IMAGE_PATHS } from 'src/utils/ImageLoader'

import styles from 'src/editor/components/Palette.css'

export default class Palette extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  @autobind
  handlePaletteTileClick(tileName) {
    console.log(tileName)
  }

  @autobind
  renderTileImage(src, index) {
    const tileName = PALETTE_IMAGE_NAMES[index]
    return (
      <img className={styles.tile} key={tileName} src={src} onClick={() => this.handlePaletteTileClick(tileName)} />
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
