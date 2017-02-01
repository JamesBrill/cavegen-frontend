import React, { PureComponent, PropTypes } from 'react'
import Modal from 'src/components/Modal'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import Like from 'src/editor/components/icons/Like'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { updateCave, loadPublicCaves } from 'src/caves/actions'

import styles from './PropertiesModal.css'

function mapStateToProps(state) {
  return {
    displayName: state.profile.displayName,
    currentCaveUuid: state.caves.currentCaveUuid,
    currentCaveName: state.caves.currentCaveName,
    isCurrentCavePublic: state.caves.isCurrentCavePublic,
    caveWidth: state.editor.caveWidth,
    caveHeight: state.editor.caveHeight,
    isOwnedByAnotherUser: state.caves.isOwnedByAnotherUser,
    currentCaveLikes: state.caves.currentCaveLikes
  }
}

@connect(mapStateToProps, { updateCave, loadPublicCaves })
export default class PropertiesModal extends PureComponent {
  static propTypes = {
    logout: PropTypes.func,
    displayName: PropTypes.string,
    currentCaveUuid: PropTypes.string,
    currentCaveName: PropTypes.string,
    isCurrentCavePublic: PropTypes.bool,
    caveWidth: PropTypes.number,
    caveHeight: PropTypes.number,
    isOwnedByAnotherUser: PropTypes.bool,
    updateCave: PropTypes.func,
    loadPublicCaves: PropTypes.func,
    currentCaveLikes: PropTypes.number
  };

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      publicCavesNeedUpdating: false
    }
  }

  @autobind
  handleClick() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  @autobind
  handleClose() {
    if (this.state.publicCavesNeedUpdating) {
      this.props.loadPublicCaves()
    }
    this.setState({ isOpen: false, publicCavesNeedUpdating: false })
  }

  @autobind
  handleNameChange(e) {
    const name = e.target.value
    this.props.updateCave({ name })
    this.setState({ publicCavesNeedUpdating: true })
  }

  @autobind
  handlePublicChange(e) {
    const isPublic = e.target.checked
    this.props.updateCave({ isPublic })
    this.setState({ publicCavesNeedUpdating: true })
  }

  render() {
    const { currentCaveUuid, currentCaveName, isCurrentCavePublic,
            isOwnedByAnotherUser, currentCaveLikes } = this.props
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

    const modalStyle = isCurrentCavePublic ? styles.modal : styles.privateModal
    return (
      <div className={styles.PropertiesModal}>
        <Button className={styles.openButton} onClick={this.handleClick}>Properties</Button>
        <Modal className={modalStyle} isOpen={isOpen} onRequestClose={this.handleClose}>
          <div className={styles.modalContents}>
            <div className={styles.content}>
              <h2 className={styles.title}>Name</h2>
              <Input onChange={this.handleNameChange} key={currentCaveUuid} defaultValue={currentCaveName} />
            </div>
            <div className={styles.content}>
              <h2 className={styles.title}>Public</h2>
              <input type='checkbox' onChange={this.handlePublicChange} defaultChecked={isCurrentCavePublic} />
            </div>
            {isCurrentCavePublic && <div className={styles.content}>
              <h2 className={styles.title}>Likes</h2>
              <div className={styles.likesContainer}>
                <Like className={styles.like} color='red' />
                <h2 className={styles.likesValue}>{currentCaveLikes}</h2>
              </div>
            </div>}
          </div>
        </Modal>
      </div>
    )
  }
}
