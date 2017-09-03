import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import CaveInformation from 'src/levels/components/CaveInformation'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/editor/components/PropertiesPage.css'

function mapStateToProps(state) {
  const levels = state.levels.myLevels
  const currentLevelUuid = state.editor.caveUuid
  const currentLevel =
    levels.find(x => x.uuid === currentLevelUuid) || levels[0]
  return {
    levelId: currentLevel.id
  }
}

@connect(mapStateToProps)
@requiresAuthentication
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
