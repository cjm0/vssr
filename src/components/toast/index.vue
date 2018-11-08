<template lang="pug">
.v-toast(v-show="text")
    .v-toast-mask(v-show="option.mask" @click="option.maskClose && hide()")
    .v-toast-box(@click="hide") {{text}}
</template>

<script>
/*
    this.$store.state.Toast.show = 'text'
    this.$store.state.Toast.show = ['text', {mask: true, time: 4000}]
    this.$store.state.Toast.hide = true
*/
import {mapState} from 'vuex'
let option = {
    mask: false,
    maskClose: true,
    time: 3000
}
export default {
    name: 'Toast',
    data() {
        return {
            timer: null,
            text: '',
            option: Object.assign({}, option)
        }
    },
    computed: mapState(['Toast']),
    watch: {
        Toast: {handler: 'toggle', deep: true}
    },
    created() {
        this.toggle()
    },
    methods: {
        toggle() {
            const _show = this.Toast.show
            if (_show) {
                if (typeof _show === 'string') {
                    this.show(_show)
                }
                if (Object.prototype.toString.call(_show) === '[object Array]') {
                    this.show(_show[0] || '', _show[1] || '')
                }
            }
            if (this.Toast.hide) {
                this.hide()
            }
        },
        hide() {
            this.text = ''
            clearTimeout(this.timer)
        },
        show(text, op) {
            this.hide()
            if (op) {
                this.option = Object.assign(option, op)
            } else {
                this.option = Object.assign({}, option)
            }
            this.timer = setTimeout(() => {
                this.text = ''
            }, this.option.time)
            this.text = text
        }
    }
}
</script>