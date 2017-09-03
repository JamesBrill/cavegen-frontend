/* eslint-disable no-shadow */

import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import moment from 'moment'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import CopyToClipboard from 'src/editor/components/CopyToClipboard'
import Like from 'src/editor/components/icons/Like'
import Play from 'src/editor/components/icons/Play'
import Build from 'src/levels/components/icons/Build'
import ReactTooltip from 'react-tooltip'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'
import { splitCaveStringAndEvents } from 'src/editor/utils/cave-code'

import styles from 'src/levels/components/CaveInformation.css'

import { likeCave, playCave } from 'src/levels/actions'
import { updateCave, loadCaveIntoGrid } from 'src/editor/actions'

function mapStateToProps(state, ownProps) {
  const levelId = ownProps.levelId
  const levels = state.levels.myLevels.concat(state.levels.publicLevels)
  const level = levels.find(x => x.id === levelId)
  const userId = state.profile.userId
  const isOwnedByUser = userId === level.author
  const isLikedByUser = state.profile.likedCaves.indexOf(levelId) !== -1
  const { caveString } = splitCaveStringAndEvents(level.text)
  return {
    name: level.name,
    uuid: level.uuid,
    author: level.authorName,
    dateCreated: level.dateCreated,
    isPublic: level.isPublic,
    likes: level.likes,
    code: caveString,
    isOwnedByUser,
    isLikedByUser
  }
}

@connect(mapStateToProps, { likeCave, updateCave, playCave, loadCaveIntoGrid })
@requiresAuthentication
@withNavbar
export default class CaveInformation extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    levelId: PropTypes.number,
    name: PropTypes.string,
    uuid: PropTypes.string,
    author: PropTypes.string,
    dateCreated: PropTypes.string,
    isPublic: PropTypes.bool,
    likes: PropTypes.number,
    code: PropTypes.string,
    isOwnedByUser: PropTypes.bool,
    isLikedByUser: PropTypes.bool,
    likeCave: PropTypes.func,
    updateCave: PropTypes.func,
    playCave: PropTypes.func,
    loadCaveIntoGrid: PropTypes.func
  };

  constructor(props) {
    super(props)

    this.state = {
      publicChecked: false
    }
  }

  componentWillMount() {
    this.setState({ publicChecked: this.props.isPublic })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPublic !== this.props.isPublic) {
      this.setState({ publicChecked: nextProps.isPublic })
    }
  }

  @autobind
  handleNameChange(e) {
    const { updateCave, uuid } = this.props
    const name = e.target.value
    updateCave({ name }, uuid)
  }

  @autobind
  handlePublicChange(e) {
    const { updateCave, uuid } = this.props
    const isPublic = e.target.checked
    updateCave({ isPublic }, uuid)
    this.setState({ publicChecked: isPublic })
  }

  @autobind
  handleBuild() {
    const { uuid, loadCaveIntoGrid } = this.props
    browserHistory.push('/build')
    loadCaveIntoGrid(uuid)
  }

  render() {
    const { className, name, uuid, author, dateCreated, likes, code,
            isOwnedByUser, isLikedByUser, likeCave, playCave } = this.props
    const { publicChecked } = this.state
    const computedClassName = classNames(styles.CaveInformation, className)
    const nameField = isOwnedByUser ? (
      <div className={styles.information}>
        <h2 className={styles.title}>Name:</h2>
        <Input
          className={styles.propertyInput}
          onChange={this.handleNameChange}
          key={uuid}
          defaultValue={name} />
      </div>
    ) : (
      <div className={styles.information}>
        <h2 className={styles.title}>Name:</h2>
        <h2 className={styles.informationValue}>{name}</h2>
      </div>
    )
    const likeColour = isLikedByUser ? 'red' : 'white'
    const likeIcon = isOwnedByUser ? (
      <Like className={styles.like} color='red' />
    ) : (
      <Like className={styles.like} color={likeColour} onClick={() => likeCave(uuid)} />
    )

    return (
      <div className={computedClassName}>
        {nameField}
        <div className={styles.information}>
          <h2 className={styles.title}>Author:</h2>
          <h2 className={styles.informationValue}>{author}</h2>
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Date created:</h2>
          <h2 className={styles.informationValue}>{moment(dateCreated).format('MM/DD/YYYY, h:mm a')}</h2>
        </div>
        {isOwnedByUser && (
          <div className={styles.information}>
            <h2 className={styles.title}>Public:</h2>
            <input
              className={styles.propertyInput}
              type='checkbox'
              onChange={this.handlePublicChange}
              checked={publicChecked} />
          </div>
        )}
        <div className={styles.information}>
          <h2 className={styles.title}>Hearts:</h2>
          <div className={styles.likesContainer}>
            {likeIcon}
            <h2 className={styles.informationValue}>{likes}</h2>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <CopyToClipboard caveCode={code} data-tip='Copy' />
          <Button className={styles.iconButton} onClick={() => playCave(uuid)} data-tip='Play'>
            <Play className={styles.icon} />
          </Button>
          {isOwnedByUser && (
            <Button className={styles.iconButton} onClick={this.handleBuild} data-tip='Edit'>
              <Build className={styles.icon} />
            </Button>
          )}
          <ReactTooltip effect='solid' delayShow={250} />
        </div>
      </div>
    )
  }
}
