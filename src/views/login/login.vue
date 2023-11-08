<template>
  <div>hhhh</div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();

userStore.jumpToLogin();
</script>
