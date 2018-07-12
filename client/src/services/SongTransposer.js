const SCALE = [
  { baseNote: 'Cb', scale: ['Cb', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'] },
  { baseNote: 'C', scale: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] },
  { baseNote: 'C#', scale: ['C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'] },
  { baseNote: 'Db', scale: ['Db', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'] },
  { baseNote: 'D', scale: ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'] },
  { baseNote: 'D#', scale: ['D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'] },
  { baseNote: 'Eb', scale: ['Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'] },
  { baseNote: 'E', scale: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'] },
  { baseNote: 'Fb', scale: ['Fb', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'] },
  { baseNote: 'F', scale: ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'] },
  { baseNote: 'F#', scale: ['F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F'] },
  { baseNote: 'Gb', scale: ['Gb', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F'] },
  { baseNote: 'G', scale: ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'] },
  { baseNote: 'G#', scale: ['G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'] },
  { baseNote: 'Ab', scale: ['Ab', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'] },
  { baseNote: 'A', scale: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'] },
  { baseNote: 'A#', scale: ['A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'] },
  { baseNote: 'Bb', scale: ['Bb', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'] },
  { baseNote: 'B', scale: ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'] },
]

export default class SongTransposer {
  constructor(songBody) {
    this.songBody = songBody
  }

  transposeSong = semitones => {
    if (!semitones) {
      return this
    }
    console.log('transposeSong', semitones)
    const chordPattern = /<chord>(.{1,7})<\/chord>/g

    const matches = []
    let chordMatch
    while ((chordMatch = chordPattern.exec(this.songBody))) {
      matches.push({
        index: chordMatch.index,
        value: chordMatch[0],
        initialLength: chordMatch[0].length,
      })
    }
    let transposedSong = this.songBody
    matches
      .map(match => this.transposeChord(match, semitones, SCALE))
      .reverse()
      .forEach(({ index, value, initialLength }) => {
        transposedSong = transposedSong.replaceBetween(index, index + initialLength, value)
      })

    this.songBody = transposedSong

    return this
  }

  transposeChord = (chord, semitones, scale) => {
    const strippedChord = chord.value.replace(/<\/?chord>/g, '')
    const chordMatch = strippedChord.match(/^(Cb|C#|C|Db|D#|D|Eb|E|Fb|F#|F|Gb|G#|G|Ab|A#|A|Bb|B)/gi)

    if (!chordMatch) {
      // TODO: Log this so I know the chords not being catched by the algorithm
      console.log('chord not found')
      return chord
    }
    const baseNote = chordMatch[0]
    const note = scale.find(s => s.baseNote.toLowerCase() === baseNote.toLowerCase())
    //console.log({ baseNote, note })

    // make sure it doesn't break if semitones is negative value
    const scaleIndex = semitones < 0 ? semitones + 12 : semitones
    const newChord = note.scale[scaleIndex] + strippedChord.substring(baseNote.length)

    // TODO: also transpose alternate root note, ex: G/B
    return { ...chord, value: `<chord>${newChord}</chord>` }
  }

  getTransposedSong = () => this.songBody
}
