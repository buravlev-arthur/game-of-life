import { ref, computed } from 'vue';
import type { Ref } from 'vue';

export function useGameProcess(currentGeneration: Ref<boolean[][]>, generationSpeed: Ref<number>, fieldSize: Ref<number>) {
    const gameLoopInterval = ref<ReturnType<typeof setInterval> | null>(null);
    // предыдущее состояние вселенной
    const previousGeneration = ref<boolean[][]>([]);

    // скорость генерации в миллисекундах
    const generationSpeedMs = computed<number>(() => {
        return generationSpeed.value * 1000;
    });

    // начинаем (или продолжаем) генерацию
    const startGeneration = () => {
        gameLoopInterval.value = setInterval(setNextGeneration, generationSpeedMs.value);
    }

    // останавливаем генерацию
    const stopGeneration = () => {
        if (gameLoopInterval.value) {
            clearInterval(gameLoopInterval.value);
        }
    }

    // получаем индексы соседних рядов и колонок с учётом границ игровой сетки
    const getNearbyIndexes = (item: number): [number, number] => {
        const upperOrLeft = (item - 1) < 0 ? (fieldSize.value - 1) : (item - 1);
        const lowerOrRight = (item + 1) > (fieldSize.value - 1) ? 0 : (item + 1);
        return [upperOrLeft, lowerOrRight];
    }

    // получаем количество живых соседних клеток
    const getAliveSiblingsCount = (row: number, column: number): number => {
        let aliveCellsCount = 0;
        
        const [upperRowIndex, lowerRowIndex] = getNearbyIndexes(row);
        const [leftColumnIndex, rightColumnIndex] = getNearbyIndexes(column);
    
    
        if (previousGeneration.value[upperRowIndex][leftColumnIndex]) {
        aliveCellsCount += 1;
        }
        if (previousGeneration.value[upperRowIndex][column]) {
        aliveCellsCount += 1;
        }
        if (previousGeneration.value[upperRowIndex][rightColumnIndex]) {
        aliveCellsCount += 1;
        }
        if (previousGeneration.value[row][leftColumnIndex]) {
        aliveCellsCount += 1;
        }
        if (previousGeneration.value[row][rightColumnIndex]) {
        aliveCellsCount += 1;
        }
        if (previousGeneration.value[lowerRowIndex][leftColumnIndex]) {
        aliveCellsCount += 1;
        }
        if (previousGeneration.value[lowerRowIndex][column]) {
        aliveCellsCount += 1;
        }
        if (previousGeneration.value[lowerRowIndex][rightColumnIndex]) {
        aliveCellsCount += 1;
        }
    
        return aliveCellsCount;
    }

    // генерируем следующее поколение во вселенной
    const setNextGeneration = (): void => {
        previousGeneration.value = JSON.parse(JSON.stringify(currentGeneration.value));
      
        previousGeneration.value.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            const aliveSiblings = getAliveSiblingsCount(rowIndex, cellIndex);
            // если это мёртвая клетка и рядом есть три живые - в ней зараждается жизнь
            if (aliveSiblings === 3 && !cell) {
                currentGeneration.value[rowIndex][cellIndex] = true;
            }
            // клетка умирает от перенаселенности или одиночества
            if ((aliveSiblings < 2 || aliveSiblings > 3) && cell) {
                currentGeneration.value[rowIndex][cellIndex] = false;
            }
          });
        });
    }

    return {
        startGeneration,
        stopGeneration
    };
}
