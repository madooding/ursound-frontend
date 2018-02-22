<template>
    <div class="controlbar">
        <div class="controlbar__volume">
            <vue-slider ref="volume" :tooltip="false" :dot-size="14" width="100%" :max="100" :interval="1" :speed="0.5" :bgStyle="{'background-color': '#9397B0', 'height': '3px', 'border': '3px', 'cursor': 'pointer'}" :processStyle="{'background-color': '#9397B0'}" :sliderStyle="{'margin-top': '-1.7px'}"></vue-slider>
        </div>
        <div class="controlbar__current-time">00:40.5</div>
        <div class="controlbar__control">
            <button class="record-btn">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                    <g id="Layer_1_1_">
                        <g id="XMLID_2_">
                            <g id="XMLID_4_">
                                <path id="XMLID_5_" d="M20,40C9.1,40,0,30.9,0,20S9.1,0,20,0s20,9.1,20,20S30.9,40,20,40z M20,1.4C10,1.4,1.4,9.5,1.4,20
                                    S9.5,38.6,20,38.6c10,0,18.6-8.2,18.6-18.6S30,1.4,20,1.4z"/>
                            </g>
                            <circle id="XMLID_3_" cx="20" cy="20" r="8.6"/>
                        </g>
                    </g>
                </svg>
            </button>
            <button>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                <g id="Layer_1_2_">
                    <g id="XMLID_8_">
                        <g id="Oval-9-Copy">
                            <path id="XMLID_11_" d="M20,40C9.1,40,0,30.9,0,20S9.1,0,20,0s20,9.1,20,20S30.9,40,20,40z M20,1.4C10,1.4,1.4,9.5,1.4,20
                                c0,10,8.2,18.6,18.6,18.6c10,0,18.6-8.2,18.6-18.6C38.6,10,30,1.4,20,1.4z"/>
                        </g>
                        <path id="Fill-2" d="M12.7,12.7H15v14.5h-2.3V12.7z M16.8,20l10.5,7.3V12.7L16.8,20z"/>
                    </g>
                </g>
            </svg>
            </button>
            <button>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                <g id="Layer_1_1_">
                    <g id="XMLID_2_">
                        <g id="Oval-9-Copy-2">
                            <path id="XMLID_5_" d="M20,40C9.1,40,0,30.9,0,20S9.1,0,20,0s20,9.1,20,20S30.9,40,20,40z M20,1.4C10,1.4,1.4,9.5,1.4,20
                                c0,10,8.2,18.6,18.6,18.6c10,0,18.6-8.2,18.6-18.6C38.6,10,30,1.4,20,1.4z"/>
                        </g>
                        <path id="Fill-2_1_" d="M18.6,27.3V12.7L8.6,20L18.6,27.3z M19.5,20l10,7.3V12.7L19.5,20z"/>
                    </g>
                </g>
            </svg>
            </button>
            <button>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                <g id="Layer_1_2_">
                    <g id="XMLID_8_">
                        <polygon id="Fill-2" points="15.9,12.3 15.9,28.6 28.6,20.5 		"/>
                        <g id="Oval-9-Copy-3">
                            <path id="XMLID_9_" d="M20,40C9.1,40,0,30.9,0,20S9.1,0,20,0s20,9.1,20,20S30.9,40,20,40z M20,1.4C10,1.4,1.4,9.5,1.4,20
                                c0,10,8.2,18.6,18.6,18.6c10,0,18.6-8.2,18.6-18.6C38.6,10,30,1.4,20,1.4z"/>
                        </g>
                    </g>
                </g>
            </svg>
            </button>
            <button>
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                    <g id="Layer_1_1_">
                        <g id="XMLID_2_">
                            <g id="Oval-9-Copy-2">
                                <path id="XMLID_5_" d="M20,0c10.9,0,20,9.1,20,20s-9.1,20-20,20S0,30.9,0,20S9.1,0,20,0z M20,38.6c10,0,18.6-8.2,18.6-18.6
                                    c0-10-8.2-18.6-18.6-18.6C10,1.4,1.4,9.5,1.4,20C1.4,30,10,38.6,20,38.6z"/>
                            </g>
                            <path id="Fill-2_1_" d="M21.4,12.7v14.5l10-7.3L21.4,12.7z M20.5,20l-10-7.3v14.5L20.5,20z"/>
                        </g>
                    </g>
                </svg>
            </button>
        </div>
        <div class="controlbar__options">
            <div class="option">110</div>
            <div class="option">4/4</div>
            <div class="option">
                <button> 
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                        <g>
                            <path d="M20,23.9c-0.4,0-0.8-0.4-0.8-0.8V5.7c0-0.4,0.4-0.8,0.8-0.8s0.8,0.4,0.8,0.8v17.4C20.8,23.6,20.4,23.9,20,23.9z"/>
                        </g>
                        <path d="M37.9,9.3c-0.4-0.4-1.1-0.4-1.6,0L19.1,26.6H19h-1.1H9.5L17,6c0.7-2,2.5-2.2,3-2.2c0.5,0,2.3,0.2,3,2.2l4.1,11.2l1.9-1.9
                            L25.3,5.1c-0.9-2.5-3.1-3.8-5.3-3.8c-2.2,0-4.4,1.3-5.3,3.8L6.9,26.6L5.3,31c-1.3,3.7,1.2,7.7,4.9,7.7h19.6c3.7,0,6.3-4,4.9-7.7
                            l-1.6-4.5l-2.5-6.8l-1.9,1.9l1.8,4.9h-6.6h-1.3h-0.3l15.6-15.6C38.3,10.5,38.3,9.8,37.9,9.3z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="controlbar__messages">
            <button @click="showChatBox">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23">
                    <path id="message" class="cls-1" d="M1523,168l-5.89-1.473a11.5,11.5,0,1,1,4.42-4.419Zm-4.79-18.245a9.516,9.516,0,1,0-1,14.314L1520,165l-0.93-2.792A9.507,9.507,0,0,0,1518.21,149.755ZM1516.5,158a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,1516.5,158Zm-5,0a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,1511.5,158Zm-5,0a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,1506.5,158Z" transform="translate(-1500 -145)"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import vueSlider from 'vue-slider-component'

export default {
    components: {
        vueSlider
    },
    methods: {
        showChatBox(){
            this.$store.dispatch('TOGGLE_CHATBOX')
        }
    }
}
</script>
