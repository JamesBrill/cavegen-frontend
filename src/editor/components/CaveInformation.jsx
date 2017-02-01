import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import moment from 'moment'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import CopyToClipboard from 'src/editor/components/CopyToClipboard'
import Play from 'src/editor/components/icons/Play'
import Like from 'src/editor/components/icons/Like'
import ReactTooltip from 'react-tooltip'

import styles from 'src/editor/components/CaveInformation.css'

import {
  playCave
} from 'src/editor/actions'
import {
  likeCave,
  updateCave
} from 'src/caves/actions'

function mapStateToProps(state) {
  const currentCaveUuid = state.caves.currentCaveUuid
  const isOwnedByAnotherUser = state.caves.isOwnedByAnotherUser
  const caves = isOwnedByAnotherUser ? state.caves.publicCaves : state.caves.caves
  const currentCave = caves && caves.filter(cave => cave.uuid === currentCaveUuid)[0]
  const hasLikedCurrentCave = state.profile.likedCaves.indexOf(currentCave.id) !== -1
  return {
    caveCode: state.editor.caveCode,
    currentCaveLikes: state.caves.currentCaveLikes,
    currentCaveUuid: state.caves.currentCaveUuid,
    currentCaveName: state.caves.currentCaveName,
    isCurrentCavePublic: state.caves.isCurrentCavePublic,
    isOwnedByAnotherUser: state.caves.isOwnedByAnotherUser,
    currentCave,
    hasLikedCurrentCave
  }
}

const mapDispatchToProps = {
  dispatchPlayCave: playCave,
  dispatchLikeCave: likeCave,
  dispatchUpdateCave: updateCave
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CaveInformation extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    caveCode: PropTypes.string,
    currentCaveLikes: PropTypes.number,
    currentCave: PropTypes.object,
    hasLikedCurrentCave: PropTypes.bool,
    dispatchPlayCave: PropTypes.func,
    dispatchLikeCave: PropTypes.func,
    dispatchUpdateCave: PropTypes.func,
    isCurrentCavePublic: PropTypes.bool,
    isOwnedByAnotherUser: PropTypes.bool,
    currentCaveUuid: PropTypes.string,
    currentCaveName: PropTypes.string
  };

  constructor(props) {
    super(props)

    this.state = {
      publicChecked: false
    }
  }

  componentWillMount() {
    this.setState({ publicChecked: this.props.isCurrentCavePublic })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCurrentCavePublic !== this.props.isCurrentCavePublic) {
      this.setState({ publicChecked: nextProps.isCurrentCavePublic })
    }
  }

  @autobind
  handleNameChange(e) {
    const name = e.target.value
    this.props.dispatchUpdateCave({ name })
  }

  @autobind
  handlePublicChange(e) {
    const isPublic = e.target.checked
    this.props.dispatchUpdateCave({ isPublic })
    this.setState({ publicChecked: isPublic })
  }

  render() {
    const { className, caveCode, currentCave, currentCaveLikes, hasLikedCurrentCave,
            dispatchPlayCave, dispatchLikeCave, isOwnedByAnotherUser,
            currentCaveName, currentCaveUuid } = this.props
    const { publicChecked } = this.state
    const computedClassName = classNames(styles.CaveInformation, className)
    const likeColour = hasLikedCurrentCave ? 'red' : 'white'

    const nameField = isOwnedByAnotherUser ? (
      <div className={styles.information}>
        <h2 className={styles.title}>Name:</h2>
        <h2 className={styles.informationValue}>{currentCave.name}</h2>
      </div>
    ) : (
      <div className={styles.information}>
        <h2 className={styles.title}>Name:</h2>
        <Input
          className={styles.propertyInput}
          onChange={this.handleNameChange}
          key={currentCaveUuid}
          defaultValue={currentCaveName} />
      </div>
    )

    const like = isOwnedByAnotherUser ? (
      <Like className={styles.like} color={likeColour} onClick={dispatchLikeCave} />
    ) : (
      <Like className={styles.like} color='red' />
    )

    return (
      <div className={computedClassName}>
        {nameField}
        <div className={styles.information}>
          <h2 className={styles.title}>Author:</h2>
          <h2 className={styles.informationValue}>{currentCave.authorName}</h2>
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Date created:</h2>
          <h2 className={styles.informationValue}>{moment(currentCave.dateCreated).format('MM/DD/YYYY, h:mm a')}</h2>
        </div>
        {!isOwnedByAnotherUser && (
          <div className={styles.information}>
            <h2 className={styles.title}>Public:</h2>
            <input className={styles.propertyInput} type='checkbox' onChange={this.handlePublicChange} checked={publicChecked} />
          </div>
        )}
        <div className={styles.information}>
          <h2 className={styles.title}>Hearts:</h2>
          <div className={styles.likesContainer}>
            {like}
            <h2 className={styles.informationValue}>{currentCaveLikes}</h2>
          </div>
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
