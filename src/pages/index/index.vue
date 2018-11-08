<style lang="less">
    .main{
        .bgimg{
            width: 100px;
            height: 100px;
            background: url("../../assets/img/1.jpg") 0 0 no-repeat;
        }
        .img{
            width: 100px;
        }
    }
</style>

<template lang="pug">
    .main
        p this is index
        p this is img 
        img.img(src="../../assets/img/logo.png")
        p this is bg img 
        .bgimg  
        p {{$store.state.user}}
        p {{$store.state.koa2}}
        router-link(to="/list") list
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
            datas: {},
            str: ''
        }
    },
    asyncData ({store, cookies}) {
        return store.dispatch('getUser', {
            cookies,
            url: '/xw/User/index',
            data: {
                token: '483734396ba1aa8b5dfa1ef4f51face1'
            }
        })
        .then(res => {
            return store.dispatch('koa2', {
                url: '/test',
            })
        })
    },
    mounted() {
       // this.axios('/xw/User/index')
       //  .then(res => {
            
       //      this.$store.state.Loading.hide = true
       //  })
       document.title = 'fff'
    }
};
</script>