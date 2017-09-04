import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from 'src/editor/components/CoordinatesDisplay.css'

function mapStateToProps(state) {
  const { hoverXCoordinate, hoverYCoordinate } = state.editor
  return {
    hoverXCoordinate,
    hoverYCoordinate
  }
}

@connect(mapStateToProps)
export default class CoordinatesDisplay extends PureComponent {
  static propTypes = {
    hoverXCoordinate: PropTypes.number,
    hoverYCoordinate: PropTypes.number
  }

  render() {
    const { hoverXCoordinate, hoverYCoordinate } = this.props
    return (
      <span className={styles.CoordinatesDisplay}>
        {`x: ${hoverXCoordinate}, y: ${hoverYCoordinate}`}
      </span>
    )
  }
}
