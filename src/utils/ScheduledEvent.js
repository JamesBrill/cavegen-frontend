import { PureComponent, PropTypes } from 'react'
import moment from 'moment'

export default class ScheduledEvent extends PureComponent {
  static propTypes = {
    when: PropTypes.instanceOf(moment),
    action: PropTypes.func
  };

  componentDidMount() {
    this.updateScheduledAction()
  }

  componentDidUpdate(prevProps) {
    const oldWhen = prevProps.when
    const newWhen = this.props.when

    const hasChanged = !moment.isMoment(newWhen) || !newWhen.isSame(oldWhen)

    if (hasChanged) {
      this.updateScheduledAction()
    }
  }

  componentWillUnmount() {
    this.clearScheduledAction()
  }

  updateScheduledAction() {
    const { when, action } = this.props
    const now = moment()

    this.clearScheduledAction()

    if (moment.isMoment(when)) {
      const millisecondsFromNow = when.diff(now)

      this.timeoutHandle = setTimeout(action, Math.max(millisecondsFromNow, 0))
    }
  }

  clearScheduledAction() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle)
    }
  }

  render() {
    return null
  }
}
