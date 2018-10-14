import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import { browserHistory } from 'react-router'
import withNavbar from 'src/app/utils/withNavbar'

import { loadMyLevels } from 'src/levels/actions'
import { loadCaveIntoGrid } from 'src/editor/actions'

import styles from 'src/levels/components/MyLevelsPage.css'

function mapStateToProps(state) {
  return {
    myLevels: state.levels.myLevels
  }
}

@connect(mapStateToProps, { loadMyLevels, loadCaveIntoGrid })
@withNavbar
export default class MyLevelsPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    myLevels: PropTypes.arrayOf(PropTypes.object),
    loadMyLevels: PropTypes.func,
    loadCaveIntoGrid: PropTypes.func
  }

  componentWillMount() {
    this.props.loadMyLevels()
  }

  @autobind
  handleBuild(levelId) {
    browserHistory.push('/build')
    this.props.loadCaveIntoGrid(levelId)
  }

  render() {
    const { className, children, myLevels } = this.props
    const computedClassName = classNames(styles.MyLevelsPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.levels}>
          {myLevels.map(level =>
            <div
              className={styles.levelLink}
              key={level.id}
              onClick={() => this.handleBuild(level.id)}
            >
              <p>
                {level.name}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
}
