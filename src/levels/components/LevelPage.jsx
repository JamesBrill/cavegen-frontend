import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/levels/components/LevelPage.css'

function mapStateToProps(state, ownProps) {
  const levelId = parseInt(ownProps.params.id, 10)
  const levels = state.levels.myLevels.concat(state.levels.publicLevels)
  const level = levels.find(x => x.id === levelId)
  const userId = state.profile.userId
  const isOwnedByUser = userId === level.author
  return {
    author: level.authorName,
    isOwnedByUser
  }
}

@connect(mapStateToProps)
@requiresAuthentication
@withNavbar
export default class LevelPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    author: PropTypes.string,
    isOwnedByUser: PropTypes.bool
  };

  render() {
    const { className, children, author, isOwnedByUser } = this.props
    const computedClassName = classNames(styles.LevelPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <p>{author}</p>
        <p>Is this my cave? {isOwnedByUser ? 'yes' : 'no'}</p>
      </div>
    )
  }
}
