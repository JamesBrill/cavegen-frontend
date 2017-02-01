import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import Button from 'src/components/Button'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
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
    caves: state.caves.caves,
    publicCaves: state.caves.publicCaves,
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
    caves: PropTypes.arrayOf(PropTypes.object),
    publicCaves: PropTypes.arrayOf(PropTypes.object),
    onCaveRebuild: PropTypes.func.isRequired,
    userId: PropTypes.number,
    openTab: PropTypes.oneOf(['palette', 'properties']),
    isOwnedByAnotherUser: PropTypes.bool
  };

  getCaveSelectOptions(cave) {
    return {
      value: cave.id,
      label: cave.name
    }
  }

  getPublicCaveSelectOptions(cave) {
    return {
      value: cave.id,
      label: `${cave.name} (${cave.authorName})`
    }
  }

  @autobind
  handleUserCaveChange(value) {
    const { caves, dispatch } = this.props
    const cave = caves.filter(c => c.id === value)[0]
    dispatch(loadCaveIntoGrid(cave))
  }

  @autobind
  handlePublicCaveChange(value) {
    const { publicCaves, caves, dispatch, userId } = this.props
    const cave = publicCaves.filter(c => c.id === value)[0]
    if (userId === cave.author) {
      const userCave = caves.filter(c => c.id === value)[0]
      dispatch(loadCaveIntoGrid(userCave))
    } else {
      dispatch(loadCaveIntoGrid(cave))
    }
  }

  @autobind
  handlePropertiesClick() {
    const { dispatch, openTab } = this.props
    dispatch(setOpenTab(openTab === 'palette' ? 'properties' : 'palette'))
  }

  render() {
    const { className, caves, publicCaves, openTab, isOwnedByAnotherUser } = this.props
    const computedClassName = classNames(styles.EditorBanner, className)
    // This is a bit cheeky as it reorders an array in the Redux store
    const userCaveOptions = caves.sort((a, b) => a.id - b.id).map(this.getCaveSelectOptions)
    const publicCaveOptions = publicCaves.sort((a, b) => a.id - b.id).map(this.getPublicCaveSelectOptions)
    const tabText = (!isOwnedByAnotherUser && openTab === 'properties') ? 'Palette' : 'Properties'

    return (
      <div className={computedClassName}>
        <div className={styles.left}>
          <NewCaveModal onCaveRebuild={this.props.onCaveRebuild} />
          <Button className={styles.button} onClick={this.handlePropertiesClick}>{tabText}</Button>
          <div className={styles.myCaves}>
            <Select
              options={userCaveOptions}
              placeholder='My Caves'
              onChange={this.handleUserCaveChange} />
          </div>
          <div className={styles.myCaves}>
            <Select
              options={publicCaveOptions}
              placeholder='Public Caves'
              onChange={this.handlePublicCaveChange} />
          </div>
        </div>
        <div className={styles.right}>
          <HotkeysModal />
          <ProfileModal />
        </div>
      </div>
    )
  }
}
