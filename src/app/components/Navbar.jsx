/* eslint-disable no-shadow */

import React, { PureComponent, PropTypes } from 'react'
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'
import classNames from 'classnames'

import styles from 'src/app/components/Navbar.css'

function mapStateToProps(state) {
  return {
    route: state.routing.locationBeforeTransitions.pathname
  }
}

@connect(mapStateToProps)
@withRouter
export default class Navbar extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    route: PropTypes.string
  }

  render() {
    const { className, route } = this.props
    const computedClassName = classNames(styles.Navbar, className)
    const levelsTabStyles =
      ['/my-levels', '/public-levels'].indexOf(route) === -1
        ? classNames(styles.tab, styles.levelsTab)
        : classNames(styles.selectedTab, styles.levelsTab)
    const myLevelsTabStyles =
      route === '/my-levels' ? styles.selectedTab : styles.tab
    const publicLevelsTabStyles =
      route === '/public-levels' ? styles.selectedTab : styles.tab
    const editorTabStyles =
      ['/new-level', '/build', '/events', '/properties'].indexOf(route) === -1
        ? classNames(styles.tab, styles.editorTab)
        : classNames(styles.selectedTab, styles.editorTab)
    const newLevelTabStyles =
      route === '/new-level' ? styles.selectedTab : styles.tab
    const buildTabStyles = route === '/build' ? styles.selectedTab : styles.tab
    const eventsTabStyles =
      route === '/events' ? styles.selectedTab : styles.tab
    const propertiesTabStyles =
      route === '/properties' ? styles.selectedTab : styles.tab
    const learnTabStyles = route === '/learn' ? styles.selectedTab : styles.tab
    const profileTabStyles =
      route === '/profile' ? styles.selectedTab : styles.tab

    return (
      <div className={computedClassName}>
        <div className={styles.left}>
          <p className={styles.logo}>CaveGen</p>
        </div>
        <div className={styles.right}>
          <Link to='/my-levels'>
            <div className={levelsTabStyles}>
              <p>Levels</p>
              <div className={styles.levelsSubTabs}>
                <Link to='/my-levels'>
                  <div className={myLevelsTabStyles}>
                    <p className={styles.smallFont}>My Levels</p>
                  </div>
                </Link>
                <Link to='/public-levels'>
                  <div className={publicLevelsTabStyles}>
                    <p className={styles.smallFont}>Public Levels</p>
                  </div>
                </Link>
              </div>
            </div>
          </Link>
          <Link to='/build'>
            <div className={editorTabStyles}>
              <p>Editor</p>
              <div className={styles.editorSubTabs}>
                <Link to='/new-level'>
                  <div className={newLevelTabStyles}>
                    <p className={styles.smallFont}>New Level</p>
                  </div>
                </Link>
                <Link to='/build'>
                  <div className={buildTabStyles}>
                    <p className={styles.smallFont}>Build</p>
                  </div>
                </Link>
                <Link to='/events'>
                  <div className={eventsTabStyles}>
                    <p className={styles.smallFont}>Events</p>
                  </div>
                </Link>
                <Link to='/properties'>
                  <div className={propertiesTabStyles}>
                    <p className={styles.smallFont}>Properties</p>
                  </div>
                </Link>
              </div>
            </div>
          </Link>
          <Link to='/learn'>
            <div className={learnTabStyles}>
              <p>Learn</p>
            </div>
          </Link>
          <Link to='/profile'>
            <div className={profileTabStyles}>
              <p>Profile</p>
            </div>
          </Link>
        </div>
      </div>
    )
  }
}
