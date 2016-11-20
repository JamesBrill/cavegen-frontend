import React, { PureComponent, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import classNames from 'classnames'

import styles from 'src/editor/components/Palette.css'

export default class Palette extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    tileImages: PropTypes.arrayOf(PropTypes.string)
  };

  @autobind
  renderTileImage(src) {
    return (
      <img src={src} />
    )
  }

  render() {
    const { className, tileImages } = this.props
    const computedClassName = classNames(styles.Palette, className)

    return (
      <div className={computedClassName}>
        {tileImages.map(this.renderTileImage)}
      </div>
    )
  }
}
