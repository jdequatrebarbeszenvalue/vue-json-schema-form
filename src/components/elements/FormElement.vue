<template>
  <component :is="type" :schema='schema' :value='value' @input="$emit('input', $event)" />
</template>

<script>
import FormElementWrapper from '@/components/elements/FormElementWrapper'
import TextElement from '@/components/elements/TextElement'
import TextareaElement from '@/components/elements/TextareaElement'
import RichTextElement from '@/components/elements/RichTextElement'
import NumberElement from '@/components/elements/NumberElement'
import SelectElement from '@/components/elements/SelectElement'
import CheckboxElement from '@/components/elements/CheckboxElement'
import CheckboxGroupElement from '@/components/elements/CheckboxGroupElement'
import RadioButtonElement from '@/components/elements/RadioButtonElement'
import FormElementMultiple from '@/components/elements/FormElementMultiple'
import DatePickerElement from '@/components/elements/DatePickerElement'
import InputImageElement from '@/components/elements/InputImageElement'
import InputJsonFile from '@/components/elements/InputJsonFile'

export default {
  name: 'FormElement',
  props: [
    'schema',
    'value'
  ],
  computed: {
    type() {
      let component = TextElement
      if (this.schema.widget !== undefined) {

        // allow the schema to specify widget
        // currently only textarea is supported
        if (this.schema.widget === 'textarea') {
          component = TextareaElement
        }

        if (this.schema.widget === 'richtext') {
          component = RichTextElement
        }

        // possibility to load an image in base64
        if (this.schema.widget === 'img') {
          component = InputImageElement
        }

        if (this.schema.widget === 'json') {
          component = InputJsonFile
        }

      } else if (this.schema.anyOf !== undefined) {
        component = RadioButtonElement
      } else if (this.schema.enum !== undefined) {
        component = SelectElement
      } else if (this.schema.type === 'boolean') {
        component = CheckboxElement
      } else if (this.schema.type === 'array') {
        component = this.schema.items.anyOf === undefined ? FormElementMultiple : CheckboxGroupElement
      } else if (this.schema.type === 'object') {
        component = FormElementWrapper
      } else if (this.schema.type === 'integer' || this.schema.type === 'number') {
        component = NumberElement
      } else if (this.schema.format === 'date') {
        component = DatePickerElement
      }
      return component
    }
  }
}
</script>
