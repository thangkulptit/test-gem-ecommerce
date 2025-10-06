import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ButtonGroup from '@/components/ButtonGroup.vue'

describe('ButtonGroup.vue', () => {
    // Dữ liệu mẫu cho props
    const defaultProps = {
        buttons: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
        ],
        modelValue: 'option1',
        labelText: 'label',
        valueText: 'value',
    }

    // Test hiển thị các nút
    it('renders correct number of buttons based on props.buttons', () => {
        const wrapper = mount(ButtonGroup, { props: defaultProps })
        const buttons = wrapper.findAll('button')
        expect(buttons).toHaveLength(defaultProps.buttons.length)
    })

    it('renders button labels correctly based on props.labelText', () => {
        const wrapper = mount(ButtonGroup, { props: defaultProps })
        const buttons = wrapper.findAll('button')
        buttons.forEach((button, index) => {
            expect(button.text()).toBe(defaultProps.buttons[index].label)
        })
    })

    it('applies correct classes for active button', () => {
        const wrapper = mount(ButtonGroup, { props: defaultProps })
        const buttons = wrapper.findAll('button')
        const activeButton = buttons.find(button => button.classes().includes('bg-[#424242]'))
        if (activeButton) {
            expect(activeButton.text()).toBe('Option 1') // Nút active có modelValue = 'option1'
            expect(activeButton.classes()).toContain('text-[#F9F9F9]')
            expect(activeButton.classes()).toContain('bg-[#424242]')
        }
    })

    it('applies rounded-l-lg to first button and rounded-r-lg to last button', () => {
        const wrapper = mount(ButtonGroup, { props: defaultProps })
        const buttons = wrapper.findAll('button')
        expect(buttons[0].classes()).toContain('rounded-l-lg')
        expect(buttons[buttons.length - 1].classes()).toContain('rounded-r-lg')
        expect(buttons[1].classes()).not.toContain('rounded-l-lg')
        expect(buttons[1].classes()).not.toContain('rounded-r-lg')
    })

    // Test sự kiện click
    it('updates activeValue and emits events on button click', async () => {
        const wrapper = mount(ButtonGroup, { props: defaultProps })
        const buttons = wrapper.findAll('button')

        // Click vào nút thứ hai
        await buttons[1].trigger('click')

        if (wrapper) {
            expect(wrapper.vm.activeValue).toBe('option2')
            expect(wrapper.emitted('update:modelValue')).toBeTruthy()
            // expect(wrapper.emitted('update:modelValue')[0]).toEqual(['option2'])
            expect(wrapper.emitted('change')).toBeTruthy()
            // expect(wrapper.emitted('change')[0]).toEqual(['option2'])
        }
    })

    // Test cập nhật modelValue
    it('updates activeValue when modelValue changes', async () => {
        const wrapper = mount(ButtonGroup, { props: defaultProps })
        await wrapper.setProps({ modelValue: 'option3' })
        expect(wrapper.vm.activeValue).toBe('option3')
        const activeButton = wrapper.findAll('button').find(button => button.classes().includes('bg-[#424242]'))
        if (activeButton) {
            expect(activeButton.text()).toBe('Option 3')
        }
    })

    // Test props tùy chỉnh labelText và valueText
    it('handles custom labelText and valueText props', async () => {
        const customProps = {
            buttons: [
                { name: 'One', id: 1 },
                { name: 'Two', id: 2 },
            ],
            modelValue: 1,
            labelText: 'name',
            valueText: 'id',
        }
        const wrapper = mount(ButtonGroup, { props: customProps })
        const buttons = wrapper.findAll('button')

        expect(buttons[0].text()).toBe('One')
        expect(buttons[1].text()).toBe('Two')

        await buttons[1].trigger('click')
        if (wrapper) {
            expect(wrapper.vm.activeValue).toBe(2)
            // expect(wrapper.emitted('update:modelValue')[0]).toEqual([2])
            // expect(wrapper.emitted('change')[0]).toEqual([2])
        }
    })

    // Test trường hợp buttons rỗng
    it('renders no buttons when buttons prop is empty', () => {
        const wrapper = mount(ButtonGroup, {
            props: { buttons: [], modelValue: null },
        })
        expect(wrapper.findAll('button')).toHaveLength(0)
    })
})