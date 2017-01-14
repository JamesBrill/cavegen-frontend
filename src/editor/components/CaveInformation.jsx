import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import moment from 'moment'
import Button from 'src/components/Button'
import CopyToClipboard from 'src/editor/components/CopyToClipboard'
import Play from 'src/editor/components/icons/Play'
import ReactTooltip from 'react-tooltip'

import styles from 'src/editor/components/CaveInformation.css'

import {
  playCave
} from 'src/editor/actions'

function mapStateToProps(state) {
  const currentCaveUuid = state.caves.currentCaveUuid
  const isOwnedByAnotherUser = state.caves.isOwnedByAnotherUser
  const caves = isOwnedByAnotherUser ? state.caves.publicCaves : state.caves.caves
  const currentCave = caves && caves.filter(cave => cave.uuid === currentCaveUuid)[0]
  return {
    caveCode: state.editor.caveCode,
    currentCave
  }
}

const mapDispatchToProps = {
  dispatchPlayCave: playCave
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CaveInformation extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    caveCode: PropTypes.string,
    currentCave: PropTypes.object,
    dispatchPlayCave: PropTypes.func
  };

  render() {
    const { className, caveCode, currentCave, dispatchPlayCave } = this.props
    const computedClassName = classNames(styles.CaveInformation, className)

    return (
      <div className={computedClassName}>
        <div className={styles.information}>
          <h2 className={styles.title}>Name:</h2>
          <h2 className={styles.informationValue}>{currentCave.name}</h2 >
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Author:</h2>
          <h2 className={styles.informationValue}>{currentCave.authorName}</h2>
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Date created:</h2>
          <h2 className={styles.informationValue}>{moment(currentCave.dateCreated).format('MM/DD/YYYY, h:mm a')}</h2>
        </div>
        <div className={styles.buttonContainer}>
          <CopyToClipboard caveCode={caveCode} data-tip='Undo' />
          <Button className={styles.iconButton} onClick={dispatchPlayCave} data-tip='Play'>
            <Play className={styles.icon} />
          </Button>
          <ReactTooltip effect='solid' delayShow={250} />
        </div>
      </div>
    )
  }
}
