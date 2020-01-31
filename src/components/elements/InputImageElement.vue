<template>
  <b-field class="file" :label="schema.title">
      <b-upload v-model="file" @input="onLoad" accept="image/png, image/jpeg, image/gif, image/jpg">
        <img :src="preview || value">
        <b-field v-if="file" :message="file.name"></b-field>
        <a class="button">
          <span> Click to upload </span>
        </a>
      </b-upload>
  </b-field>
</template>

<script>

export default {
  name: 'InputImageElement',
  props: [
    'schema',
    'value'
  ], 
  data(){
    return{
      file: null,
      preview: "",
      maxSize: 2,
    }
  },
  methods:{
    onLoad(evt){ 
      if ( evt.size/ Math.pow(1000, 2) > this.maxSize ){
           this.file    = null; 
           this.preview = null;
           return false
      }

      let reader = new FileReader()
          reader.readAsDataURL(this.file)
          reader.onload  = evt => {
            this.preview = reader.result
            this.$emit('input', reader.result )      
          }    
    }, 
  }, 
}            

</script>

<style scoped>
  .field{
    display:block;
  }
</style>
