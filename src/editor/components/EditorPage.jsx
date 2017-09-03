import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import Grid from 'src/editor/components/Grid'
import EditorControls from 'src/editor/components/EditorControls'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/editor/components/EditorPage.css'

import { loadCaveIntoGrid } from 'src/editor/actions'

function mapStateToProps(state) {
  return {
    caves: state.levels.myLevels
  }
}

const mapDispatchToProps = {
  dispatchLoadCaveIntoGrid: loadCaveIntoGrid
}

@connect(mapStateToProps, mapDispatchToProps)
@requiresAuthentication
@withNavbar
export default class EditorPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    caves: PropTypes.arrayOf(PropTypes.object),
    dispatchLoadMyLevels: PropTypes.func,
    dispatchLoadPublicLevels: PropTypes.func,
    dispatchLoadCaveIntoGrid: PropTypes.func
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.caves.length === 0 && nextProps.caves.length > 0) {
      this.props.dispatchLoadCaveIntoGrid(nextProps.caves[0].uuid)
    }
  }

  render() {
    const { className, children } = this.props
    const computedClassName = classNames(styles.EditorPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.editor}>
          <EditorControls className={styles.editorControls} />
          <Grid className={styles.grid} ref={grid => (this.grid = grid)} />
        </div>
      </div>
    )
  }
}
