import Soundfont from 'soundfont-player'
import { Observable, Subject } from 'rxjs'
import store from '../store'
import axios from 'axios'
import io from 'socket.io-client'
import _ from 'lodash'
import context from './context'
import { ProjectsService } from '.';

const API_URL = 'http://localhost:9000'

const ac = context.getAudioContext()

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
    shiftedKey = shiftedKey > 7 ? shiftedKey - 12 : shiftedKey
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
    ac.resume().then(() => {
        piano.schedule(ac.currentTime, scheduleNotes)
    })
    
}


/**
 * 
 * 
 * @param {Number} project_id 
 * @param {Blob} blob 
 * @returns {Promise}
 */
const uploadBlobAudio = (project_id, region_id, blob) => {
    let _token = localStorage.getItem("_token")
    let data = new FormData()
    data.append('file', blob, `${region_id}.ogg`)
    if(_token === null) return Promise.reject({ code: "TOKEN_UNDEFINED", messages: "Token is not undefined."})
    return axios.post(`${API_URL}/service/projects/${project_id}/upload`, data, {
        headers: {
            "Authorization": `jwt ${_token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}


/**
 * 
 * 
 * @param {Object} track each track of that song
 * @returns {Observable}
 */
const setTrackPlayer = (track) => {
    if (track.type === 'PIANO') return Promise.resolve(track.sequences)
    return Observable.from(track.sequences)
            .flatMap(seq => {
                return setRegionPlayer(seq)
            }, (old, newer) => newer)
            .toArray()
}
/**
 * 
 * 
 * @param {Object} region 
 * @returns {Observable}
 */
const setRegionPlayer = (region) => {
    return Observable.fromPromise(new Promise((resolve, reject) => {
        let player = new Howl({
            src: [region.url],
            onload: (e) => {
                region.player = player
                region.original_length = player.duration() * 1000
                resolve(region)
            },
            onloaderror: (e) => {
                reject(e)
            }
        })
    }))
}



/**
 * 
 * 
 * @param {number} bpm bpm
 * @param {number} duration duration (milliseconds)
 * @returns {number} duration ms converted to beats
 */
const milliseconds2beats = (bpm, duration) => {
    let rate = 60/bpm
    return duration/1000/rate
}

const defineSocketReturnedValueStructure = {
    socket: io,
    subject: Subject.prototype
}

/**
 * 
 * 
 * @param {Number} project_id 
 * @param {Number} user_id 
 * @returns {defineSocketReturnedValueStructure} return an object including inside with io object and subjec object
 */
const defineSocketConnection = (project_id, user_id) => {
    let socket = io('http://localhost:9000/studio_chat')
    let subject = new Subject()
    socket.emit('subscribe', {
        project_id: project_id,
        user_id: user_id
    })
    socket.on('messages', messages => {
        store.dispatch('STUDIO_ADD_MESSAGE_EVENT', messages)
        subject.next({
            type: 'MESSAGES',
            messages: messages
        })
    })
    socket.on('events', event => {
        store.dispatch('STUDIO_ADD_MESSAGE_EVENT', event.result)
        if(event.result.event_type == 'MADE_CHANGES') store.dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
        subject.next({
            type: 'EVENTS',
            event: {
                ...event.result,
                payload: event.payload
            }
        })
    })
    return { socket, subject }
}

/**
 * 
 * 
 * @param {number} bpm bpm
 * @param {number} beats duration (beats)
 * @returns {number} duration beats converted to milliseconds
 */
const beats2milliseconds = (bpm, beats) => {
    let rate = 60/bpm
    return beats*rate*1000
}


export default {
    defineInstrument,
    keyMap,
    scaleMap,
    mapChord,
    getSuggestedChords,
    playChord,
    milliseconds2beats,
    beats2milliseconds,
    uploadBlobAudio,
    setRegionPlayer,
    setTrackPlayer,
    defineSocketConnection
}