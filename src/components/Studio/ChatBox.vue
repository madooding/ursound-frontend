<template>
    <div class="chat-box" :class="{'show': show}">
        <div class="top">
            <p>Collaborators</p>
            <div class="collaborators">
                <div class="each">+</div>
                <div class="each"></div>
                <div class="each"></div>
            </div>
        </div>
        <div class="messages-box">
            <div class="messages right">
                <div class="sub-messages">
                    <div class="text">Get out of here!!</div>
                </div>
            </div>
            <div class="messages left">
                <img class="profile" src="https://scontent.fbkk1-5.fna.fbcdn.net/v/t1.0-1/p320x320/26219889_1789282987773023_6787029426488757917_n.jpg?oh=6da679dd75fd139108d94c725477173d&oe=5B1DEF90" alt="">
                <div class="sub-messages">
                    <div class="text">Nope!</div>
                </div>
            </div>
            <div class="messages right">
                <div class="sub-messages">
                    <div class="text">I'm gonna call police!</div>
                    <div class="text">Get out now!</div>
                </div>
            </div>
            <div class="messages events">doiinn left chat</div>
        </div>
        <div class="message-input">
            <textarea type="text" placeholder="Say Something" rows="1"></textarea>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters({show: 'isChatboxShow'})
    }
}
</script>

