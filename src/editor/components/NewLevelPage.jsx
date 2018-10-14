import React, { PureComponent, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import classNames from 'classnames'
import Input from 'src/components/Input'
import CaveDimensionsInput from 'src/editor/components/CaveDimensionsInput'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { newCave, rebuildLevel, loadCaveIntoGrid } from 'src/editor/actions'
import withNavbar from 'src/app/utils/withNavbar'

import styles from './NewLevelPage.css'

function mapStateToProps() {
  return {}
}

@connect(mapStateToProps, { newCave, rebuildLevel, loadCaveIntoGrid })
@withNavbar
export default class NewLevelPage extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    logout: PropTypes.func,
    newCave: PropTypes.func,
    rebuildLevel: PropTypes.func,
    loadCaveIntoGrid: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      name: 'Untitled'
    }
  }

  @autobind
  handleNameChange(e) {
    this.setState({
      name: e.target.value
    })
  }

  @autobind
  async handleCreate(width, height) {
    this.props.rebuildLevel(width, height)
    await this.props.newCave(this.state.name, width, height)
    browserHistory.push('/build')
  }

  render() {
    const { className, children } = this.props
    const { name } = this.state
    const computedClassName = classNames(styles.NewLevelPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.contents}>
          <div className={styles.content}>
            <h2 className={styles.title}>Name</h2>
            <Input onChange={this.handleNameChange} value={name} />
          </div>
          <CaveDimensionsInput
            className={styles.content}
            onCreate={this.handleCreate} />
        </div>
      </div>
    )
  }
}
