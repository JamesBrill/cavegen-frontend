import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import moment from 'moment'
import Like from 'src/editor/components/icons/Like'
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
    dateCreated: level.dateCreated,
    likes: level.likes,
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
    dateCreated: PropTypes.string,
    likes: PropTypes.number,
    isOwnedByUser: PropTypes.bool
  };

  render() {
    const { className, children, author, dateCreated, likes, isOwnedByUser } = this.props
    const computedClassName = classNames(styles.LevelPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.information}>
          <h2 className={styles.title}>Author:</h2>
          <h2 className={styles.informationValue}>{author}</h2>
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Date created:</h2>
          <h2 className={styles.informationValue}>{moment(dateCreated).format('MM/DD/YYYY, h:mm a')}</h2>
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Hearts:</h2>
          <div className={styles.likesContainer}>
            <Like className={styles.like} color='red' />
            <h2 className={styles.informationValue}>{likes}</h2>
          </div>
        </div>
      </div>
    )
  }
}
