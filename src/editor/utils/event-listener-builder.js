/* eslint-disable no-invalid-this */

import caveViewModel from '' // TODO: make appropriate import here
import caveView from '' // TODO: make appropriate import here

export function addMouseEventListeners() {
  caveView.canvas.addEventListener('mousemove', function (event) {
    const pixelX = event.pageX - this.offsetLeft - this.offsetParent.offsetLeft
    const pixelY = event.pageY - this.offsetTop - this.offsetParent.offsetTop
    caveViewModel.continuePaintingAtMousePosition(pixelX, pixelY)
  })

  caveView.canvas.addEventListener('mousedown', function (event) {
    if (!caveView.zoomer.panning) {
      const pixelX = event.pageX - this.offsetLeft - this.offsetParent.offsetLeft
      const pixelY = event.pageY - this.offsetTop - this.offsetParent.offsetTop
      caveViewModel.startPaintingAtMousePosition(pixelX, pixelY)
    }
  })

  caveView.canvas.addEventListener('mouseup', caveViewModel.finishPainting)

  caveView.canvas.addEventListener('mouseleave', () => {
    caveViewModel.finishPainting()
    caveViewModel.previousCursorSize = caveViewModel.currentCursorSize
  })
}

export function addKeyboardEventListeners() {
  addCommandKeyBindings()
  addTileKeyBindings()
  addPanningKeyBindings()
}

function addCommandKeyBindings() {
  /* $(document).bind('keydown', 'shift+z', function() { caveViewModel.undo() })
  $(document).bind('keydown', 'shift+y', function() { caveViewModel.redo() })
  $(document).bind('keydown', 'shift+g', function() { caveViewModel.generateCave() })
  $(document).bind('keydown', 'shift+s', function() { caveStorage.storeCave() })
  $(document).bind('keydown', 'ctrl', function() { caveView.zoomer.enablePanning() })
  $(document).bind('keyup', 'ctrl', function() { caveView.zoomer.disablePanning() }) */
}

function addTileKeyBindings() {
  /* $(document).bind('keydown', 's', function() { currentBrush = TileUtils.getTileFromSymbol(' ') })

  $('body').keypress(function(e)
  {
    var keyPressed = String.fromCharCode(e.which)
    if (TileUtils.isTile(keyPressed))
    {
      currentBrush = TileUtils.getTileFromSymbol(keyPressed)
    }
  }) */
}

function addPanningKeyBindings() {
  window.onkeydown = function (e) {
    if (e.which === 37) {
      caveView.zoomer.startPanningLeft()
    }
    if (e.which === 38) {
      caveView.zoomer.startPanningUp()
    }
    if (e.which === 39) {
      caveView.zoomer.startPanningRight()
    }
    if (e.which === 40) {
      caveView.zoomer.startPanningDown()
    }
  }

  window.onkeyup = function (e) {
    if (e.which === 37) {
      caveView.zoomer.stopPanningLeft()
    }
    if (e.which === 38) {
      caveView.zoomer.stopPanningUp()
    }
    if (e.which === 39) {
      caveView.zoomer.stopPanningRight()
    }
    if (e.which === 40) {
      caveView.zoomer.stopPanningDown()
    }
  }
}
