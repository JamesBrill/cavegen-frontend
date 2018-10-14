import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/levels/components/PublicLevelsPage.css'

@withNavbar
export default class PublicLevelsPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  }

  render() {
    const { className, children } = this.props
    const computedClassName = classNames(styles.PublicLevelsPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.levels}>Nothing to see here.</div>
      </div>
    )
  }
}
