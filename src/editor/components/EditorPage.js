import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import Palette from 'src/editor/components/Palette'
import Grid from 'src/editor/components/Grid'
import BrushSizeSelector from 'src/editor/components/BrushSizeSelector'

import styles from 'src/editor/components/EditorPage.css'

import { setCurrentBrush, setBrushSize } from 'src/editor/actions'

const mapDispatchToProps = {
  dispatchSetCurrentBrush: setCurrentBrush,
  dispatchSetBrushSize: setBrushSize
}

@connect(null, mapDispatchToProps)
export default class EditorPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatchSetCurrentBrush: PropTypes.func,
    dispatchSetBrushSize: PropTypes.func
  };

  render() {
    const { className, dispatchSetCurrentBrush, dispatchSetBrushSize } = this.props
    const computedClassName = classNames(styles.EditorPage, className)

    return (
      <div className={computedClassName}>
        <div className={styles.editorControls}>
          <BrushSizeSelector onBrushSizeChange={dispatchSetBrushSize} />
          <Palette onTileClick={dispatchSetCurrentBrush} />
        </div>
        <Grid className={styles.grid} />
      </div>
    )
  }
}
