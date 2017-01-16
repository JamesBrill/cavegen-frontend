import React, { PureComponent, PropTypes } from 'react'

export default class Like extends PureComponent {
  static propTypes = {
    color: PropTypes.string
  };

  render() {
    const { color, ...others } = this.props

    return (
      <svg {...others} viewBox='0 0 455 455'>
        <path d='M326.632 10.346c-38.733 0-74.99 17.537-99.132 46.92-24.14-29.384-60.398-46.92-99.132-46.92C57.586 10.346 0 67.93 0 138.714 0 194.14 33.05 258.25 98.23 329.26c50.16 54.647 104.728 96.96 120.257 108.626l9.01 6.77 9.01-6.77c15.53-11.666 70.098-53.977 120.26-108.624C421.95 258.252 455 194.142 455 138.714c0-70.783-57.586-128.368-128.368-128.368zm8.034 298.628c-41.26 44.948-85.648 81.283-107.17 98.03-21.52-16.747-65.906-53.083-107.165-98.03C61.237 244.59 30 185.716 30 138.713c0-54.24 44.128-98.368 98.368-98.368 35.694 0 68.652 19.454 86.013 50.77l13.12 23.667 13.12-23.666c17.36-31.316 50.317-50.77 86.012-50.77 54.24 0 98.368 44.126 98.368 98.367 0 47.005-31.237 105.88-90.334 170.26z' fill={color} />
      </svg>
    )
  }
}