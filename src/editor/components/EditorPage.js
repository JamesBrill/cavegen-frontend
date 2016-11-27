import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import Palette from 'src/editor/components/Palette'
import Grid from 'src/editor/components/Grid'

import styles from 'src/editor/components/EditorPage.css'

import { setCurrentBrush } from 'src/editor/actions'

const mapDispatchToProps = {
  dispatchSetCurrentBrush: setCurrentBrush
}

@connect(null, mapDispatchToProps)
export default class EditorPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatchSetCurrentBrush: PropTypes.func
  };

  render() {
    const { className, dispatchSetCurrentBrush } = this.props
    const computedClassName = classNames(styles.EditorPage, className)

    return (
      <div className={computedClassName}>
        <Palette className={styles.palette} onTileClick={dispatchSetCurrentBrush} />
        <Grid className={styles.grid} />
      </div>
    )
  }
}
