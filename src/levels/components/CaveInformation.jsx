/* eslint-disable no-shadow */

import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
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
import { splitCaveCode } from 'src/editor/utils/cave-code'

import styles from 'src/levels/components/CaveInformation.css'

import { likeCave, playCave } from 'src/levels/actions'
import {
  updateCave,
  loadCaveIntoGrid,
  updateCaveCodeOnServer,
  setBackgroundType,
  setTerrainType,
  setWaterType
} from 'src/editor/actions'

function mapStateToProps(state, ownProps) {
  const levelId = ownProps.levelId
  const levels = state.levels.myLevels.concat(state.levels.publicLevels)
  const level = levels.find(x => x.id === levelId)
  const userId = state.profile.userId
  const isOwnedByUser = userId === level.author
  const isLikedByUser = state.profile.likedCaves.indexOf(levelId) !== -1
  const { caveString, backgroundType, terrainType, waterType } = splitCaveCode(
    level.text
  )
  return {
    name: level.name,
    uuid: level.uuid,
    author: level.authorName,
    dateCreated: level.dateCreated,
    isPublic: level.isPublic,
    likes: level.likes,
    code: caveString,
    isOwnedByUser,
    isLikedByUser,
    backgroundType,
    terrainType,
    waterType
  }
}

@connect(mapStateToProps, {
  likeCave,
  updateCave,
  playCave,
  loadCaveIntoGrid,
  updateCaveCodeOnServer,
  setBackgroundType,
  setTerrainType,
  setWaterType
})
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
    updateCaveCodeOnServer: PropTypes.func,
    playCave: PropTypes.func,
    loadCaveIntoGrid: PropTypes.func,
    backgroundType: PropTypes.string,
    terrainType: PropTypes.string,
    editableAttributes: PropTypes.bool,
    setBackgroundType: PropTypes.func,
    setTerrainType: PropTypes.func,
    setWaterType: PropTypes.func
  }

  static defaultProps = {
    editableAttributes: true
  }

  constructor(props) {
    super(props)

    this.state = {
      publicChecked: false,
      backgroundType: props.backgroundType,
      terrainType: props.terrainType,
      waterType: props.waterType
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
  handleBackgroundTypeChange(val) {
    const { dispatch, uuid } = this.props
    this.setState({ backgroundType: val })
    dispatch(setBackgroundType(val))
    dispatch(updateCaveCodeOnServer({ backgroundType: val }, uuid))
  }

  @autobind
  handleTerrainTypeChange(val) {
    const { dispatch, uuid } = this.props
    this.setState({ terrainType: val })
    dispatch(setTerrainType(val))
    dispatch(updateCaveCodeOnServer({ terrainType: val }, uuid))
  }

  @autobind
  handleWaterTypeChange(val) {
    const { dispatch, uuid } = this.props
    this.setState({ waterType: val })
    dispatch(setWaterType(val))
    dispatch(updateCaveCodeOnServer({ waterType: val }, uuid))
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
    const {
      className,
      name,
      uuid,
      author,
      dateCreated,
      likes,
      code,
      isOwnedByUser,
      isLikedByUser,
      likeCave,
      playCave,
      editableAttributes
    } = this.props
    const { publicChecked, backgroundType, terrainType, waterType } = this.state
    const computedClassName = classNames(styles.CaveInformation, className)
    const nameField = isOwnedByUser
      ? <div className={styles.information}>
          <h2 className={styles.title}>Name:</h2>
          <Input
            className={styles.propertyInput}
            onChange={this.handleNameChange}
            key={uuid}
            defaultValue={name} />
        </div>
      : <div className={styles.information}>
          <h2 className={styles.title}>Name:</h2>
          <h2 className={styles.informationValue}>
            {name}
          </h2>
        </div>
    const backgroundTypeOptions = [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' }
    ]
    const backgroundTypeField =
      isOwnedByUser && editableAttributes
        ? <div className={styles.information}>
            <h2 className={styles.title}>Background type:</h2>
            <Select
              className={styles.selector}
              options={backgroundTypeOptions}
              onChange={this.handleBackgroundTypeChange}
              value={backgroundType}
              clearable={false}
              searchable={false}
              backspaceRemoves={false}
              deleteRemoves={false} />
          </div>
        : null
    const terrainTypeOptions = [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' }
    ]
    const terrainTypeField =
      isOwnedByUser && editableAttributes
        ? <div className={styles.information}>
            <h2 className={styles.title}>Terrain type:</h2>
            <Select
              className={styles.selector}
              options={terrainTypeOptions}
              onChange={this.handleTerrainTypeChange}
              value={terrainType}
              clearable={false}
              searchable={false}
              backspaceRemoves={false}
              deleteRemoves={false} />
          </div>
        : null
    const waterTypeOptions = [
      { value: 'clear', label: 'clear' },
      { value: 'dark', label: 'dark' },
      { value: 'murky', label: 'murky' }
    ]
    const waterTypeField =
      isOwnedByUser && editableAttributes
        ? <div className={styles.information}>
            <h2 className={styles.title}>Water type:</h2>
            <Select
              className={styles.selector}
              options={waterTypeOptions}
              onChange={this.handleWaterTypeChange}
              value={waterType}
              clearable={false}
              searchable={false}
              backspaceRemoves={false}
              deleteRemoves={false} />
          </div>
        : null
    const likeColour = isLikedByUser ? 'red' : 'white'
    const likeIcon = isOwnedByUser
      ? <Like className={styles.like} color='red' />
      : <Like
        className={styles.like}
        color={likeColour}
        onClick={() => likeCave(uuid)} />

    return (
      <div className={computedClassName}>
        {nameField}
        <div className={styles.information}>
          <h2 className={styles.title}>Author:</h2>
          <h2 className={styles.informationValue}>
            {author}
          </h2>
        </div>
        {backgroundTypeField}
        {terrainTypeField}
        {waterTypeField}
        <div className={styles.information}>
          <h2 className={styles.title}>Date created:</h2>
          <h2 className={styles.informationValue}>
            {moment(dateCreated).format('MM/DD/YYYY, h:mm a')}
          </h2>
        </div>
        {isOwnedByUser &&
          <div className={styles.information}>
            <h2 className={styles.title}>Public:</h2>
            <input
              className={styles.propertyInput}
              type='checkbox'
              onChange={this.handlePublicChange}
              checked={publicChecked} />
          </div>}
        <div className={styles.information}>
          <h2 className={styles.title}>Hearts:</h2>
          <div className={styles.likesContainer}>
            {likeIcon}
            <h2 className={styles.informationValue}>
              {likes}
            </h2>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <CopyToClipboard caveCode={code} data-tip='Copy' />
          <Button
            className={styles.iconButton}
            onClick={() => playCave(uuid)}
            data-tip='Play'
          >
            <Play className={styles.icon} />
          </Button>
          {isOwnedByUser &&
            <Button
              className={styles.iconButton}
              onClick={this.handleBuild}
              data-tip='Edit'
            >
              <Build className={styles.icon} />
            </Button>}
          <ReactTooltip effect='solid' delayShow={250} />
        </div>
      </div>
    )
  }
}
