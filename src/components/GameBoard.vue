<template>
<div class="field" ref="fieldContainer">
  <div class="field__inner">
    <div
      v-for="(cellsRow, rowIndex) in cells"
      :key="`key_${rowIndex}`"
      class="field__row"
    >
      <div
        v-for="(cellValue, cellIndex) in cellsRow"
        :key="`key_${rowIndex}_${cellIndex}`"
        :class="`field__cell field__cell_${cellValue ? 'alive' : 'dead' }`"
        @click="changeCell(rowIndex, cellIndex)"
      >
        <div v-show="cellValue" class="field__dot"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { GameBoardProps } from '@/types/index.ts';

const props = defineProps<GameBoardProps>();

const emit = defineEmits<{
  'updated-cells': [cells: boolean[][]]
}>()

const cellSize = ref<string>('0px');
const fieldContainer = ref<HTMLDivElement | null>(null);
const cells = ref<boolean[][]>([]);

// если изменился размер поля - перегенерируем его и изменим размер ячеек
watch(() => props.size, () => {
  initField();
  emit('updated-cells', cells.value);
  setCellSize();
});

// генерация пустого поля
const initField = (): void => {
  cells.value = [];
  for (let i = 0; i < props.size; i += 1) {
    cells.value[i] = [];
    for (let j = 0; j < props.size; j += 1) {
      cells.value[i][j] = false;
    }
  }
}

// устанавливаем размер ячеек
const setCellSize = (): void => {
  if (!fieldContainer.value) {
    cellSize.value = '0px';
    return;
  }
  const containerHeight = fieldContainer.value.clientHeight;
  const cellsCount = props.size;
  cellSize.value = String(containerHeight / cellsCount) + 'px';
};

// меняем состояние клетки при клике на неё
const changeCell = (row: number, cell: number): void => {
  if (!props.editMode) {
    return;
  }
  cells.value[row][cell] = !cells.value[row][cell];
  emit('updated-cells', cells.value);
}

onMounted((): void => {
  initField();
  setCellSize();
  window.addEventListener('resize', setCellSize);
})
</script>

<style scoped>
.field {
  display: flex;
  flex: auto;
  height: 600px;
}
.field__inner {
  border-top: var(--grid-border);
  border-left: var(--grid-border);
}

.field__row {
  display: flex;
  width: 100%;
  height: v-bind(cellSize);
  border-bottom: var(--grid-border);
  box-sizing: border-box;
}

.field__cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: v-bind(cellSize);
  height: 100%;
  border-right: var(--grid-border);
}

.field__dot {
  width: 100%;
  height: 100%;
  background: var(--base-color);
}
</style>
@/composables/gameProcess