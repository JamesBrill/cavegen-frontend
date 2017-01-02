import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { getNewCaveCode } from 'src/editor/utils/cave-code'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import Button from 'src/components/Button'
import DetailsModal from 'src/editor/components/DetailsModal'
import ProfileModal from 'src/profile/components/ProfileModal'

import {
  loadCaveIntoGrid,
  newCave
} from 'src/caves/actions'

import styles from 'src/editor/components/EditorBanner.css'

function mapStateToProps(state) {
  return {
    caves: state.caves.caves
  }
}

@connect(mapStateToProps)
export default class EditorBanner extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func,
    caves: PropTypes.arrayOf(PropTypes.object),
    onCaveRebuild: PropTypes.func.isRequired
  };

  getCaveSelectOptions(cave) {
    return {
      value: cave.id,
      label: cave.name
    }
  }

  @autobind
  handleNewCave() {
    const { dispatch, onCaveRebuild } = this.props
    onCaveRebuild(40, 40) // TODO: would be nice not to use literals here
    dispatch(newCave(getNewCaveCode()))
  }

  @autobind
  handleChange(value) {
    const { caves, dispatch } = this.props
    const cave = caves.filter(c => c.id === value)[0]
    dispatch(loadCaveIntoGrid(cave))
  }

  render() {
    const { className, caves } = this.props
    const computedClassName = classNames(styles.EditorBanner, className)
    // This is a bit cheeky as it reorders an array in the Redux store
    const options = caves.sort((a, b) => a.id - b.id).map(this.getCaveSelectOptions)

    return (
      <div className={computedClassName}>
        <div className={styles.left}>
          <Button className={styles.newCave} onClick={this.handleNewCave}>New Cave</Button>
          <DetailsModal onCaveRebuild={this.props.onCaveRebuild} />
          <div className={styles.myCaves}>
            <Select
              options={options}
              placeholder='My Caves'
              onChange={this.handleChange} />
          </div>
        </div>
        <div className={styles.right}>
          <ProfileModal />
        </div>
      </div>
    )
  }
}
