import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import { getCaveCodeWithEvents } from 'src/editor/utils/cave-code'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'
import { updateCave } from 'src/editor/actions'

import styles from 'src/editor/components/EventsPage.css'

function mapStateToProps(state) {
  const { grid, caveName, caveCode, eventsText } = state.editor
  return { grid, caveName, caveCode, eventsText }
}

@requiresAuthentication
@withNavbar
@connect(mapStateToProps)
export default class EventsPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func,
    children: PropTypes.node,
    grid: PropTypes.object,
    caveName: PropTypes.string,
    caveCode: PropTypes.string,
    eventsText: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      eventsText: props.eventsText
    }
  }

  @autobind
  handleSaveEvents() {
    const { dispatch, grid, caveName } = this.props
    const { eventsText } = this.state
    const caveCode = getCaveCodeWithEvents(grid, caveName, eventsText)
    dispatch(updateCave({ text: caveCode }))
  }

  @autobind
  handleEventsChange(e) {
    const eventsText = e.target.value
    this.setState({ eventsText })
  }

  render() {
    const { className, children } = this.props
    const { eventsText } = this.state
    const computedClassName = classNames(styles.EventsPage, className)

    return (
      <div className={computedClassName}>
        {children}
        <h2 className={styles.title}>Events</h2>
        <p className={styles.subtitle}>
          Add checkpoints and messages to your level.
        </p>
        <a
          href='http://www.interguild.org/blogs/?id=69411'
          target='_blank'
          className={styles.learnMore}
        >
          Learn more.
        </a>
        <textarea
          className={styles.eventsText}
          onChange={this.handleEventsChange}
        >
          {eventsText}
        </textarea>
        <button onClick={this.handleSaveEvents}>Save</button>
      </div>
    )
  }
}
