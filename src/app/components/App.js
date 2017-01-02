import React, { PureComponent, PropTypes, Children, cloneElement } from 'react'
import { logout } from 'src/authentication/actions'
import { loadImages } from 'src/editor/actions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import moment from 'moment'
import ScheduledEvent from 'src/utils/ScheduledEvent'

import styles from 'src/app/components/App.css'

function mapStateToProps(state) {
  const location = state.routing.locationBeforeTransitions
  const isEditorOpen = location.pathname.startsWith('/editor')
  return {
    tokenExpiryTime: state.authentication.claims.exp,
    isEditorOpen
  }
}

@connect(mapStateToProps, { logout, loadImages })
@withRouter
export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    tokenExpiryTime: PropTypes.number,
    isEditorOpen: PropTypes.bool,
    logout: PropTypes.func,
    loadImages: PropTypes.func
  };

  constructor(props) {
    super(props)

    this.state = {
      imagesLoaded: false
    }
  }

  componentWillMount() {
    const { isEditorOpen, loadImages } = this.props // eslint-disable-line no-shadow
    if (isEditorOpen) {
      loadImages().then(() => this.setState({ imagesLoaded: true }))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isEditorOpen, loadImages } = nextProps // eslint-disable-line no-shadow
    if (isEditorOpen) {
      loadImages().then(() => this.setState({ imagesLoaded: true }))
    }
  }

  render() {
    const { logout, tokenExpiryTime, isEditorOpen } = this.props // eslint-disable-line no-shadow

    if (isEditorOpen && !this.state.imagesLoaded) {
      return null
    }

    return (
      <div className={styles.App}>
        <ScheduledEvent when={moment.unix(tokenExpiryTime)} action={logout} />
        {cloneElement(Children.only(this.props.children), { className: styles.page })}
      </div>
    )
  }
}
