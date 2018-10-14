import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import CaveInformation from 'src/levels/components/CaveInformation'
import LevelPreview from 'src/levels/components/LevelPreview'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/levels/components/LevelPage.css'

@withNavbar
export default class LevelPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  }

  render() {
    const { className, children, params } = this.props
    const computedClassName = classNames(styles.LevelPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.contents}>
          <LevelPreview
            className={styles.levelPreview}
            levelId={parseInt(params.id, 10)} />
          <CaveInformation
            className={styles.caveInformation}
            levelId={parseInt(params.id, 10)}
            editableAttributes={false} />
        </div>
      </div>
    )
  }
}
