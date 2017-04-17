import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/levels/components/LevelPage.css'

@requiresAuthentication
@withNavbar
export default class LevelPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    params: PropTypes.object
  };

  render() {
    const { className, children, params } = this.props
    const computedClassName = classNames(styles.LevelPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <p>{params.id}</p>
      </div>
    )
  }
}
