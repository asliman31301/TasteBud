<template>
    <span>
        <span v-for="n in level" :key="n" class="fas fa-dollar-sign"></span>
    </span>
</template>

<script>
/* eslint-disable */
export default {
    props:["level"]
}
</script>
<style scoped>

</style>