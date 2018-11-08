<style lang="less" module>
    .list p{
        color: red;
        display: flex;
        box-sizing: border-box;
    }
</style>

<template lang="pug">
    div(:class="$style.list")
        p this is ajax 1
        p {{user}}
        p this is ajax 2
        div {{koa2}}
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'list',
    data() {
        return {}
    },
    /*asyncData ({store, cookies}) {
        return store.dispatch('getUser', {
            cookies,
            url: '/xw/User/index',
            data: {
                token: 'ab3f9512299e8e437ecd56b0362e1092'
            }
        })
    },*/
    title() {
        return {
            title: 'cjm',
            keywords: 'dddddd',
            description: 'testtsetttettttt'
        }
    },
    computed: {
        ...mapState(['user', 'koa2'])
    },
    mounted() {
       
    }
};
</script>