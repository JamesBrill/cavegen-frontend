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
} from 'src/levels/actions'
import {
  updateCave
} from 'src/editor/actions'

function mapStateToProps(state) {
  const caveUuid = state.editor.caveUuid
  const caves = state.levels.myLevels
  const currentCave = caves && caves.filter(cave => cave.uuid === caveUuid)[0]
  return {
    caveCode: state.editor.caveCode,
    caveLikes: state.editor.caveLikes,
    caveUuid: state.editor.caveUuid,
    caveName: state.editor.caveName,
    isCavePublic: state.editor.isCavePublic,
    currentCave
  }
}

const mapDispatchToProps = {
  dispatchPlayCave: playCave,
  dispatchUpdateCave: updateCave
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CaveInformation extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    caveCode: PropTypes.string,
    caveLikes: PropTypes.number,
    currentCave: PropTypes.object,
    dispatchPlayCave: PropTypes.func,
    dispatchUpdateCave: PropTypes.func,
    isCavePublic: PropTypes.bool,
    caveUuid: PropTypes.string,
    caveName: PropTypes.string
  };

  constructor(props) {
    super(props)

    this.state = {
      publicChecked: false
    }
  }

  componentWillMount() {
    this.setState({ publicChecked: this.props.isCavePublic })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCavePublic !== this.props.isCavePublic) {
      this.setState({ publicChecked: nextProps.isCavePublic })
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
    const { className, caveCode, currentCave, caveLikes, dispatchPlayCave,
            caveName, caveUuid } = this.props
    const { publicChecked } = this.state
    const computedClassName = classNames(styles.CaveInformation, className)

    return (
      <div className={computedClassName}>
        <div className={styles.information}>
          <h2 className={styles.title}>Name:</h2>
          <Input
            className={styles.propertyInput}
            onChange={this.handleNameChange}
            key={caveUuid}
            defaultValue={caveName} />
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Author:</h2>
          <h2 className={styles.informationValue}>{currentCave.authorName}</h2>
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Date created:</h2>
          <h2 className={styles.informationValue}>{moment(currentCave.dateCreated).format('MM/DD/YYYY, h:mm a')}</h2>
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Public:</h2>
          <input className={styles.propertyInput} type='checkbox' onChange={this.handlePublicChange} checked={publicChecked} />
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Hearts:</h2>
          <div className={styles.likesContainer}>
            <Like className={styles.like} color='red' />
            <h2 className={styles.informationValue}>{caveLikes}</h2>
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
