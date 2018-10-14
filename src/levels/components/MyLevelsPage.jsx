import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'
import withNavbar from 'src/app/utils/withNavbar'

import { loadMyLevels } from 'src/levels/actions'

import styles from 'src/levels/components/MyLevelsPage.css'

function mapStateToProps(state) {
  return {
    myLevels: state.levels.myLevels
  }
}

@connect(mapStateToProps, { loadMyLevels })
@withNavbar
export default class MyLevelsPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    myLevels: PropTypes.arrayOf(PropTypes.object),
    loadMyLevels: PropTypes.func
  }

  componentWillMount() {
    this.props.loadMyLevels()
  }

  render() {
    const { className, children, myLevels } = this.props
    const computedClassName = classNames(styles.MyLevelsPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.levels}>
          {myLevels.map(level =>
            <Link key={level.id} to={`/level/${level.id}`}>
              <p>
                {level.name}
              </p>
            </Link>
          )}
        </div>
      </div>
    )
  }
}
