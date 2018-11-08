<template lang="pug">
    <div id="app">
        Toast
        FullLoad
        router-view
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {

        }
    },
    mounted() {
        if ('addEventListener' in document) { // 移动端修复点击延迟
            document.addEventListener('load', function() {
                FastClick.attach(document.body)
            }, false)
        }
    }
};
</script>
