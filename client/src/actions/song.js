import * as types from './types'
import axios from '../axios-instance'
import to from 'await-to-js'

export const play = () => ({
  type: types.PLAY,
})

export const pause = () => ({
  type: types.PAUSE,
})

export const replay = () => ({
  type: types.REPLAY,
})

export const changeFontSize = value => ({
  type: types.CHANGE_FONT_SIZE,
  value,
})

export const transposeSong = value => dispatch => {
  dispatch({
    type: types.TRANSPOSE_SONG,
    value,
  })

  setTimeout(() => {
    dispatch({
      type: types.RESET_TRANSPOSE,
    })
  }, 200)
}

export const changeScrollSpeed = value => ({
  type: types.CHANGE_SCROLL_SPEED,
  value,
})

export const toggleControls = value => ({
  type: types.TOGGLE_CONTROLS,
  value,
})

export const scrollComplete = () => ({
  type: types.SCROLL_COMPLETE,
})

export const fetchSongs = () => async dispatch => {
  const res = await axios.get('/api/songs')
  dispatch({ type: types.FETCH_SONGS, payload: res.data })
}

export const setIsFetchingSongs = () => dispatch => {
  dispatch({ type: types.SET_IS_FETCHING_SONGS })
}

export const fetchAndSelectSong = songId => async dispatch => {
  const [err, res] = await to(axios.get('/api/songs/' + songId))
  if (err) {
    dispatch({ type: types.SONG_NOT_FOUND })
  } else if (res && res.data) {
    dispatch({ type: types.SELECT_SONG, payload: res.data })
  }
}

export const selectSong = song => dispatch => {
  dispatch({ type: types.SELECT_SONG, payload: song })
}

export const clearSelectedSong = () => dispatch => {
  dispatch({ type: types.CLEAR_SELECTED_SONG })
}

export const addSong = (song, history) => async dispatch => {
  const res = await axios.post('/api/songs', song)
  history.push('/songs/' + res.data._id)
  dispatch({ type: types.ADD_SONG })
}

export const editSong = (songId, values, history) => async dispatch => {
  const res = await axios.put('/api/songs/' + songId, values)

  dispatch({ type: types.EDIT_COMPLETE })

  // allow to not pass history and prevent redirect, like when changing fontSize etc
  if (history) {
    dispatch({ type: types.CLEAR_SELECTED_SONG })
    history.push('/songs/' + res.data._id)
  }
}

export const deleteSong = (songId, history) => async dispatch => {
  await axios.delete('/api/songs/' + songId)
  dispatch({ type: types.DELETE_SONG })
  history.push('/songs?refresh=' + songId)
}
