<template>
  <b-field class="file" :label="schema.title">
      <b-upload v-model="file" @input="onLoad" accept="application/json">
        <b-field v-if="file" :message="file.name"></b-field>
        <a class="button">
          <span> Click to upload </span>
        </a>
      </b-upload>
  </b-field>
</template>

<script>

export default {
  name: 'InputJsonFile',
  props: [
    'schema',
    'value'
  ], 
  data(){
    return{
      file: null,
      //preview: "",
    }
  },
  methods:{
    onLoad( /*evt*/ ){
      let reader = new FileReader()
      reader.readAsText( this.file )
      reader.onload  = ( /*evt*/ ) => {
        //this.preview = reader.result;
        this.$emit('input', reader.result );
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
