import React, { PureComponent, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import classNames from 'classnames'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import CaveDimensionsInput from 'src/editor/components/CaveDimensionsInput'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { newCave, rebuildLevel, loadCaveIntoGrid } from 'src/editor/actions'
import withNavbar from 'src/app/utils/withNavbar'
import { splitCaveCode } from 'src/editor/utils/cave-code'

import styles from './NewLevelPage.css'

function mapStateToProps() {
  return {}
}

@connect(mapStateToProps, { newCave, rebuildLevel, loadCaveIntoGrid })
@withNavbar
export default class NewLevelPage extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    newCave: PropTypes.func,
    rebuildLevel: PropTypes.func,
    loadCaveIntoGrid: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      name: 'Untitled',
      caveCode: ''
    }
  }

  @autobind
  handleNameChange(e) {
    this.setState({
      name: e.target.value
    })
  }

  @autobind
  handleCaveCodeChange(e) {
    this.setState({
      caveCode: e.target.value.trim()
    })
  }

  @autobind
  handleCreateFromExisting() {
    const { caveCode } = this.state
    try {
      const { name } = splitCaveCode(caveCode)
      this.props.rebuildLevel(40, 40)
      this.props.newCave(name, 40, 40, caveCode)
      browserHistory.push('/build')
    } catch (e) {
      alert('Invalid level code.')
    }
  }

  @autobind
  handleCreateNew(width, height) {
    this.props.rebuildLevel(width, height)
    this.props.newCave(this.state.name, width, height)
    browserHistory.push('/build')
  }

  render() {
    const { className, children } = this.props
    const { name, caveCode } = this.state
    const computedClassName = classNames(styles.NewLevelPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.container}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Create from existing level</h2>
            <div className={styles.contents}>
              <div className={styles.content}>
                <h2 className={styles.title}>Level code</h2>
                <textarea
                  className={styles.caveCodeTextArea}
                  onChange={this.handleCaveCodeChange}
                >
                  {caveCode}
                </textarea>
              </div>
              <div className={styles.buttons}>
                <Button
                  className={styles.createButton}
                  onClick={this.handleCreateFromExisting}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Create empty level</h2>
            <div className={styles.contents}>
              <div className={styles.content}>
                <h2 className={styles.title}>Name</h2>
                <Input onChange={this.handleNameChange} value={name} />
              </div>
              <CaveDimensionsInput
                className={styles.content}
                onCreate={this.handleCreateNew} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
