import React, { PureComponent, PropTypes } from 'react'
import Modal from 'src/components/Modal'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import CaveDimensionsInput from 'src/editor/components/CaveDimensionsInput'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { newCave } from 'src/levels/actions'

import styles from './NewCaveModal.css'

function mapStateToProps(state) {
  return {
    displayName: state.profile.displayName,
    caveLikes: state.editor.caveLikes
  }
}

@connect(mapStateToProps, { newCave })
export default class NewCaveModal extends PureComponent {
  static propTypes = {
    logout: PropTypes.func,
    displayName: PropTypes.string,
    onCaveRebuild: PropTypes.func,
    newCave: PropTypes.func
  };

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      name: 'Untitled'
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
    this.setState({
      name: e.target.value
    })
  }

  @autobind
  handleCreate(width, height) {
    this.props.onCaveRebuild(width, height)
    this.props.newCave(this.state.name, width, height)
    this.handleClose()
  }

  render() {
    const { isOpen, name } = this.state

    return (
      <div className={styles.NewCaveModal}>
        <Button className={styles.openButton} onClick={this.handleClick}>New Cave</Button>
        <Modal className={styles.modal} isOpen={isOpen} onRequestClose={this.handleClose}>
          <div className={styles.modalContents}>
            <div className={styles.content}>
              <h2 className={styles.title}>Name</h2>
              <Input onChange={this.handleNameChange} value={name} />
            </div>
            <CaveDimensionsInput
              className={styles.content}
              onCreate={this.handleCreate} />
          </div>
        </Modal>
      </div>
    )
  }
}
