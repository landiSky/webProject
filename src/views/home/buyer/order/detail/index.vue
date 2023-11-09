<template>
  <DetailsModalFullscreen v-if="FullscreenDetailsModal" :order-id="orderId">
  </DetailsModalFullscreen>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DetailsModalFullscreen from '../components/details-modal-fullscreen.vue';

const router = useRouter();
const route = useRoute();

const FullscreenDetailsModal = ref(true);

const orderId = route.params.id as string;
</script>

<style lang="less"></style>
