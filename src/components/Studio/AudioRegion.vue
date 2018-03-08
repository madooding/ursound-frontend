<template>
    <div v-if="track_data.type === 'PIANO'">
        <div class="chord-name">{{ region_data.chord }}</div>
        <div class="time-signature">{{ time_signature }}</div>
    </div>  
    <div v-else-if="track_data.type === 'AUDIO'">

    </div>
</template>

<script>

import { mapGetters }from 'vuex'

export default {
    props: ['track_data', 'region_data'],
    computed: {
        time_signature() {
            return `${this.region_data.beat}/${this.details.time_signature}`
        },
        ...mapGetters({ details: 'getStudioDetails' })
    }
}
</script>
