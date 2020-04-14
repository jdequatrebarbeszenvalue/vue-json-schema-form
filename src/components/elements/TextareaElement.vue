<template>
  <b-field :label="schema.title" :message="schema.description">
    <b-form-textarea :minlength="schema.minLength" :maxlength="schema.maxLength" :value="value" 
    @input="$emit('input', $event)">
    </b-form-textarea>
  </b-field>
</template>

<script>
export default {
  name: 'TextareaElement',
  props: [
    'schema',
    'value'
  ],
}
</script>
