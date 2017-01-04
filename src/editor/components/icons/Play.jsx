import React, { PureComponent } from 'react'

export default class Play extends PureComponent {
  render() {
    return (
      <svg {...this.props} viewBox='0 0 510 510'>
        <path d='M459 61.2C443.7 56.1 349.35 51 255 51S66.3 56.1 51 61.2C10.2 73.95 0 163.2 0 255s10.2 181.05 51 193.8c15.3 5.1 109.65 10.2 204 10.2s188.7-5.1 204-10.2c40.8-12.75 51-102 51-193.8S499.8 73.95 459 61.2zM204 369.75v-229.5L357 255 204 369.75z' />
      </svg>
    )
  }
}
