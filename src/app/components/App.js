import React, { PureComponent, PropTypes, Children, cloneElement } from 'react'
import { logout } from 'src/authentication/actions'
import { loadImages } from 'src/editor/actions'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { withRouter } from 'react-router'
import moment from 'moment'
import ScheduledEvent from 'src/utils/ScheduledEvent'
import Spinner from 'src/components/Spinner'
import { LOGIN_URL } from 'src/config'
import { loadMyLevels, loadPublicLevels } from 'src/levels/actions'
import { loadCaveIntoGrid } from 'src/editor/actions'

import styles from 'src/app/components/App.css'

function mapStateToProps(state) {
  const location = state.routing.locationBeforeTransitions
  const isEditorOpen = !location.pathname.startsWith('/login')
  const isAuthenticated = !!(
    state.authentication && state.authentication.token !== null
  )
  return {
    tokenExpiryTime: state.authentication.claims.exp,
    isAuthenticated,
    isEmailVerified: state.authentication.claims['email_verified'],
    isEditorOpen,
    levelsLoaded: state.levels.myLevels && state.levels.myLevels.length > 0
  }
}

@connect(mapStateToProps, {
  logout,
  loadImages,
  loadMyLevels,
  loadPublicLevels,
  loadCaveIntoGrid
})
@withRouter
export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    tokenExpiryTime: PropTypes.number,
    isAuthenticated: PropTypes.bool,
    isEmailVerified: PropTypes.bool,
    isEditorOpen: PropTypes.bool,
    logout: PropTypes.func,
    loadImages: PropTypes.func,
    loadMyLevels: PropTypes.func,
    loadPublicLevels: PropTypes.func,
    loadCaveIntoGrid: PropTypes.func,
    caveUuid: PropTypes.string,
    levelsLoaded: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      imagesLoaded: false
    }
  }

  componentWillMount() {
    if (this.props.levelsLoaded) {
      this.props.loadCaveIntoGrid()
    }
    if (this.props.isAuthenticated) {
      this.props.loadMyLevels()
      this.props.loadPublicLevels()
    }
    this.loadImagesOrRedirectToLogin(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthenticated && nextProps.isAuthenticated) {
      this.props.loadMyLevels()
      this.props.loadPublicLevels()
    }
    if (!this.props.levelsLoaded && nextProps.levelsLoaded) {
      this.props.loadCaveIntoGrid()
    }
    this.loadImagesOrRedirectToLogin(nextProps)
  }

  @autobind
  loadImagesOrRedirectToLogin(props) {
    const { isEditorOpen, isAuthenticated, loadImages, isEmailVerified } = props // eslint-disable-line no-shadow
    if (isEditorOpen) {
      if ((isAuthenticated && !isEmailVerified) || !isAuthenticated) {
        window.location = LOGIN_URL
      }
      loadImages().then(() => this.setState({ imagesLoaded: true }))
    }
  }

  render() {
    const {
      logout,
      isAuthenticated,
      tokenExpiryTime,
      isEmailVerified,
      isEditorOpen
    } = this.props // eslint-disable-line no-shadow

    if (isEditorOpen && isAuthenticated && !isEmailVerified) {
      return (
        <div className={styles.spinnerContainer}>
          <Spinner className={styles.spinner} />
          Please verify your email. Redirecting to login...
        </div>
      )
    }

    if (isEditorOpen && !isAuthenticated) {
      return (
        <div className={styles.spinnerContainer}>
          <Spinner className={styles.spinner} />
          Redirecting to login...
        </div>
      )
    }

    if (isEditorOpen && !this.state.imagesLoaded) {
      return (
        <div className={styles.spinnerContainer}>
          <Spinner className={styles.spinner} />
          Loading tiles...
        </div>
      )
    }

    return (
      <div className={styles.App}>
        <ScheduledEvent when={moment.unix(tokenExpiryTime)} action={logout} />
        {cloneElement(Children.only(this.props.children), {
          className: styles.page
        })}
      </div>
    )
  }
}
