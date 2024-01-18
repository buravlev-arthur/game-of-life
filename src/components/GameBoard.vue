<template>
<div class="field_container">
  <div class="field">
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

const props = withDefaults(defineProps<GameBoardProps>(), {
  size: 10,
  editMode: true,
})

const cellSize = '20px';
const cells = ref<boolean[][]>([]);
const previousCellsState = ref<boolean[][]>([]);;

// если изменился размер поля - перегенерируем его
watch(() => props.size, () => {
  initField();
});

// если отключили режим расстановки живых клеток (нажали кнопку "Начать") - начинаем игру
watch(() => props.editMode, (newVal) => {
  if (!newVal) {
    setInterval(updateGameState, 200);
  }
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

// меняем состояние клетки при клике на неё
const changeCell = (row: number, cell: number): void => {
  if (!props.editMode) {
    return;
  }
  cells.value[row][cell] = !cells.value[row][cell];
}

// получаем индексы соседних рядов и колонок с учётом границ игровой сетки
const getNearbyIndexes = (item: number): [number, number] => {
    const { size } = props;
    const upperOrLeft = (item - 1) < 0 ? (size - 1) : (item - 1);
    const lowerOrRight = (item + 1) > (size - 1) ? 0 : (item + 1);
    return [upperOrLeft, lowerOrRight];
}

// получаем количество живых соседних клеток
const getAliveSiblingsCount = (row: number, column: number): number => {
  let aliveCellsCount = 0;
  
  const [upperRowIndex, lowerRowIndex] = getNearbyIndexes(row);
  const [leftColumnIndex, rightColumnIndex] = getNearbyIndexes(column);


  if (previousCellsState.value[upperRowIndex][leftColumnIndex]) {
    aliveCellsCount += 1;
  }
  if (previousCellsState.value[upperRowIndex][column]) {
    aliveCellsCount += 1;
  }
  if (previousCellsState.value[upperRowIndex][rightColumnIndex]) {
    aliveCellsCount += 1;
  }
  if (previousCellsState.value[row][leftColumnIndex]) {
    aliveCellsCount += 1;
  }
  if (previousCellsState.value[row][rightColumnIndex]) {
    aliveCellsCount += 1;
  }
  if (previousCellsState.value[lowerRowIndex][leftColumnIndex]) {
    aliveCellsCount += 1;
  }
  if (previousCellsState.value[lowerRowIndex][column]) {
    aliveCellsCount += 1;
  }
  if (previousCellsState.value[lowerRowIndex][rightColumnIndex]) {
    aliveCellsCount += 1;
  }

  return aliveCellsCount;
}

const updateGameState = (): void => {
  previousCellsState.value = JSON.parse(JSON.stringify(cells.value));

  previousCellsState.value.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const aliveSiblings = getAliveSiblingsCount(rowIndex, cellIndex);
      // если это мёртвая клетка и рядом есть три живые - в ней зараждается жизнь
      if (aliveSiblings === 3 && !cell) {
        cells.value[rowIndex][cellIndex] = true;
      }
      // клетка умирает от перенаселенности или одиночества
      if ((aliveSiblings < 2 || aliveSiblings > 3) && cell) {
        cells.value[rowIndex][cellIndex] = false;
      }
    });
  });
}

onMounted((): void => {
  initField();
})
</script>

<style scoped>
.field_container {
  display: flex;
  justify-content: center;
}
.field {
  border-top: var(--grid-border);
  border-left: var(--grid-border);
}

.field__row {
  display: flex;
  width: 100%;
  height: v-bind(cellSize);
  border-bottom: var(--grid-border);
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
  width: 50%;
  height: 50%;
  border-radius: 100%;
  background: var(--base-color);
}
</style>
