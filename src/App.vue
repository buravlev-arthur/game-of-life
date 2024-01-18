<template>
  <div class="app-container">
    <AppHead
      :change-available="isEditMode"
      @change-field-size="changeSize"
    />
    <GameBoard
      :size="fieldSize"
      :edit-mode="isEditMode"
    />
    <button
      v-show="isEditMode"
      class="start-button"
      @click="toStart"
    >
      Начать
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHead from './components/AppHead.vue';
import GameBoard from './components/GameBoard.vue';

const fieldSize = ref<number>(10);
const isEditMode = ref<boolean>(true);

const changeSize = (size: number): void => {
  fieldSize.value = size;
}

const toStart = (): void => {
  isEditMode.value = false;
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}
</style>
