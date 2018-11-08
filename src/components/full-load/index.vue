<template lang="pug">
div
    .v-full-load-mask(v-show="mask")
    Loading.v-full-load(v-show="status" size="40")
</template>
<script>
/*
    store.state.Loading.show = true
    store.state.Loading.show = [3000, true]
    store.state.Loading.hide = true
*/
import {mapState} from 'vuex'
export default {
    name: 'FullLoad',
    data() {
        return {
            timer: null,
            status: false,
            mask: false,
            delay: 2000,
        }
    },
    computed: mapState(['Loading']),
    watch: {
        Loading: {handler: 'toggle', deep: true}
    },
    created() {
        this.toggle()
    },
    methods: {
        toggle() {
            if (this.Loading.show) {
                this.show(this.Loading.show[0] || this.delay, this.Loading.show[1] || false)
            }
            if (this.Loading.hide) {
                this.hide()
            }
        },
        hide() {
            this.status = false
            this.mask = false
            clearTimeout(this.timer)
        },
        show(time, mask) {
            this.hide()
            this.status = true
            this.mask = mask
            if (Number(time)) {
                this.timer = setTimeout(() => {
                    this.hide()
                }, time)
            }
        }
    }
}
</script>