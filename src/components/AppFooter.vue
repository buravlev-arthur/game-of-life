<template>
<div class="footer">
    <button
      v-show="isEditMode"
      class="button"
      @click="toStart"
    >
      Начать генерацию
    </button>

    <button
      v-show="!isEditMode"
      class="button"
      @click="toStop"
    >
      Остановить генерацию
    </button>
</div>
</template>

<script lang="ts" setup>
import type { AppFooterProps } from '@/types';

defineProps<AppFooterProps>()

const emit = defineEmits<{
  'start-generation': []
  'stop-generation': []
}>()

const toStart = (): void => {
  emit('start-generation');
}

const toStop = (): void => {
  emit('stop-generation');
}
</script>

<style scoped>
.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 30px;
}
</style>