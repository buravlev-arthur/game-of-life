<template>
  <div class="head">
    <div class="head__title">Игра "Жизнь"</div>
    <div class="selector">
      <label class="selector__label" for="grid-size">Размер поля</label>
      <input
        class="selector__input"
        name="grid-size"
        type="number"
        min="1"
        :disabled="!changeAvailable"
        v-model="fieldSize"
      />
    </div>
    <div class="selector">
      <label class="selector__label" for="generation-speed">Скорость генерации (cек)</label>
      <input
        class="selector__input"
        name="generation-speed"
        type="number"
        min="0"
        :disabled="!changeAvailable"
        v-model="speed"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { speedDefault, sizeDefault } from '@/consts';
import type { AppHeadProps } from '@/types';

defineProps<AppHeadProps>();

const fieldSize = ref<number>(sizeDefault);
const speed = ref<number>(speedDefault);

const emit = defineEmits<{
  'change-field-size': [size: number]
  'change-generation-speed': [speed: number]
}>()

watch(fieldSize, (newSize) => {
    emit('change-field-size', newSize);
});

watch (speed, (newSpeed) => {
  emit('change-generation-speed', newSpeed);
})
</script>

<style scoped>
.head {
  display: flex;
  gap: 30px;
  align-items: center;
  padding-top: 30px;
}

.head__title {
  font-weight: bold;
}

.selector {
  display: flex;
  gap: 10px;
  align-items: center;
}

.selector__input {
  width: 40px;
}

.selector__label::after {
  content: ':'
}
</style>