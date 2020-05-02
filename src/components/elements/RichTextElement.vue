<template>
  <b-field :label="schema.title" :message="schema.description">
    <!--b-form-textarea :minlength="schema.minLength" :maxlength="schema.maxLength" :value="value" 
    @input="$emit('input', $event)">
    </b-form-textarea-->
    <ckeditor :editor="editor" v-model="editorValue" :config="editorConfig"></ckeditor>
  </b-field>
</template>

<script>
import Vue from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
Vue.use( CKEditor );

export default {
  name: 'RichTextElement',
  props: [
    'schema',
    'value'
  ],
  components: {
    ckeditor: CKEditor.component
  },
  data(){
    return{
      editor: ClassicEditor,
      editorValue: this.value,
      editorConfig: {
        // The configuration of the editor.
      }
    }
  },
  watch:{
    editorValue( $event ){
      this.$emit( 'input', $event );
    }
  }
}
</script>
