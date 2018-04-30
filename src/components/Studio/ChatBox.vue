<template>
    <div class="chat-box" :class="{'show': show}">
        <div class="top">
            <p>Collaborators</p>
            <div class="collaborators">
                <div class="each">+</div>
                <div class="each">
                    <img class="profile" src="https://scontent.fbkk1-5.fna.fbcdn.net/v/t1.0-1/p320x320/26219889_1789282987773023_6787029426488757917_n.jpg?oh=6da679dd75fd139108d94c725477173d&oe=5B1DEF90" alt="">
                </div>
                <div class="each">
                    <img src="https://scontent.fbkk1-5.fna.fbcdn.net/v/t31.0-8/26240511_1551519808218522_1502791792343504415_o.jpg?oh=bfe3628a94a23133ff6d6fad9eeb1e94&oe=5B1F6E0B" alt="" class="profile">
                </div>
            </div>
        </div>
        <div class="messages-box" ref="messageBox">
            <div v-for="msg in messages" :key="msg.msg_id" class="messages" :class="{ 'right': msg.sender_id == userData.user_id && msg.type == 'MESSAGES', 'left': msg.sender_id != userData.user_id && msg.type == 'MESSAGES', 'events': msg.type == 'EVENTS' }">
                <img v-if="msg.sender_id !== userData.user_id && msg.type == 'MESSAGES'" class="profile" :src="msg.sender_img">
                <div v-if="msg.type === 'MESSAGES'" class="sub-messages">
                    <div v-for="message in msg.messages" :key="message.datetime" class="text">{{ message.message }}</div>
                </div>
                <div v-if="msg.type === 'EVENTS' && msg.event_type == 'LEAVE_PROJECT'" class="text">{{ msg.sender_name }} left this project</div>
                <div v-if="msg.type === 'EVENTS' && msg.event_type == 'MADE_CHANGES'" class="text">{{ msg.sender_name }} has made changes</div>

            </div>
        </div>
        <div class="message-input">
            <textarea type="text" v-model="text" placeholder="Say Something" rows="1" ref="textbox"></textarea>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import io from 'socket.io-client'


export default {
    props: ['project_id'],
    data: () => ({
        socket: null,
        text: '',
        mockup_messages: [
            {
                msg_id: '5ae24d517adb300e0862a58d',
                sender_id: 58,
                type: 'MESSAGES',
                last_update: '1524778069952',
                sender_img: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p720x720/26230150_1551519808218522_1502791792343504415_n.jpg?oh=41212f4e28c1e0786b9d1cb624dfa082&oe=5ADAB32F',
                messages: [
                    {
                        datetime: '1524778069952',
                        message: 'Get out of here!'
                    }
                ]
            },
            {
                msg_id: '5ae24d6ef4616be79fc347d3',
                sender_id: 50,
                type: 'MESSAGES',
                last_update: '1524779809109',
                sender_img: 'https://scontent.fbkk1-5.fna.fbcdn.net/v/t1.0-1/p320x320/26219889_1789282987773023_6787029426488757917_n.jpg?oh=6da679dd75fd139108d94c725477173d&oe=5B1DEF90',
                messages: [
                    {
                        datetime: '1524779809109',
                        message: 'Nope!'
                    }
                ]
            },
            {
                msg_id: '5ae24d7dfbe0abc611262fc6',
                sender_id: 58,
                type: 'MESSAGES',
                last_update: '1524780016844',
                sender_img: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p720x720/26230150_1551519808218522_1502791792343504415_n.jpg?oh=41212f4e28c1e0786b9d1cb624dfa082&oe=5ADAB32F',
                messages: [
                    {
                        datetime: '1524779971378',
                        message: "I'm gonna call police!"
                    },
                    {
                        datetime: '1524780016844',
                        message: "Get out now!"
                    }
                ]
            },
            {
                msg_id: '5ae24d9ad6a918fa90af96c0',
                sender_id: 50,
                sender_name: 'doiinn',
                type: 'EVENTS',
                event_type: 'LEAVE_PROJECT',
                datetime: '1524780117080'
            },
            {
                msg_id: '5ae2526bb9c4edc09c9f0f06',
                sender_id: 58,
                sender_name: 'madooding',
                type: 'EVENTS',
                event_type: 'MADE_CHANGES',
                datetime: '1524781707669'
            }
        ]
    }),
    created () {

    },
    mounted () {
        $(this.$refs.textbox).bind({
            keydown: (e) => {
                if(e.which == 13 && e.shiftKey !== true) {
                    this.send()
                    return false
                }
                return true
            }
        })
    },
    updated () {
        this.$nextTick(() => {
            let messageBox = $(this.$refs.messageBox)
            messageBox.scrollTop(this.$refs.messageBox.scrollHeight)
        })
    },
    methods: {
        send () {
            this.$store.dispatch('STUDIO_SEND_MESSAGE', {
                user_id: this.userData.user_id,
                message: this.text
            })
            this.text = ''
        }
    },
    watch: {
        messages () {
            let messageBox = $(this.$refs.messageBox)
            messageBox.animate({ scrollTop: this.$refs.messageBox.scrollHeight }, "slow")
        }
    },
    computed: {
        ...mapGetters({ details: 'getStudioDetails', show: 'isChatboxShow', userData: 'getUserProfileData', studioChat: 'getStudioChat', studioEnv: 'getStudioEnv' }),
        messages () { return this.studioChat.chat_messages }
    }
}
</script>

