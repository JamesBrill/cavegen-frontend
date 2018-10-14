import React, { PureComponent, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import withNavbar from 'src/app/utils/withNavbar'
import { updateUserProfile } from 'src/profile/actions'

import styles from 'src/profile/components/ProfilePage.css'

function mapStateToProps(state) {
  return {
    displayName: state.profile.displayName
  }
}

@connect(mapStateToProps, { updateUserProfile })
@withNavbar
export default class ProfilePage extends PureComponent {
  static propTypes = {
    updateUserProfile: PropTypes.func,
    displayName: PropTypes.string
  }

  @autobind
  handleLogout() {
    browserHistory.replace('/')
  }

  @autobind
  handleDisplayNameChange(e) {
    const displayName = e.target.value
    this.props.updateUserProfile({ displayName })
  }

  render() {
    const { className, children, displayName } = this.props
    const computedClassName = classNames(styles.ProfilePage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.contents}>
          <h2 className={styles.title}>Display Name</h2>
          <Input
            onChange={this.handleDisplayNameChange}
            defaultValue={displayName} />
        </div>
      </div>
    )
  }
}
