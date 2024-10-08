import { MouseSensor as LibMouseSensor, TouchSensor as LibTouchSensor } from '@dnd-kit/core'
import { MouseEvent, TouchEvent } from 'react'

let isModalOpen = false
// Block DnD event propagation if element have "data-no-dnd" attribute
const handler = ({ nativeEvent: event }: MouseEvent | TouchEvent) => {
  let cur = event.target as HTMLElement

  // Nếu modal không mở, cho phép kéo thả bình thường
  if (!isModalOpen) {
    while (cur) {
      if (cur.dataset && cur.dataset.noDnd) {
        return false
      }
      cur = cur.parentElement as HTMLElement
    }
    return true
  }

  // Nếu modal mở, chỉ cho phép kéo thả trong modal

  return false // Chặn kéo thả ngoài modal
}

export class MouseSensor extends LibMouseSensor {
  static activators = [
    { eventName: 'onMouseDown', handler }
  ] as (typeof LibMouseSensor)['activators']

  static setModalOpen(open: boolean) {
    isModalOpen = open
  }
}

export class TouchSensor extends LibTouchSensor {
  static activators = [
    { eventName: 'onTouchStart', handler }
  ] as (typeof LibTouchSensor)['activators']

  static setModalOpen(open: boolean) {
    isModalOpen = open
  }
}
