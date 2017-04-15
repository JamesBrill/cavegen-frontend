import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import Button from 'src/components/Button'
import HotkeysModal from 'src/editor/components/HotkeysModal'
import NewCaveModal from 'src/editor/components/NewCaveModal'
import ProfileModal from 'src/profile/components/ProfileModal'

import {
  loadCaveIntoGrid
} from 'src/caves/actions'

import {
  setOpenTab
} from 'src/editor/actions'

import styles from 'src/editor/components/EditorBanner.css'

function mapStateToProps(state) {
  return {
    userId: state.profile.userId,
    openTab: state.editor.openTab,
    isOwnedByAnotherUser: state.caves.isOwnedByAnotherUser
  }
}

@connect(mapStateToProps)
export default class EditorBanner extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func,
    onCaveRebuild: PropTypes.func.isRequired,
    userId: PropTypes.number,
    openTab: PropTypes.oneOf(['palette', 'properties']),
    isOwnedByAnotherUser: PropTypes.bool
  };

  @autobind
  handlePropertiesClick() {
    const { dispatch, openTab } = this.props
    dispatch(setOpenTab(openTab === 'palette' ? 'properties' : 'palette'))
  }

  render() {
    const { className, openTab, isOwnedByAnotherUser } = this.props
    const computedClassName = classNames(styles.EditorBanner, className)
    const tabText = (!isOwnedByAnotherUser && openTab === 'properties') ? 'Palette' : 'Properties'

    return (
      <div className={computedClassName}>
        <div className={styles.left}>
          <NewCaveModal onCaveRebuild={this.props.onCaveRebuild} />
          <Button className={styles.button} onClick={this.handlePropertiesClick}>{tabText}</Button>
        </div>
        <div className={styles.right}>
          <HotkeysModal />
          <ProfileModal />
        </div>
      </div>
    )
  }
}
