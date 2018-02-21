<template>
    <button @click="setActive()">
        <svg v-if="!active" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25 25" style="enable-background:new 0 0 25 25;" xml:space="preserve">
            <g id="Layer_1_1_">
                <title>Play Btn</title>
                <desc>Created with Sketch.</desc>
                <g id="Oval-7">
                    <path id="XMLID_11_" d="M12.5,25C5.7,25,0,19.3,0,12.5S5.7,0,12.5,0S25,5.7,25,12.5S19.3,25,12.5,25z M12.5,0.9
                        C6.2,0.9,0.9,6,0.9,12.5S6,24.1,12.5,24.1S24.1,19,24.1,12.5S18.8,0.9,12.5,0.9z"/>
                </g>
                <g id="XMLID_7_">
                    <path id="XMLID_3_" d="M8.5,13.1c-0.6,0-1.1,0.6-1.1,1.1v3.7C7.4,18.5,8,19,8.5,19s1.1-0.6,1.1-1.1v-3.7
                        C9.7,13.4,9.1,13.1,8.5,13.1z"/>
                    <path id="XMLID_2_" d="M16.5,12.8c-0.6,0-1.1,0.6-1.1,1.1v3.7c0,0.6,0.6,1.1,1.1,1.1c0.6,0,1.1-0.6,1.1-1.1v-3.7
                        C17.6,13.4,17,12.8,16.5,12.8z"/>
                    <path id="XMLID_1_" d="M19,14.5v-1.7c0-3.7-3.1-6.5-6.5-6.5S6,9.1,6,12.8v2c-0.3,0.3-0.6,0.9-0.6,1.4c0,1.1,0.9,1.7,1.7,2v-4
                        c-0.3,0-0.3,0-0.6,0v-1.4c0-3.1,2.6-5.7,6-5.7c3.4,0,6,2.6,6,5.7v1.1c-0.3,0-0.3,0-0.6,0l0,0v3.7c0.9,0,1.7-0.9,1.7-2
                        C19.6,15.3,19.6,14.8,19,14.5z"/>
                </g>
            </g>
        </svg>
        <svg v-else version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25 25" style="enable-background:new 0 0 25 25;" xml:space="preserve">
            <title>Play Btn</title>
            <desc>Created with Sketch.</desc>
            <polygon id="XMLID_9_" points="12.5,0 12.5,0 12.5,0 "/>
            <path id="XMLID_11_" d="M25,12.4C24.9,5.5,19.4,0,12.5,0c0,0,0,0,0,0c0,0,0,0,0,0C5.6,0,0,5.6,0,12.5S5.6,25,12.5,25
                c6.9,0,12.4-5.5,12.5-12.4c0,0,0-0.1,0-0.1C25,12.5,25,12.4,25,12.4z M15.3,17.6v-3.7c0-0.6,0.6-1.1,1.1-1.1c0.6,0,1.1,0.6,1.1,1.1
                v3.7c0,0.6-0.6,1.1-1.1,1.1C15.9,18.7,15.3,18.2,15.3,17.6z M19,12.8v1.7c0.6,0.3,0.6,0.9,0.6,1.1c0,1.1-0.9,2-1.7,2v-3.7
                c0.3,0,0.3,0,0.6,0v-1.1c0-3.1-2.6-5.7-6-5.7c-3.4,0-6,2.6-6,5.7v1.4c0.3,0,0.3,0,0.6,0v4c-0.9-0.3-1.7-0.9-1.7-2
                c0-0.6,0.3-1.1,0.6-1.4v-2c0-3.7,3.1-6.5,6.5-6.5S19,9.1,19,12.8z M9.7,14.2v3.7c0,0.6-0.6,1.1-1.1,1.1c-0.6,0-1.1-0.6-1.1-1.1v-3.7
                c0-0.6,0.6-1.1,1.1-1.1C9.1,13.1,9.7,13.4,9.7,14.2z"/>
        </svg>
    </button>
</template>

<script>
export default {
    props: ['active'],
    methods: {
        setActive() {
            this.$emit('onActivate', !this.active)
        }
    }
}
</script>
