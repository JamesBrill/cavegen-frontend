import React, { PureComponent, PropTypes, Children, cloneElement } from 'react'
import { loadImages } from 'src/editor/actions'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { withRouter } from 'react-router'
import Spinner from 'src/components/Spinner'
import { loadMyLevels } from 'src/levels/actions'
import { loadCaveIntoGrid } from 'src/editor/actions'

import styles from 'src/app/components/App.css'

function mapStateToProps(state) {
  return {
    levelsLoaded: state.levels.myLevels && state.levels.myLevels.length > 0
  }
}

@connect(mapStateToProps, {
  loadImages,
  loadMyLevels,
  loadCaveIntoGrid
})
@withRouter
export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    loadImages: PropTypes.func,
    loadMyLevels: PropTypes.func,
    loadCaveIntoGrid: PropTypes.func,
    caveUuid: PropTypes.string,
    levelsLoaded: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      imagesLoaded: false
    }
  }

  componentWillMount() {
    if (this.props.levelsLoaded) {
      this.props.loadCaveIntoGrid()
    }
    this.props.loadMyLevels()
    this.loadImagesOrRedirectToLogin(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.levelsLoaded && nextProps.levelsLoaded) {
      this.props.loadCaveIntoGrid()
    }
    this.loadImagesOrRedirectToLogin(nextProps)
  }

  @autobind
  loadImagesOrRedirectToLogin(props) {
    const { loadImages } = props // eslint-disable-line no-shadow
    loadImages().then(() => this.setState({ imagesLoaded: true }))
  }

  render() {
    if (!this.state.imagesLoaded) {
      return (
        <div className={styles.spinnerContainer}>
          <Spinner className={styles.spinner} />
          Loading tiles...
        </div>
      )
    }

    return (
      <div className={styles.App}>
        {cloneElement(Children.only(this.props.children), {
          className: styles.page
        })}
      </div>
    )
  }
}
