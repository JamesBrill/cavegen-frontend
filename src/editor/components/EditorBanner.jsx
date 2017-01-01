import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

import { loadCaveIntoGrid } from 'src/caves/actions'

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
    caves: PropTypes.arrayOf(PropTypes.object)
  };

  getCaveSelectOptions(cave) {
    return {
      value: cave.id,
      label: cave.name
    }
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
    const options = caves.map(this.getCaveSelectOptions)

    return (
      <div className={computedClassName}>
        <div className={styles.myCaves}>
          <Select
            options={options}
            placeholder='My Caves'
            onChange={this.handleChange} />
        </div>
      </div>
    )
  }
}
