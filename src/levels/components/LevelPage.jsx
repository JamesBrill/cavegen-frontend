import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import CaveInformation from 'src/levels/components/CaveInformation'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/levels/components/LevelPage.css'

@requiresAuthentication
@withNavbar
export default class LevelPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const { className, children, params } = this.props
    const computedClassName = classNames(styles.LevelPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <CaveInformation levelId={parseInt(params.id, 10)} />
      </div>
    )
  }
}
