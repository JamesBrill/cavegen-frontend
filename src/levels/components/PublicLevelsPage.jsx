import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/levels/components/PublicLevelsPage.css'

function mapStateToProps(state) {
  return {
    publicLevels: state.levels.publicLevels
  }
}

@connect(mapStateToProps)
@requiresAuthentication
@withNavbar
export default class PublicLevelsPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    publicLevels: PropTypes.arrayOf(PropTypes.object)
  };

  render() {
    const { className, children, publicLevels } = this.props
    const computedClassName = classNames(styles.PublicLevelsPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.levels}>
          {publicLevels.map(level => (
            <Link key={level.id} to={`/level/${level.id}`}>
              <p>{level.name}</p>
            </Link>
          ))}
        </div>
      </div>
    )
  }
}
