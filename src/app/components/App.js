import React, { PureComponent, PropTypes, Children, cloneElement } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import styles from 'src/app/components/App.css'

@DragDropContext(HTML5Backend)
export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <div className={styles.App}>
        {cloneElement(Children.only(this.props.children), { className: styles.page })}
      </div>
    )
  }
}
