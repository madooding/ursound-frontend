
let AudioContext = window.AudioContext || window.webkitAudioContext
let audioContext

/**
 * 
 * 
 * @returns {AudioContextBase}
 */
const getAudioContext = () => {
    if(!audioContext) {
        audioContext = new AudioContext()
    }
    return audioContext
}

export default {
    getAudioContext
}