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
    const tableData = PALETTE_BRUSHES_LIST.map(brush => {
      let selectTileHotkey, placeTileHotkey
      switch (brush.symbol) {
        case 'D':
          selectTileHotkey = 'd'
          placeTileHotkey = 'alt + d'
          break
        case ' ':
          selectTileHotkey = 's'
          placeTileHotkey = 'alt + s'
          break
        default:
          selectTileHotkey = brush.symbol
          placeTileHotkey = `alt + ${brush.symbol}`
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
            <table>
              <tbody>
                <tr>
                  <th>Tile</th>
                  <th>Select Tile Hotkey</th>
                  <th>Place Tile Hotkey</th>
                </tr>
                {tableData.map(data => (
                  <tr className={styles.row} key={data.selectTileHotkey}>
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
