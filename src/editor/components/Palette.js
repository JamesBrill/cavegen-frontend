import React, { PureComponent, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import { PALETTE_IMAGE_PATHS } from 'src/utils/ImageLoader'

import styles from 'src/editor/components/Palette.css'

export default class Palette extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  @autobind
  renderTileImage(src) {
    return (
      <img className={styles.tile} src={src} />
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
