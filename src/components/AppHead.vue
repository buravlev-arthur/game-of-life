<template>
  <div class="head">
    <div class="head__title">Игра "Жизнь"</div>
    <div class="size-selector">
      <label class="size-selector__label" for="grid-size">Размер поля</label>
      <input
        class="size-selector__input"
        name="grid-size"
        type="number"
        :disabled="!changeAvailable"
        v-model="fieldSize"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { AppHeadProps } from '@/types';

withDefaults(defineProps<AppHeadProps>(), {
  changeAvailable: true
})

const fieldSize = ref<number>(10);

const emit = defineEmits<{
  'change-field-size': [size: number]
}>()

watch(fieldSize, (newSize) => {
    emit('change-field-size', newSize);
});
</script>

<style scoped>
.head {
  display: flex;
  gap: 30px;
  align-items: center;
  padding-top: 20px;
}

.head__title {
  font-weight: bold;
}

.size-selector {
  display: flex;
  gap: 10px;
  align-items: center;
}

.size-selector__input {
  width: 40px;
}

.size-selector__label::after {
  content: ':'
}
</style>