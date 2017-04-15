import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/editor/components/CheckpointsPage.css'

@requiresAuthentication
@withNavbar
export default class CheckpointsPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const { className, children } = this.props
    const computedClassName = classNames(styles.CheckpointsPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <p>CheckpointsPage</p>
      </div>
    )
  }
}
