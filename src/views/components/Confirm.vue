<template>
  <div>
    <v-dialog :value.sync="visit" max-width="350">
      <v-card>
        <v-card-title class="text-h5">{{ title }}</v-card-title>
        <v-card-text>{{ text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="cancel">取消</v-btn>
          <v-btn color="primary darken-1" text @click="ok">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    v: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    visit: {
      get() {
        return this.v
      },
      set(v) {
        this.$emit('update:v', v)
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
      this.visit = false
    },
    ok() {
      this.$emit('ok')
      this.visit = false
    }
  }
}
</script>

<style scoped>

</style>
