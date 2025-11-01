<script setup>
import { RouterView} from 'vue-router'
import Header from './components/Header.vue'
import SideNavbar from './components/SideNavbar.vue'
</script>

<template>
    <Header />
    <div class="flex">
        <SideNavbar />
        <div class="flex-1 mt-6 ms-4">
            <RouterView />
        </div>
    </div>
</template>

<style>
.body {
    padding: 0px;
}
</style>