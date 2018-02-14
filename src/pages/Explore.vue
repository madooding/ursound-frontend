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
                cover_url: "https://blog.spoongraphics.co.uk/wp-content/uploads/2017/album-art/17.jpg",
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
                cover_url: "https://marketplace.canva.com/MAB6qmZ_0fc/1/0/thumbnail_large/canva-minimal-music-album-cover-MAB6qmZ_0fc.jpg",
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
                cover_url: "https://marketplace.canva.com/MACF-O76mPY/1/0/thumbnail_large/canva--sunset-indie-album-cover-MACF-O76mPY.jpg",
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
        height: auto;
        min-height: 100vh;
        background: #EEE;
        overflow: hidden;
    }
</style>
