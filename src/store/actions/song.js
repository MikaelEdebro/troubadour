import * as actionTypes from './actionTypes'

export const play = () => ({
  type: actionTypes.PLAY,
})
export const pause = () => ({
  type: actionTypes.PAUSE,
})

export const selectSong = id => ({
  type: actionTypes.SELECT_SONG,
  id,
})
