import React, { PureComponent, PropTypes } from 'react'
import Modal from 'src/components/Modal'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import CaveDimensionsInput from 'src/editor/components/CaveDimensionsInput'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { updateCave } from 'src/caves/actions'
import { getCaveCodeOfDimensions } from 'src/editor/utils/cave-code'

import styles from './PropertiesModal.css'

function mapStateToProps(state) {
  return {
    displayName: state.profile.displayName,
    currentCaveUuid: state.caves.currentCaveUuid,
    currentCaveName: state.caves.currentCaveName,
    isCurrentCavePublic: state.caves.isCurrentCavePublic,
    caveWidth: state.editor.caveWidth,
    caveHeight: state.editor.caveHeight,
    isOwnedByAnotherUser: state.caves.isOwnedByAnotherUser
  }
}

@connect(mapStateToProps, { updateCave })
export default class PropertiesModal extends PureComponent {
  static propTypes = {
    logout: PropTypes.func,
    displayName: PropTypes.string,
    currentCaveUuid: PropTypes.string,
    currentCaveName: PropTypes.string,
    isCurrentCavePublic: PropTypes.bool,
    caveWidth: PropTypes.number,
    caveHeight: PropTypes.number,
    onCaveRebuild: PropTypes.func.isRequired,
    isOwnedByAnotherUser: PropTypes.bool
  };

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  @autobind
  handleClick() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  @autobind
  handleClose() {
    this.setState({ isOpen: false })
  }

  @autobind
  handleNameChange(e) {
    const name = e.target.value
    this.props.updateCave({ name })
  }

  @autobind
  handleUpdateCave(width, height) {
    const caveCode = getCaveCodeOfDimensions(width, height)
    this.props.updateCave({ text: caveCode })
  }

  @autobind
  handleRebuild(width, height) {
    this.props.onCaveRebuild(width, height)
    this.handleClose()
  }

  @autobind
  handlePublicChange(e) {
    const isPublic = e.target.checked
    this.props.updateCave({ isPublic })
  }

  render() {
    const { currentCaveUuid, currentCaveName, isCurrentCavePublic,
            caveWidth, caveHeight, isOwnedByAnotherUser } = this.props
    const { isOpen } = this.state

    if (isOwnedByAnotherUser) {
      return (
        <div className={styles.PropertiesModal}>
          <Button className={styles.openButton} onClick={this.handleClick}>Properties</Button>
          <Modal className={styles.reducedModal} isOpen={isOpen} onRequestClose={this.handleClose}>
            <div className={styles.modalContents}>
              <div className={styles.content}>
                <h2 className={styles.title}>Name</h2>
                <span className={styles.immutableProperty}>{currentCaveName}</span>
              </div>
            </div>
          </Modal>
        </div>
      )
    }

    return (
      <div className={styles.PropertiesModal}>
        <Button className={styles.openButton} onClick={this.handleClick}>Properties</Button>
        <Modal className={styles.modal} isOpen={isOpen} onRequestClose={this.handleClose}>
          <div className={styles.modalContents}>
            <div className={styles.content}>
              <h2 className={styles.title}>Name</h2>
              <Input onChange={this.handleNameChange} key={currentCaveUuid} defaultValue={currentCaveName} />
            </div>
            <div className={styles.content}>
              <h2 className={styles.title}>Public</h2>
              <input type='checkbox' onChange={this.handlePublicChange} defaultChecked={isCurrentCavePublic} />
            </div>
            <CaveDimensionsInput
              className={styles.content}
              onCaveRebuild={this.handleRebuild}
              updateCave={this.handleUpdateCave}
              caveWidth={caveWidth}
              caveHeight={caveHeight} />
          </div>
        </Modal>
      </div>
    )
  }
}
