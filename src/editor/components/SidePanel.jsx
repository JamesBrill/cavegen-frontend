import React, { PureComponent, PropTypes } from 'react'
import EditorControls from 'src/editor/components/EditorControls'
import CaveInformation from 'src/editor/components/CaveInformation'

import styles from 'src/editor/components/SidePanel.css'

export default class SidePanel extends PureComponent {
  static propTypes = {
    openTab: PropTypes.oneOf(['palette', 'properties'])
  };

  render() {
    const { openTab } = this.props

    switch (openTab) {
      case 'palette':
        return <EditorControls className={styles.editorControls} />
      case 'properties':
      default:
        return <CaveInformation className={styles.editorControls} />
    }
  }
}
