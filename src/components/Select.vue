<script setup lang="ts">
    import { watch } from 'vue'
    import type { Branch, DefaultSelectItem } from '@/components/layout/provider/LayoutDataProvider.vue'

    export interface SelectProps {
        modelValue?: Branch | DefaultSelectItem
        items: Branch[]
    } 
    
    const emits = defineEmits<{
        (e: 'change')
    }>()
    const props = defineProps<SelectProps>()
    const model = defineModel<Branch | DefaultSelectItem>()
    const name = defineModel<string>('name')
    const defaultItem = { name: '-- 브랜치를 선택하세요. --', val: '' }

    // name값을 model.name에서 추적하도록 watch 설정
    watch(() => (model.value as Branch)?.name, // model의 name 값이 변하면
        (newVal) => {
            name.value = newVal ?? ''
        },
        { immediate: true }
    )

    function onChange(payload: Event) {
        emits('change')
    }
</script>
<template>
    <div class="flex">
        <select v-model="model" class="grow p-[3px]" @change="onChange">
            <option :value="defaultItem">
                {{ defaultItem.name }}
            </option>
            <template v-for="item in props.items">
                <option :value="item">
                    {{ item.name }}
                </option>
            </template>
        </select>
    </div>
</template>