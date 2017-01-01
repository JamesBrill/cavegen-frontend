import React, { PureComponent, PropTypes, Children, cloneElement } from 'react'
import { logout } from 'src/authentication/actions'
import { connect } from 'react-redux'
import moment from 'moment'
import ScheduledEvent from 'src/utils/ScheduledEvent'

import styles from 'src/app/components/App.css'

function mapStateToProps(state) {
  return {
    tokenExpiryTime: state.authentication.claims.exp
  }
}

@connect(mapStateToProps, { logout })
export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    tokenExpiryTime: PropTypes.number,
    logout: PropTypes.func
  };

  render() {
    const { logout, tokenExpiryTime } = this.props // eslint-disable-line no-shadow

    return (
      <div className={styles.App}>
        <ScheduledEvent when={moment.unix(tokenExpiryTime)} action={logout} />
        {cloneElement(Children.only(this.props.children), { className: styles.page })}
      </div>
    )
  }
}
