<template>
  <div @click.stop.prevent="focusInput" @touch.stop.prevent="focusInput">
    <img class="center" src="../../public/pictures/lock.png" alt="Lock Image">
    <div v-if="!showNormLogin">
      <!-- Hides input off screen -->
      <!-- <div class="outer"> -->
        <!-- <div class="inner"> -->
          <input v-if="!showNormLogin" v-focus v-model="tag" type="text" @keyup.enter="onEnter" id="cardInput">
        <!-- </div> -->
      <!-- </div> -->
      <h1 style="color:white;">{{ message }}</h1>
      <md-button @click="showNormLogin = true">
        Lost Manager Card
      </md-button>
    </div>
      <div class="md-layout md-gutter center" v-if="showNormLogin">
        <div class="md-layout-item md-size-15 md-small-size-100 center">
          <md-field>
            <label for="empName">Enter Employee Name</label>
            <md-input class="empName" v-model="empName"/>
          </md-field>
        </div>
        <div class="md-layout-item md-size-15 md-small-size-100 center">
          <md-field>
            <label for="pass">Enter Password</label>
            <md-input class="pass" v-model="pass"/>
          </md-field>
        </div>
        <div class="md-layout-item md-size-7 md-small-size-100 center">
          <md-button @click="showNormLogin = false">
            Cancel
          </md-button>
          <md-button to="/management">
            Login
          </md-button>
        </div>
      </div>
    <div>
      <md-dialog-prompt
        :md-active.sync="active"
        v-model="authCard"
        md-title="Authorize"
        md-input-placeholder="Scan Manager Card"
        @md-confirm="onConfirm" />

      <md-button @click="active = true, authCard = null">
        <md-icon>settings</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
  import http from '../../public/app.service.ts'

  export default {
    name: 'clocker',
    // Angular equivaent of INPUT
    props: {
    },
    //  Variables
    data() {
      return {
        tag: '',
        message: 'Please Scan Your Manager Card',
        showNormLogin: false,
        pass: null,
        empName: null,
        active: false,
        authCard: null,
      }
    },

    methods: {
      onConfirm() {
        console.log(this.authCard)
      },

      onEnter() {
        this.login();
      },

      login() {
        console.log(this.tag);
      },

      focusInput() {
        if (!this.showDialogD) {
          const el = document.querySelector('#cardInput');
          if (el) {
            el.focus();
          }
        }
      },
    },

    directives: {
      focus: {
        // directive definition
        inserted: function (el) {
          el.focus()
        }
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  div {
    background-color: rgb(48,48,48);
  }

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    /* width: 50%; */
  }

  .outer {
    overflow: hidden;
    position: relative;
  }

  .inner {
    position: absolute;
    height: 100px;
    width: 100px;
    right: -50px;
    top: 50px;
  }
</style>
