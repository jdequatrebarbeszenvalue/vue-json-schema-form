<template>
  <b-field :label="schema.title" :message="schema.description">
    <!--b-form-textarea :minlength="schema.minLength" :maxlength="schema.maxLength" :value="value" 
    @input="$emit('input', $event)">
    </b-form-textarea-->
    <!--ckeditor :editor="editor" v-model="editorValue" :config="editorConfig"></ckeditor-->
    <Editor
       v-model="editorValue"
       :init="{
         height: 500,
         menubar: false,
         plugins: [
           'advlist autolink lists link image charmap print preview anchor',
           'searchreplace visualblocks code fullscreen',
           'insertdatetime media table paste code help wordcount'
         ],
         toolbar:
           'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
       }"
     />
  </b-field>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'RichTextElement',
  props: [
    'schema',
    'value'
  ],
  components: { 
    Editor
  },
  data(){
    return{
      editorValue: this.value,
    }
  },
  watch:{
    editorValue( $event ){
      this.$emit( 'input', $event );
    }
  }
}
</script>
<style>
  .tox-tinymce-aux {display: none !important;}
</style>