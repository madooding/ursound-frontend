<template>
    <div class="chat-box" :class="{'show': show}">
        <div class="top">
            <p>Collaborators</p>
            <div class="collaborators">
                <div class="each" @click="addNewContributor()">+</div>
                <div class="each" v-for="member in details.members.concat(just_added_users)" :key="member.user_id">
                    <img :src="findUserProfile(member.user_id).profile_img" alt="" class="profile">
                </div>
            </div>
        </div>
        <div class="messages-box" ref="messageBox">
            <div v-for="msg in messages" :key="msg.msg_id" class="messages" :class="{ 'right': msg.sender_id == userData.user_id && msg.type == 'MESSAGES', 'left': msg.sender_id != userData.user_id && msg.type == 'MESSAGES', 'events': msg.type == 'EVENTS' }">
                <img v-if="msg.sender_id !== userData.user_id && msg.type == 'MESSAGES'" class="profile" :src="findUserProfile(msg.sender_id).profile_img" v-cloak>
                <div v-if="msg.type === 'MESSAGES'" class="sub-messages">
                    <div v-for="message in msg.messages" :key="message.datetime" class="text">{{ message.message }}</div>
                </div>
                <div v-if="msg.type === 'EVENTS' && msg.event_type == 'LEAVE_PROJECT'" class="text">{{ findUserProfile(msg.sender_id).username }} left this project</div>
                <div v-if="msg.type === 'EVENTS' && msg.event_type == 'MADE_CHANGES'" class="text">{{ findUserProfile(msg.sender_id).username }} has made changes</div>
                <div v-if="msg.type === 'EVENTS' && msg.event_type == 'ADD_NEW_COLLABORATORS'" class="text">{{ `${findUserProfile(msg.sender_id).username} has added ${findUserProfile(msg.payload.user_id).username} into the project` }}</div>

            </div>
        </div>
        <div class="message-input">
            <textarea type="text" v-model="text" placeholder="Say Something" rows="1" ref="textbox"></textarea>
        </div>
    </div>
</template>

<script>
import { Observable } from 'rxjs'
import { mapGetters } from 'vuex'
import io from 'socket.io-client'
import { UserService } from '../../services/index';

export default {
    props: ['project_id'],
    data: () => ({
        socket: null,
        text: '',
        temp_users_data: [],
        just_added_users: []
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
        },
        addNewContributor () {
            this.$store.dispatch('STUDIO_SET_MODE', 'ADD_NEW_CONTRIBUTOR')
        },
        findUserProfile (user_id) {
            let user = _.find(this.details.members, member => member.user_id == user_id)
            if(!user || user.profile_img == '') user = _.find(this.temp_users_data, member => member.user_id == user_id)
            if(!user || user.profile_img == '') {
                let temp_user_data = {
                    user_id: user_id,
                    username: '',
                    profile_img: '../../../static/blank_profile.png'
                }
                this.temp_users_data.push(temp_user_data)
                let index = this.temp_users_data.length - 1
                Observable.fromPromise(UserService.getUserProfileByUserId(user_id))
                    .pluck('data')
                    .pluck('user')
                    .subscribe(result => {
                        this.temp_users_data[index] = result
                        if(!this.temp_users_data[index].profile_img) this.temp_users_data[index].profile_img = '../../../static/blank_profile.png'
                    })
                return this.temp_users_data[index]
            } else return user
        },
        addJustAddedUsers (user) {
            this.just_added_users.push(user)
        }
    },
    watch: {
        messages () {
            let messageBox = $(this.$refs.messageBox)
            messageBox.animate({ scrollTop: this.$refs.messageBox.scrollHeight }, "slow")
        },
        'studioEnv.studioEvent' () {
            this.studioEnv.studioEvent
                .subscribe(data => {
                    if(data.type == 'EVENTS' && data.event.event_type == 'ADD_NEW_COLLABORATORS'){
                        this.addJustAddedUsers(data.event.payload)
                    }
                })
        }
    },
    computed: {
        ...mapGetters({ details: 'getStudioDetails', show: 'isChatboxShow', userData: 'getUserProfileData', studioChat: 'getStudioChat', studioEnv: 'getStudioEnv' }),
        messages () { return this.studioChat.chat_messages }
    }
}
</script>

