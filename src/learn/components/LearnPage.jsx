import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/learn/components/LearnPage.css'

@requiresAuthentication
@withNavbar
export default class LearnPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const { className, children } = this.props
    const computedClassName = classNames(styles.LearnPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <p>LearnPage</p>
      </div>
    )
  }
}
