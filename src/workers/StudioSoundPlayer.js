import { StudioService } from '../services'
import Soundfont from 'soundfont-player'



self.addEventListener('message', function (e) {
    let data = e.data
    switch (data.play) {
        case 'chord': 
            console.log('Playing chord : ', StudioService.mapChord(data.key, data.chord));
            break;
        case 'audio':
            console.log('Playing audio : ', data.audio);
            break;
    }
}, false);