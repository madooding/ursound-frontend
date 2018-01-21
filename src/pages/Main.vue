<template>
    <div class="main">
        <div class="main__section--full" ref="section1" id="section1">
            <h1>You need a song<br>Why not do it yourself ?</h1>
            <router-link tag="button" class="button button--gradient" to="/signup">JOIN US</router-link>
        </div>
        <div class="main__section main__section--2" id="section2">
            <img src="@/assets/images/DAW.png" alt="">
            <div class="main__section main__section--2__content">
                <h3>Who are we ?</h3>
                <div class="main__section--2__content__text">
                    We provide a system to help you to make music easily even if you do not have the knowledge about music theory. We know that making music is the darkest secret in the universe. but, you don't be worry anymore. let us help you.
                </div>
            </div>
        </div>
        <div class="main__section main__section--3">
            <h3 class="main__section__header--underlined">
                Useful Features
            </h3>

            <div class="main__section--3__slides">
                <div class="main__section--3__slides__slide">
                    <img src="@/assets/images/slide1-img.png" alt="">
                    <div class="main__section--3__slides__slide__content">
                        <h4>Chord Suggestions</h4>
                        <div class="main__section--3__slides__slide__content__text">
                            The most useful tool to help newbies arrage chords progression easily by predict next chord by previous chords. but, a bit of chords knowledge are required.<strong>Powered by Hooktheory</strong>
                        </div>
                    </div>
                </div>
                <div class="main__section--3__slides__slide">
                    <img src="@/assets/images/slide1-img.png" alt="">
                    <div class="main__section--3__slides__slide__content">
                        <h4>Collaboration System</h4>
                        <div class="main__section--3__slides__slide__content__text">
                            The most useful tool to help newbies arrage chords progression easily by predict next chord by previous chords. but, a bit of chords knowledge are required.
                        </div>
                    </div>
                </div>
                <div class="main__section--3__slides__slide">
                    <img src="@/assets/images/slide1-img.png" alt="">
                    <div class="main__section--3__slides__slide__content">
                        <h4>Social Sharing</h4>
                        <div class="main__section--3__slides__slide__content__text">
                            The most useful tool to help newbies arrage chords progression easily by predict next chord by previous chords. but, a bit of chords knowledge are required.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main__section main__section--4">
            <h3 class="main__section__header--underlined">
                Featured Artists
            </h3>
            <div class="main__section--4__featured-artists">
                <div class="main__section--4__featured-artists__artist main__section--4__featured-artists__artist--job" >
                    <div class="main__section--4__featured-artists__artist__content">
                        <h4>Job The Rapper</h4>
                        <div class="main__section--4__featured-artists__artist__content__desc">
                            He knows nothing about rap. but with love in singing so, he never gives up in the way of rap. However, he can't raps anyway.
                        </div>
                    </div>
                </div>
                <div class="main__section--4__featured-artists__artist main__section--4__featured-artists__artist--spectre">
                    <div class="main__section--4__featured-artists__artist__content">
                        <h4>Spectre</h4>
                        <div class="main__section--4__featured-artists__artist__content__desc">
                            He is well known as a DJ since high school. most of his songs are released on soundcloud and youtube. He also is big fan of Skrillex.
                        </div>
                    </div>
                </div>
                <div class="main__section--4__featured-artists__artist main__section--4__featured-artists__artist--wolverine">
                     <div class="main__section--4__featured-artists__artist__content">
                        <h4>Wolverine ?</h4>
                        <div class="main__section--4__featured-artists__artist__content__desc">
                            I always were angry when people calls me Wolverine. but now I have realized after I saw myself in the mirror I gotta meet Prof Xavier.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main__section main__section--5" ref="section5">
            <h3>Let us help you!</h3>
            <p>Forget about complicated music production tools.<br>Let us help you and move on!</p>
            <router-link tag="button" class="button button--gradient" to="/signup">JOIN US</router-link>
        </div>
        <div class="main__section main__section--6" ref="section6">
            <div class="main__section--6__brand">
                <h4>UrSound <small>Copyright © {{ currentYear }} UrSound, The Senior project at IT@KMITL#12.</small></h4>
            </div>

            <div class="main__section--6__menu">
                <ul>
                    <li><router-link to="/login" class="">Login</router-link></li>
                    <li><router-link to="/signup" class="">Signup</router-link></li>
                    <li><a @click="scrollToTop()">Back to top</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import MenuBarBeforeAuth from '../components/MenuBarBeforeAuth'
import moment from 'moment'
    export default {
        components: {
            MenuBarBeforeAuth
        },
        data: () => ({
            currentYear: moment().format('YYYY')
        }),
        mounted() {
            $('.main__section--3__slides').slick({
                dots: true,
                dotsClass: 'useful-features-dots',
                infinite: true,
                speed: 300,
                autoplay: true,
                cssEase: 'ease-in',
                slidesToShow: 1,
                arrows: false
            })
            $(document).on("scroll", () => {
                let scrolledPx = $(window).scrollTop()
                $(this.$refs.section1).css("background-position-y", `${scrolledPx * 0.5}px`)
            })
        },
        methods: {
            scrollToTop(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        }
    }
</script>

<style>
    body {
        background: #171D41;
    }
</style>

