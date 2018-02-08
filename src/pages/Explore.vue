<template>
    <div class="explore--bg">
        <div class="song-list--container">
            <song v-for="song in songs" :key="song.id" v-bind:song_data="song"></song>
        </div>
    </div>
</template>


<script>
import Song from '../components/Song'
export default {
    components: {
        Song
    },
    data: () => ({
        songs: [
            {
                id: 1,
                name: "Untitled-1",
                owner: "doiinn",
                url: "https://wavesurfer-js.org/example/media/small-demo.wav",
                duration: 0,
                actions: {
                    comments: 18,
                    likes: 3
                }
            },
            {
                id: 2,
                name: "Untitled-2",
                owner: "madooding",
                url: "https://wavesurfer-js.org/example/media/small-demo.wav",
                duration: 0,
                actions: {
                    comments: 24,
                    likes: 112
                }
            },
            {
                id: 3,
                name: "Untitled-3",
                owner: "madooding",
                url: "https://wavesurfer-js.org/example/media/small-demo.wav",
                duration: 0,
                actions: {
                    comments: 2,
                    likes: 43
                }
            }
        ]
    })
}
</script>

<style scoped>
    div.explore--bg {
        width: 100%;
        height: 100vh;
        background: #EEE;
        overflow: hidden;
    }
</style>
