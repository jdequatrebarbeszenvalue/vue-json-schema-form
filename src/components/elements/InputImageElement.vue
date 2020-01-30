<template>
  <b-field :label="schema.title">
      <vue-base64-file-upload 
        class="v1"
        accept="image/png,image/jpeg,image/gif,image/jpg"
        image-class="v1-image"
        input-class="v1-input"
        :max-size="customImageMaxSize"
        :default-preview="value"
        :value="value"
        @load="onLoad"
      />
  </b-field>
</template>

<script>

import VueBase64FileUpload from 'vue-base64-file-upload';

export default {
  name: 'InputImageElement',
  components: {
    VueBase64FileUpload,
  }, 
  props: [
    'schema',
    'value'
  ], 
  data(){
    return{
      customImageMaxSize: 2
    }
  },
  methods:{
    onLoad(dataUri) {
      this.$emit( 'input', dataUri );
    },
  }
}
</script>
