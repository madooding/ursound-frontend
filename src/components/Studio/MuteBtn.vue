<template>
    <button @click="setActive()">
        <svg v-if="!active" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25 25" style="enable-background:new 0 0 25 25;" xml:space="preserve">
            <title>Play Btn</title>
            <g id="Layer_1_1_">
                <title>Play Btn</title>
                <desc>Created with Sketch.</desc>
                <g id="Group-2_1_" transform="translate(4.464286, 7.142857)">
                    <path id="Combined-Shape_3_" d="M4.5,2.6H1.1c-0.6,0-0.9,0.3-0.9,0.9v4c0,0.6,0.3,0.9,0.9,0.9h4l0,0l2,1.7
                        c0.3,0.3,0.9,0.3,0.9-0.3V0.4c0-0.6-0.3-0.6-0.9-0.3L4.5,2.6z"/>
                    <polygon id="Combined-Shape_2_" points="14.2,5.2 16.2,3.2 15,2.1 13.3,4.1 11.3,2.1 10.2,3.2 12.2,5.2 10.2,6.9 11.3,8 13.3,6.3 
                        15,8 16.2,6.9 		"/>
                </g>
                <g id="Oval-7_1_">
                    <path id="XMLID_8_" d="M12.5,25C5.7,25,0,19.3,0,12.5S5.7,0,12.5,0S25,5.7,25,12.5S19.6,25,12.5,25z M12.5,0.9
                        C6.2,0.9,0.9,6,0.9,12.5S6,24.1,12.5,24.1S24.1,19,24.1,12.5S19,0.9,12.5,0.9z"/>
                </g>
            </g>
        </svg>
        <svg v-else version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25 25" style="enable-background:new 0 0 25 25;" xml:space="preserve">
            <title>Play Btn</title>
            <title>Play Btn</title>
            <path id="XMLID_7_" d="M12.5,0C5.6,0,0,5.6,0,12.5S5.6,25,12.5,25c0,0,0.1,0,0.1,0c7-0.1,12.4-5.7,12.4-12.5C25,5.6,19.4,0,12.5,0z
                M20.6,14l-1.1,1.1l-1.7-1.7l-2,1.7L14.7,14l2-1.7l-2-2l1.1-1.1l2,2l1.7-2l1.1,1.1l-2,2L20.6,14z M12.4,7.5v9.4
                c0,0.6-0.6,0.6-0.9,0.3l-2-1.7h-4c-0.6,0-0.9-0.3-0.9-0.9v-4c0-0.6,0.3-0.9,0.9-0.9H9l2.6-2.6C12.1,6.9,12.4,6.9,12.4,7.5z"/>
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