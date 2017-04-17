import React, { PureComponent, PropTypes } from 'react'
import Modal from 'src/components/Modal'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { browserHistory } from 'react-router'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { logout } from 'src/authentication/actions'
import { updateUserProfile } from 'src/profile/actions'
import { loadPublicLevels } from 'src/levels/actions'

import styles from './ProfileModal.css'

function mapStateToProps(state) {
  return {
    displayName: state.profile.displayName
  }
}

@connect(mapStateToProps, { logout, updateUserProfile, loadPublicLevels })
export default class ProfileModal extends PureComponent {
  static propTypes = {
    logout: PropTypes.func,
    updateUserProfile: PropTypes.func,
    loadPublicLevels: PropTypes.func,
    displayName: PropTypes.string
  };

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      publicLevelsNeedUpdating: false
    }
  }

  @autobind
  handleClick() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  @autobind
  handleClose() {
    if (this.state.publicLevelsNeedUpdating) {
      this.props.loadPublicLevels()
    }
    this.setState({ isOpen: false, publicLevelsNeedUpdating: false })
  }

  @autobind
  handleLogout() {
    this.props.logout()
    browserHistory.replace('/')
  }

  @autobind
  handleDisplayNameChange(e) {
    const displayName = e.target.value
    this.props.updateUserProfile({ displayName })
    this.setState({ publicLevelsNeedUpdating: true })
  }

  render() {
    const { displayName } = this.props
    const { isOpen } = this.state

    return (
      <div className={styles.ProfileModal}>
        <Button className={styles.openButton} onClick={this.handleClick}>Profile</Button>
        <Modal className={styles.modal} isOpen={isOpen} onRequestClose={this.handleClose}>
          <div className={styles.modalContents}>
            <h2 className={styles.title}>Display Name</h2>
            <Input onChange={this.handleDisplayNameChange} defaultValue={displayName} />
            <div className={styles.buttons}>
              <Button className={styles.logoutButton} onClick={this.handleLogout}>Logout</Button>
              <Button className={styles.saveButton} onClick={this.handleClose}>Save</Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
