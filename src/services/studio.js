import _ from 'lodash'

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

export default {
    keyMap,
    scaleMap,
    mapChord
}