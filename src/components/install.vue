<template>
  <div>
    <br>
    <h1 style="color:white"> Settings </h1>
    <br>
    <div>
      <md-steppers :md-active-step.sync="active" md-vertical md-linear>
        <md-step id="first" md-label="Select Application Type" :md-editable="editable" :md-done.sync="first">
            <md-radio v-model="radio" value="clocking">Clocking</md-radio>
            <md-radio v-model="radio" value="management">Management</md-radio>
            <br>
          <md-button class="md-raised md-primary" :disabled="!radio" @click="setDone('first', 'second')">Continue</md-button>
        </md-step>

        <md-step id="second" md-label="Select Server Address" :md-editable="editable" :md-done.sync="second">
          <md-field class="center" style="max-width:40%">
            <label for="serverAddy">Server Address</label>
            <md-input class="serverAddy" v-model="serverAddy"/>
          </md-field>
          <md-button class="md-raised md-primary" :disabled="!serverAddy" @click="setDone('second', 'third')">Continue</md-button>
        </md-step>

        <md-step id="third" md-label="Complete" :md-editable="editable" :md-done.sync="third">
          <md-list>
            <md-list-item class="center">
              <md-icon>settings_applications</md-icon>
              <span class="md-list-item-text">Application Type:
                <br>
                <div style="margin-left:2em">
                  <span>{{ radio }}</span>
                </div>
              </span>
            </md-list-item>
            <br>
            <md-divider class="md-inset"></md-divider>
            <br>
            <md-list-item class="center">
              <md-icon>language</md-icon>
              <span class="md-list-item-text">Server URL:
                <br>
                <div style="margin-left:2em">
                  <span>{{ serverAddy }}</span>
                </div>
              </span>
            </md-list-item>
          </md-list>
          <md-button class="md-raised md-primary" @click="setDone('third')">Done</md-button>
        </md-step>
      </md-steppers>
    </div>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import {
    required,
  } from 'vuelidate/lib/validators'

  export default {
    name: 'install',
    mixins: [validationMixin],
    // Angular equivaent of INPUT
    props: {
    },
    //  Variables
    data() {
      return {
        active: 'first',
        first: false,
        second: false,
        third: false,
        editable: true,
        radio: null,
        serverAddy: null,
      }
    },

    methods: {
      setDone (id, index) {
        this[id] = true

        if (index) {
          this.active = index
        }
      },

      clearForm() {
        this.serverAddy = null
        this.radio = null;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style style="scss" scoped>

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    /* width: 50%; */
  }

</style>