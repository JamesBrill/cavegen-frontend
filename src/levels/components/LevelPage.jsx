/* eslint-disable no-shadow */

import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import moment from 'moment'
import Input from 'src/components/Input'
import Like from 'src/editor/components/icons/Like'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/levels/components/LevelPage.css'

import { likeCave } from 'src/levels/actions'
import { updateCave } from 'src/editor/actions'

function mapStateToProps(state, ownProps) {
  const levelId = parseInt(ownProps.params.id, 10)
  const levels = state.levels.myLevels.concat(state.levels.publicLevels)
  const level = levels.find(x => x.id === levelId)
  const userId = state.profile.userId
  const isOwnedByUser = userId === level.author
  const isLikedByUser = state.profile.likedCaves.indexOf(levelId) !== -1
  return {
    name: level.name,
    uuid: level.uuid,
    author: level.authorName,
    dateCreated: level.dateCreated,
    isPublic: level.isPublic,
    likes: level.likes,
    isOwnedByUser,
    isLikedByUser
  }
}

@connect(mapStateToProps, { likeCave, updateCave })
@requiresAuthentication
@withNavbar
export default class LevelPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    name: PropTypes.string,
    uuid: PropTypes.string,
    author: PropTypes.string,
    dateCreated: PropTypes.string,
    isPublic: PropTypes.bool,
    likes: PropTypes.number,
    isOwnedByUser: PropTypes.bool,
    isLikedByUser: PropTypes.bool,
    likeCave: PropTypes.func,
    updateCave: PropTypes.func
  };

  constructor(props) {
    super(props)

    this.state = {
      publicChecked: false
    }
  }

  componentWillMount() {
    this.setState({ publicChecked: this.props.isPublic })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPublic !== this.props.isPublic) {
      this.setState({ publicChecked: nextProps.isPublic })
    }
  }

  @autobind
  handleNameChange(e) {
    const name = e.target.value
    this.props.updateCave({ name })
  }

  @autobind
  handlePublicChange(e) {
    const isPublic = e.target.checked
    this.props.updateCave({ isPublic })
    this.setState({ publicChecked: isPublic })
  }

  render() {
    const { className, children, name, uuid, author, dateCreated, likes,
            isOwnedByUser, isLikedByUser, likeCave } = this.props
    const { publicChecked } = this.state
    const computedClassName = classNames(styles.LevelPage, className)
    const nameField = isOwnedByUser ? (
      <div className={styles.information}>
        <h2 className={styles.title}>Name:</h2>
        <Input
          className={styles.propertyInput}
          onChange={this.handleNameChange}
          key={uuid}
          defaultValue={name} />
      </div>
    ) : (
      <div className={styles.information}>
        <h2 className={styles.title}>Name:</h2>
        <h2 className={styles.informationValue}>{name}</h2>
      </div>
    )
    const likeColour = isLikedByUser ? 'red' : 'white'
    const likeIcon = isOwnedByUser ? (
      <Like className={styles.like} color='red' />
    ) : (
      <Like className={styles.like} color={likeColour} onClick={() => likeCave(uuid)} />
    )

    return (
      <div className={computedClassName}>
        {children}
        {nameField}
        <div className={styles.information}>
          <h2 className={styles.title}>Author:</h2>
          <h2 className={styles.informationValue}>{author}</h2>
        </div>
        <div className={styles.information}>
          <h2 className={styles.title}>Date created:</h2>
          <h2 className={styles.informationValue}>{moment(dateCreated).format('MM/DD/YYYY, h:mm a')}</h2>
        </div>
        {isOwnedByUser && (
          <div className={styles.information}>
            <h2 className={styles.title}>Public:</h2>
            <input
              className={styles.propertyInput}
              type='checkbox'
              onChange={this.handlePublicChange}
              checked={publicChecked} />
          </div>
        )}
        <div className={styles.information}>
          <h2 className={styles.title}>Hearts:</h2>
          <div className={styles.likesContainer}>
            {likeIcon}
            <h2 className={styles.informationValue}>{likes}</h2>
          </div>
        </div>
      </div>
    )
  }
}
