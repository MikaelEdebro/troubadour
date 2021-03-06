export default class SongFormatter {
  constructor(song) {
    this.song = song.trim().insert(0, '\n')
  }

  removeWhitespaceOnEndOfRow = () => {
    this.song = this.song.replace(/[ |\t]{1,}\n/g, '\n')
    return this
  }

  replaceTabsForSpaces = () => {
    this.song = this.song.replace(/\t/g, '    ')
    return this
  }

  highlightChordRows = () => {
    const replaceString = '\n<chord-row>$1</chord-row>\n'
    this.song = this.song
      .replace(/\n(.*( {2,}).*)\n/g, replaceString) // multiple chords
      .replace(/\n(\S{1,3})\n/g, replaceString) // one chord that spans entire row

    return this
  }

  highlightChords = () => {
    let song = this.song
    const chordRowPattern = /<chord-row>(.*)<\/chord-row>/g
    const chordPattern = /[A-Za-z#?\d?/?\\?]{1,}/gi

    let rowMatch
    while ((rowMatch = chordRowPattern.exec(song))) {
      const chordRow = rowMatch[0].replace(/<\/?chord-row>/g, '')
      let chordRowWithAddedChords = chordRow
      let matches = []

      let chordMatch
      while ((chordMatch = chordPattern.exec(chordRow))) {
        matches.push({ index: chordMatch.index, value: chordMatch[0] })
      }

      matches.reverse().forEach(({ index, value }) => {
        chordRowWithAddedChords = chordRowWithAddedChords.replaceBetween(
          index,
          index + value.length,
          `<chord>${value}</chord>`
        )
      })
      song = song.replace(rowMatch[0], `<chord-row>${chordRowWithAddedChords}</chord-row>`)
    }

    this.song = song

    return this
  }

  replaceRowBreaks = () => {
    this.song = this.song.replace(/\n/g, '<br>')
    return this
  }

  divideIntoSections = () => {
    this.song = `<section>${this.song.replace(
      /<br><br>/g,
      '</section><br><br><section>'
    )}</section>`
    return this
  }

  getFormattedSong = () => this.song
}
