import { Observable } from 'rxjs'
import axios from 'axios'
import _ from 'lodash'

const API_URL = 'http://localhost:9000'

const keyMap = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B']
const chordMap = ['', 'm', 'm', '', '', 'm', 'dim']

const scaleMap = (key) => {
    let keyMapShifted = _.concat(keyMap.slice(key, keyMap.length), keyMap.slice(0, key))
    let majorIndex = [1, 3, 5, 6, 8, 10, 12]
    let scale = _.map(majorIndex, each => keyMapShifted[each - 1])
    return scale
}

 
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

/** @description Get suggested chords from previous chords   
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

export default {
    keyMap,
    scaleMap,
    mapChord,
    getSuggestedChords
}