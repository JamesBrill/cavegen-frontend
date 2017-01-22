import React, { PureComponent } from 'react'
import Modal from 'src/components/Modal'
import Button from 'src/components/Button'
import { autobind } from 'core-decorators'
import { PALETTE_BRUSHES_LIST } from 'src/utils/ImageLoader'

import styles from './HotkeysModal.css'

export default class HotkeysModal extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  @autobind
  handleClick() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  @autobind
  handleClose() {
    this.setState({ isOpen: false })
  }

  @autobind
  renderImageCell(row) {
    const tileName = row.tooltip.startsWith('Enemy') ?
      row.tooltip :
      row.tooltip.substring(0, row.tooltip.length - 2)
    return (
      <div className={styles.imageCell}>
        <img className={styles.tile} src={row.imagePath} />
        <span>{tileName}</span>
      </div>
    )
  }

  render() {
    const { isOpen } = this.state
    const tileData = PALETTE_BRUSHES_LIST.map(brush => {
      let selectTileHotkey, placeTileHotkey
      switch (brush.symbol) {
        case 'D':
          selectTileHotkey = 'd'
          placeTileHotkey = 'Alt + d'
          break
        case ' ':
          selectTileHotkey = 's'
          placeTileHotkey = 'Alt + s'
          break
        default:
          selectTileHotkey = brush.symbol
          placeTileHotkey = `Alt + ${brush.symbol}`
      }
      return {
        imagePath: brush.imagePath,
        tooltip: brush.tooltip,
        selectTileHotkey,
        placeTileHotkey
      }
    })

    return (
      <div className={styles.HotkeysModal}>
        <Button className={styles.openButton} onClick={this.handleClick}>Hotkeys</Button>
        <Modal className={styles.modal} isOpen={isOpen} onRequestClose={this.handleClose}>
          <div className={styles.modalContents}>
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
                  <td className={styles.actionTile}></td>
                  <td className={styles.actionTile}>Ctrl + Shift + z</td>
                </tr>
                <tr key='Insert' className={styles.actionDividerRow}>
                  <td className={styles.actionTile}>Insert tile of selected type</td>
                  <td className={styles.actionTile}>Insert</td>
                </tr>
                <tr key='Delete'>
                  <td className={styles.actionTile}>Delete tile</td>
                  <td className={styles.actionTile}>Delete</td>
                </tr>
                <tr key='Delete-1' className={styles.actionDividerRow}>
                  <td className={styles.actionTile}></td>
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
                  <td className={styles.actionTile}></td>
                  <td className={styles.actionTile}>Down</td>
                </tr>
                <tr key='Move Cursor-2'>
                  <td className={styles.actionTile}></td>
                  <td className={styles.actionTile}>Left</td>
                </tr>
                <tr key='Move Cursor-3' className={styles.actionDividerRow}>
                  <td className={styles.actionTile}></td>
                  <td className={styles.actionTile}>Right</td>
                </tr>
                <tr key='Pan'>
                  <td className={styles.actionTile}>Pan</td>
                  <td className={styles.actionTile}>Alt + Up</td>
                </tr>
                <tr key='Pan-1'>
                  <td className={styles.actionTile}></td>
                  <td className={styles.actionTile}>Alt + Down</td>
                </tr>
                <tr key='Pan-2'>
                  <td className={styles.actionTile}></td>
                  <td className={styles.actionTile}>Alt + Left</td>
                </tr>
                <tr key='Pan-3' className={styles.actionDividerRow}>
                  <td className={styles.actionTile}></td>
                  <td className={styles.actionTile}>Alt + Right</td>
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
                {tileData.map(data => (
                  <tr key={data.selectTileHotkey}>
                    <td className={styles.cell}>{this.renderImageCell(data)}</td>
                    <td className={styles.cell}>{data.selectTileHotkey}</td>
                    <td className={styles.cell}>{data.placeTileHotkey}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
    )
  }
}
