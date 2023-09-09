/* @flow */

import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'

/**
 * Query an element selector if it's not an element already.
 */
export function query(el: string | Element): Element {
  if (typeof el === 'string') {
    // 如果'#app',就在文档中找这个元素。返回找到的这个元素
    // 如果el是string形式，我们就去找document是否能找到el命名的元素，未找到就会报错提示，如果找到，返回的就是找到的DOM对象
    const selected = document.querySelector(el)
    if (!selected) {
      process.env.NODE_ENV !== 'production' &&
        warn('Cannot find element: ' + el)
      return document.createElement('div')
    }
    return selected
  } else {
    // 如果是Element对象（Dom对象），就直接返回
    return el
  }
}
