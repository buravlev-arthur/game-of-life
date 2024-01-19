<template>
  <div class="app">
    <AppHead
      :change-available="isEditMode"
      @change-field-size="changeSize"
      @change-generation-speed="changeSpeed"
    />
    <GameBoard
      :size="fieldSize"
      :edit-mode="isEditMode"
      @updated-cells="updateCells"
    />
    <AppFooter
      :is-edit-mode="isEditMode"
      @start-generation="toStart"
      @stop-generation="toStop"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { speedDefault, sizeDefault } from '@/consts';
import { useGameProcess } from './composables/gameProcess';
import AppHead from './components/AppHead.vue';
import GameBoard from './components/GameBoard.vue';
import AppFooter from './components/AppFooter.vue';

const cells = ref<boolean[][]>([]);
const fieldSize = ref<number>(sizeDefault);
const generationSpeed = ref<number>(speedDefault);
const isEditMode = ref<boolean>(true);

const {
  startGeneration,
  stopGeneration
} = useGameProcess(cells, generationSpeed, fieldSize);

const changeSize = (size: number): void => {
  if (typeof size !== 'number' || size < 1) {
    fieldSize.value = 1;
    return;
  }
  fieldSize.value = size;
}

const changeSpeed = (speed: number): void => {
  if (typeof speed !== 'number' || speed < 0) {
    generationSpeed.value = 0;
    return;
  }
  generationSpeed.value = speed;
}

const updateCells = (updatedCells: boolean[][]): void => {
  cells.value = updatedCells;
}

const toStart = (): void => {
  isEditMode.value = false;
  startGeneration();
}

const toStop = (): void => {
  isEditMode.value = true;
  stopGeneration();
}
</script>

<style scoped>
.app {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 30px;
}
</style>
