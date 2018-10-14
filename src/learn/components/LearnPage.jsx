import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import { PALETTE_BRUSH_IMAGES } from 'src/utils/ImageLoader'
import withNavbar from 'src/app/utils/withNavbar'

import styles from 'src/learn/components/LearnPage.css'

@withNavbar
export default class LearnPage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  }

  @autobind
  renderImageCell(row) {
    const tileName = row.tooltip.startsWith('Enemy')
      ? row.tooltip
      : row.tooltip.substring(0, row.tooltip.length - 2)
    return (
      <div className={styles.imageCell}>
        <img className={styles.tile} src={row.imagePath} />
        <span>
          {tileName}
        </span>
      </div>
    )
  }

  @autobind
  renderRegionIcon(data) {
    return (
      <div className={styles.regionIcon}>
        <img className={styles.tile} src={data.imagePath} />
      </div>
    )
  }

  render() {
    const { className, children } = this.props
    const computedClassName = classNames(styles.LearnPage, className)
    return (
      <div className={computedClassName}>
        {children}
        <div className={styles.contents}>
          <h2 className={styles.title}>Actions</h2>
          <table className={styles.actionTable}>
            <tbody>
              <tr className={styles.actionDividerRow}>
                <th>Action</th>
                <th>Hotkeys</th>
              </tr>
              <tr key='Undo' className={styles.actionDividerRow}>
                <td className={styles.actionTile}>Undo</td>
                <td className={styles.actionTile}>Ctrl + z</td>
              </tr>
              <tr key='Redo'>
                <td className={styles.actionTile}>Redo</td>
                <td className={styles.actionTile}>Ctrl + y</td>
              </tr>
              <tr key='Redo-1' className={styles.actionDividerRow}>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Ctrl + Shift + z</td>
              </tr>
              <tr key='Insert' className={styles.actionDividerRow}>
                <td className={styles.actionTile}>
                  Insert tile of selected type
                </td>
                <td className={styles.actionTile}>Insert</td>
              </tr>
              <tr key='Delete'>
                <td className={styles.actionTile}>Delete tile</td>
                <td className={styles.actionTile}>Delete</td>
              </tr>
              <tr key='Delete-1' className={styles.actionDividerRow}>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Backspace</td>
              </tr>
              <tr key='Zoom In' className={styles.actionDividerRow}>
                <td className={styles.actionTile}>Zoom in</td>
                <td className={styles.actionTile}>Ctrl + Alt + =</td>
              </tr>
              <tr key='Zoom Out' className={styles.actionDividerRow}>
                <td className={styles.actionTile}>Zoom out</td>
                <td className={styles.actionTile}>Ctrl + Alt + -</td>
              </tr>
              <tr key='Move Cursor'>
                <td className={styles.actionTile}>Move cursor</td>
                <td className={styles.actionTile}>Up</td>
              </tr>
              <tr key='Move Cursor-1'>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Down</td>
              </tr>
              <tr key='Move Cursor-2'>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Left</td>
              </tr>
              <tr key='Move Cursor-3' className={styles.actionDividerRow}>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Right</td>
              </tr>
              <tr key='Pan'>
                <td className={styles.actionTile}>Pan</td>
                <td className={styles.actionTile}>Alt + Up</td>
              </tr>
              <tr key='Pan-1'>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Alt + Down</td>
              </tr>
              <tr key='Pan-2'>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Alt + Left</td>
              </tr>
              <tr key='Pan-3' className={styles.actionDividerRow}>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Alt + Right</td>
              </tr>
            </tbody>
          </table>
          <h2 className={styles.title}>Region Selector</h2>
          {this.renderRegionIcon(
            PALETTE_BRUSH_IMAGES.find(x => x.tooltip === 'Select Region a')
          )}
          <table className={styles.actionTable}>
            <tbody>
              <tr className={styles.actionDividerRow}>
                <th>Action</th>
                <th>Hotkeys</th>
              </tr>
              <tr key='Region' className={styles.actionDividerRow}>
                <td className={styles.actionTile}>Use</td>
                <td className={styles.actionTile}>a</td>
              </tr>
              <tr key='Region Resize-1'>
                <td className={styles.actionTile}>Resize region</td>
                <td className={styles.actionTile}>Shift + Up</td>
              </tr>
              <tr key='Region Resize-2'>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Shift + Down</td>
              </tr>
              <tr key='Region Resize-3'>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Shift + Left</td>
              </tr>
              <tr key='Region Resize-4' className={styles.actionDividerRow}>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Shift + Right</td>
              </tr>
              <tr key='Region Move-1'>
                <td className={styles.actionTile}>Move region</td>
                <td className={styles.actionTile}>Alt + Shift + Up</td>
              </tr>
              <tr key='Region Move-2'>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Alt + Shift + Down</td>
              </tr>
              <tr key='Region Move-3'>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Alt + Shift + Left</td>
              </tr>
              <tr key='Region Move-4' className={styles.actionDividerRow}>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Alt + Shift + Right</td>
              </tr>
              <tr key='Region Fill-1'>
                <td className={styles.actionTile}>Fill region</td>
                <td className={styles.actionTile}>Alt + tile key</td>
              </tr>
              <tr key='Region Fill-2' className={styles.actionDividerRow}>
                <td className={styles.actionTile} />
                <td className={styles.actionTile}>Alt + click palette tile</td>
              </tr>
              <tr key='Region Copy' className={styles.actionDividerRow}>
                <td className={styles.actionTile}>Copy region</td>
                <td className={styles.actionTile}>Ctrl + c</td>
              </tr>
              <tr key='Region Paste' className={styles.actionDividerRow}>
                <td className={styles.actionTile}>Paste region</td>
                <td className={styles.actionTile}>Ctrl + v</td>
              </tr>
            </tbody>
          </table>
          <h2 className={styles.title}>Tiles</h2>
          <table>
            <tbody>
              <tr>
                <th>Tile</th>
                <th>Select tile type</th>
                <th>Place tile</th>
              </tr>
              {PALETTE_BRUSH_IMAGES.filter(
                x => x.tooltip !== 'Select Region a'
              ).map(data =>
                <tr key={data.selectTileHotkey}>
                  <td className={styles.cell}>
                    {this.renderImageCell(data)}
                  </td>
                  <td className={styles.cell}>
                    {data.selectTileHotkey}
                  </td>
                  <td className={styles.cell}>
                    {data.placeTileHotkey}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
