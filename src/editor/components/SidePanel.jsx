import React, { PureComponent, PropTypes } from 'react'
import EditorControls from 'src/editor/components/EditorControls'
import CaveInformation from 'src/editor/components/CaveInformation'

import styles from 'src/editor/components/SidePanel.css'

export default class SidePanel extends PureComponent {
  static propTypes = {
    isOwnedByAnotherUser: PropTypes.bool,
    openTab: PropTypes.oneOf(['palette', 'properties'])
  };

  render() {
    const { isOwnedByAnotherUser, openTab } = this.props

    switch (openTab) {
      case 'palette':
        return isOwnedByAnotherUser ?
          <CaveInformation className={styles.editorControls} /> :
          <EditorControls className={styles.editorControls} />
      case 'properties':
      default:
        return <CaveInformation className={styles.editorControls} />
    }
  }
}
