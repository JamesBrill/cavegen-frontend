import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import CaveInformation from 'src/levels/components/CaveInformation'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/editor/components/PropertiesPage.css'

function mapStateToProps(state) {
  const levels = state.levels.myLevels
  const currentLevelId = state.editor.caveId
  const currentLevel = levels.find(x => x.id === currentLevelId) || levels[0]
  return {
    levelId: currentLevel.id
  }
}

@connect(mapStateToProps)
@withNavbar
export default class PropertiesPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    levelId: PropTypes.number
  }

  render() {
    const { className, children, levelId } = this.props
    const computedClassName = classNames(styles.PropertiesPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <CaveInformation levelId={levelId} />
      </div>
    )
  }
}
