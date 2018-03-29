import Soundfont from 'soundfont-player'
import { Observable } from 'rxjs'
import store from '../store'
import axios from 'axios'
import _ from 'lodash'

const API_URL = 'http://localhost:9000'

const AudioContext = window.AudioContext || window.webkitAudioContext
const ac = new AudioContext()

const keyMap = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B']
const chordMap = ['', 'm', 'm', '', '', 'm', 'dim']

const chordType = { 'major': [48, 52, 55], 'minor': [48, 51, 55], 'diminished': [48, 51, 54] }
/**
 * 
 * 
 * @param {number} key 
 * @returns {array<string>}
 */
const scaleMap = (key) => {
    let keyMapShifted = _.concat(keyMap.slice(key, keyMap.length), keyMap.slice(0, key))
    let majorIndex = [1, 3, 5, 6, 8, 10, 12]
    let scale = _.map(majorIndex, each => keyMapShifted[each - 1])
    return scale
}

/**
 * 
 * 
 * @param {number} key 
 * @param {string} n 
 * @returns {array<string>} return chord in major scale
 */
const mapChord = (key, n) => {
    if (/(^[1-7]{1}$)/.test(n)) {
        n = parseInt(n)
        return scaleMap(key)[n - 1] + chordMap[n - 1]
    } else if (/(^b[1-7]{1}$)/.test(n)) {
        n = parseInt(n[1])
        return scaleMap(key)[n - 1] + 'b'
    } else if (/(^[1-7]{1}\/[1-7]{1}$)/.test(n)) {
        let a = parseInt(n[0])
        let b = parseInt(n[2])
        return mapChord(_.findIndex(keyMap, key => key == scaleMap(key)[b - 1]), a)
    }
}

/** @description (Get suggested chords from previous chords)   
 * @param {array<string>} sequences sequences of chord progression
 * @return {Observable} this function will return observable object  
 */ 
const getSuggestedChords = (sequences) => {
    return Observable.of(sequences)
        .flatMap((seq) => {
            let cp = _.join(seq, ',')
            return axios.get(`${API_URL}/trends/nodes?cp=${cp}`)
        }, (seq, res) => ({ res: res.data.suggestions }))
        .flatMap(seq => {
            return _.filter(seq.res, each => /(^[1-7]{1}$)|(^[1-7]{1}\/[1-7]{1}$)|(^b[1-7]{1}$)/.test(each.chord_ID))
        }, (seq, res) => res)
        .take(7)
        .toArray()
}

/**
 * 
 * 
 * @returns {Observable} return observable that contains piano instrument soundfont object
 */
const defineInstrument = () => {
    return Observable.fromPromise(Soundfont.instrument(ac, 'acoustic_grand_piano'))
        .do(piano => {
            store.dispatch('SET_PIANO_INSTRUMENT', piano)
        })
}

/**
 * 
 * 
 * @param {string} chord chord
 * @param {number} beat how many time of repeating playing that chord
 * @param {number} timer duration
 */
const playChord = (chord, beat, timer) => {
    let piano = store.getters.getStudioEnv.piano
    let shiftedKey = _.findIndex(keyMap, key => key === chord[0] || key === chord[0]+chord[1])
    shiftedKey = shiftedKey > 5 ? shiftedKey - 12 : shiftedKey
    let chordStruct
    if (/^[A-G][#b]?$/.test(chord)){
        chordStruct = _.map(chordType.major, note => note + shiftedKey)
    } else if (/^[A-G][#b]?m$/.test(chord)){
        chordStruct = _.map(chordType.minor, note => note + shiftedKey)
    } else if (/^[A-G][#b]?dim$/.test(chord)){
        chordStruct = _.map(chordType.diminished, note => note + shiftedKey)
    }
    let scheduleNotes = _.concat(_.map(_.range(beat), each => (_.map(chordStruct, note => ({ time: each * timer, 'note': note, duration: timer})))))
    scheduleNotes = _.flatten(scheduleNotes)

    piano.schedule(ac.currentTime, scheduleNotes)
}

export default {
    defineInstrument,
    keyMap,
    scaleMap,
    mapChord,
    getSuggestedChords,
    playChord
}