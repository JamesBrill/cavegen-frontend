import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import Button from 'src/components/Button'
import requiresAuthentication from 'src/authentication/utils/requiresAuthentication'
import withNavbar from 'src/app/utils/withNavbar'
import { updateCaveCodeOnServer } from 'src/editor/actions'

import styles from 'src/editor/components/EventsPage.css'

function mapStateToProps(state) {
  const { caveCode, eventsText } = state.editor
  return { caveCode, eventsText }
}

@requiresAuthentication
@withNavbar
@connect(mapStateToProps)
export default class EventsPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func,
    children: PropTypes.node,
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
    const { dispatch } = this.props
    const { eventsText } = this.state
    dispatch(updateCaveCodeOnServer({ eventsText }))
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
        <div className={styles.buttons}>
          <Button className={styles.saveButton} onClick={this.handleSaveEvents}>
            Save
          </Button>
        </div>
      </div>
    )
  }
}
