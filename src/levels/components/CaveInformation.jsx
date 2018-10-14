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
import Build from 'src/levels/components/icons/Build'
import ReactTooltip from 'react-tooltip'
import withNavbar from 'src/app/utils/withNavbar'
import { splitCaveCode } from 'src/editor/utils/cave-code'

import styles from 'src/levels/components/CaveInformation.css'

import {
  loadCaveIntoGrid,
  updateCaveCodeOnServer,
  setBackgroundType,
  setTerrainType,
  setWaterType
} from 'src/editor/actions'

function mapStateToProps(state, ownProps) {
  const levelId = ownProps.levelId
  const levels = state.levels.myLevels
  const level = levels.find(x => x.id === levelId)
  const { caveString, backgroundType, terrainType, waterType } = splitCaveCode(
    level.text
  )
  return {
    name: level.name,
    id: level.id,
    author: level.authorName,
    dateCreated: level.dateCreated,
    code: caveString,
    backgroundType,
    terrainType,
    waterType
  }
}

@connect(mapStateToProps, {
  loadCaveIntoGrid,
  updateCaveCodeOnServer,
  setBackgroundType,
  setTerrainType,
  setWaterType
})
@withNavbar
export default class CaveInformation extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    className: PropTypes.string,
    levelId: PropTypes.number,
    name: PropTypes.string,
    id: PropTypes.string,
    author: PropTypes.string,
    dateCreated: PropTypes.string,
    code: PropTypes.string,
    updateCaveCodeOnServer: PropTypes.func,
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
      backgroundType: props.backgroundType,
      terrainType: props.terrainType,
      waterType: props.waterType
    }
  }

  @autobind
  handleNameChange(e) {
    const { id } = this.props
    const name = e.target.value
    this.props.updateCaveCodeOnServer({ id, name })
  }

  @autobind
  handleBackgroundTypeChange(val) {
    const { id } = this.props
    this.setState({ backgroundType: val })
    this.props.setBackgroundType(val)
    this.props.updateCaveCodeOnServer({ id, backgroundType: val })
  }

  @autobind
  handleTerrainTypeChange(val) {
    const { id } = this.props
    this.setState({ terrainType: val })
    this.props.setTerrainType(val)
    this.props.updateCaveCodeOnServer({ id, terrainType: val })
  }

  @autobind
  handleWaterTypeChange(val) {
    const { id } = this.props
    this.setState({ waterType: val })
    this.props.setWaterType(val)
    this.props.updateCaveCodeOnServer({ id, waterType: val })
  }

  @autobind
  handleBuild() {
    const { id } = this.props
    browserHistory.push('/build')
    this.props.loadCaveIntoGrid(id)
  }

  render() {
    const {
      className,
      name,
      id,
      author,
      dateCreated,
      code,
      editableAttributes
    } = this.props
    const { backgroundType, terrainType, waterType } = this.state
    const computedClassName = classNames(styles.CaveInformation, className)
    const nameField = (
      <div className={styles.information}>
        <h2 className={styles.title}>Name:</h2>
        <Input
          className={styles.propertyInput}
          onChange={this.handleNameChange}
          key={id}
          defaultValue={name} />
      </div>
    )
    const backgroundTypeOptions = [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' }
    ]
    const backgroundTypeField = editableAttributes
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
    const terrainTypeField = editableAttributes
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
    const waterTypeField = editableAttributes
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
        <div className={styles.buttonContainer}>
          <CopyToClipboard caveCode={code} data-tip='Copy' />
          <Button
            className={styles.iconButton}
            onClick={this.handleBuild}
            data-tip='Edit'
          >
            <Build className={styles.icon} />
          </Button>
          <ReactTooltip effect='solid' delayShow={250} />
        </div>
      </div>
    )
  }
}
