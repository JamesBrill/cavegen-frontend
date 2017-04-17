import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import Grid from 'src/editor/components/Grid'
import SidePanel from 'src/editor/components/SidePanel'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'
import { Cave } from 'src/editor/utils/cave'

import styles from 'src/editor/components/EditorPage.css'

import {
  setGrid,
  setCurrentBrush,
  setCaveWidth,
  setCaveHeight,
  startRebuild,
  loadCaveIntoGrid
} from 'src/editor/actions'
import {
  loadMyLevels,
  loadPublicLevels
} from 'src/levels/actions'

function mapStateToProps(state) {
  return {
    caveWidth: state.editor.caveWidth,
    caveHeight: state.editor.caveHeight,
    caves: state.levels.myLevels,
    openTab: state.editor.openTab
  }
}

const mapDispatchToProps = {
  dispatchSetGrid: setGrid,
  dispatchSetCurrentBrush: setCurrentBrush,
  dispatchSetCaveWidth: setCaveWidth,
  dispatchSetCaveHeight: setCaveHeight,
  dispatchStartRebuild: startRebuild,
  dispatchLoadMyLevels: loadMyLevels,
  dispatchLoadPublicLevels: loadPublicLevels,
  dispatchLoadCaveIntoGrid: loadCaveIntoGrid
}

@connect(mapStateToProps, mapDispatchToProps)
@requiresAuthentication
@withNavbar
export default class EditorPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    caveWidth: PropTypes.number,
    caveHeight: PropTypes.number,
    caves: PropTypes.arrayOf(PropTypes.object),
    dispatchSetGrid: PropTypes.func,
    dispatchSetCurrentBrush: PropTypes.func,
    dispatchSetCaveWidth: PropTypes.func,
    dispatchSetCaveHeight: PropTypes.func,
    dispatchStartRebuild: PropTypes.func,
    dispatchLoadMyLevels: PropTypes.func,
    dispatchLoadPublicLevels: PropTypes.func,
    dispatchLoadCaveIntoGrid: PropTypes.func,
    openTab: PropTypes.oneOf(['palette', 'properties'])
  };

  componentWillMount() {
    this.props.dispatchLoadMyLevels()
    this.props.dispatchLoadPublicLevels()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.caves.length === 0 && nextProps.caves.length > 0) {
      this.props.dispatchLoadCaveIntoGrid(nextProps.caves[0])
    }
  }

  @autobind
  handleRebuild(width, height) {
    const {
      caveWidth,
      caveHeight,
      dispatchSetGrid,
      dispatchSetCaveWidth,
      dispatchSetCaveHeight,
      dispatchStartRebuild
    } = this.props
    dispatchSetCaveWidth(width || caveWidth)
    dispatchSetCaveHeight(height || caveHeight)
    dispatchStartRebuild()
    dispatchSetGrid(new Cave({
      width: width || caveWidth,
      height: height || caveHeight
    }))
  }

  render() {
    const { className, openTab, children } = this.props
    const computedClassName = classNames(styles.EditorPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.editor}>
          <SidePanel openTab={openTab} />
          <Grid className={styles.grid} ref={grid => (this.grid = grid)} />
        </div>
      </div>
    )
  }
}
