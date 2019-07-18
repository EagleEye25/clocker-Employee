<template>
  <div>
    <md-button class="md-icon-button md-dense topLeft" v-if="standard !== false" @click="help">
      <md-tooltip md-direction="left">Click Me For Help</md-tooltip>
      <md-icon>help_outline</md-icon>
    </md-button>
    <br>
    <!-- Form for entering information -->
    <form novalidate class="md-layout" @submit.prevent="validateCard">
      <!-- Display inputs on card -->
      <md-card class="md-layout-item md-size-30 md-small-size-100 center box">
        <!-- Header for card -->
        <md-card-header>
          <div  id="addCardS" class="md-title" v-if="standard !== false ">{{ titelStandard }}</div>
          <div class="md-title" v-if="standard === false ">{{ titelProcess }}</div>
        </md-card-header>
        <md-divider></md-divider>
        <!-- Content to be displayed on cards -->
        <md-card-content>
          <div class="md-layout md-gutter" >
            <!-- tag -->
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('tag')" >
                <label>* Scan card / Enter card number</label>
                <md-input class="tag" v-model="form.tag" :disabled="processing" autofocus=true />
                <span class="md-error" v-if="!$v.form.tag.required">The card number is required</span>
                <span class="md-error" v-else-if="!$v.form.tag.minlength">Invalid card number</span>
              </md-field>
            </div>
            <!-- Assign to employee
            <div class="md-layout-item md-small-size-100" v-show="standard !== false">
              <md-checkbox name="assign" id="assign" v-model="form.assign" :disabled="processing" autofocus=true>
                Assign card to employee
              </md-checkbox>
            </div> -->
          </div>
        </md-card-content>
        <div v-if="standard !== false">
          <md-divider></md-divider>
          <md-card-actions >
            <md-button id="cancel" style="color: orange" v-on:click="clearForm">
              <md-icon>cancel</md-icon>
              Cancel
            </md-button>
            <md-button id="add" style="color: lime" type="submit">
              <md-icon>done</md-icon>
              Add Card
            </md-button>
          </md-card-actions>
        </div>
        <!-- Part of assign card process -->
        <div v-if="standard === false">
          <p v-if="cardExists" style="color: red"> Card already exits...<br> Please create a new card </p>
          <md-divider></md-divider>
          <md-card-actions>
            <md-button style="color: orange" type="submit">
              <md-icon>done</md-icon>
              Validate Card
            </md-button>
          </md-card-actions>
        </div>
        <v-tour name="addCard" :steps="steps"></v-tour>
      </md-card>
    </form>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import {
    required,
    minLength,
  } from 'vuelidate/lib/validators';
  import http from '../../public/app.service.ts';
  import selectCardForEmployee from './assign-card-process/select-CardForEmployee.vue';

  export default {
    name: 'add-Card',
    mixins: [validationMixin],
    // Angular equivaent of INPUT
    props: {
      standard: true
    },
    //  Variables
    data() {
      return {
        steps: [
          {
            target: '#addCardS',
            content: `This is where all cards that are going to be used to clock in and out will be created.`,
            params: {
              placement: 'left'
            }
          },
          {
            target: '.tag',
            content: `Simply scan / enter the RFID card at hand`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#cancel',
            content: `If you decide that you dont want to create the card, simply click here to cancel the process`,
            params: {
              placement: 'bottom'
            }
          },
          {
            target: '#add',
            content: `Once the information is entered, simply click here and your card will be created!`,
            params: {
              placement: 'bottom'
            }
          },
        ],
        form: {
          tag: '',
        },
        processing: null,
        showCreated: false,
        cardExists: false,
        titelStandard: 'Add Card To Clocker',
        titelProcess: 'Add Card To Be Assigned To Employee',
      }
    },
    validations: {
      form: {
        tag: {
          required,
          minLength: minLength(3)
        },
      },
    },

    components: {
      selectCardForEmployee,
    },

    methods: {

      help() {
        this.$tours['addCard'].start();
      },

      onEnter() {
        this.addCard();
      },

      getValidationClass(fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },

      async addCard() {
        if (await this.checkCardExists()) {
          http.post(`/api/card/create`, {
            'card_no': this.form.tag
          }).then(() => {
            this.$store.dispatch('updateCardNo', this.form.tag);
            this.clearForm();
            this.$awn.success('Successfully Added Card');
          }).catch(() => {
            this.$awn.alert('Could Not Add Card');
          });
        } else {
          this.$awn.warning('Card Already Exists');
          this.form.tag = '';
          this.cardExists = true;
        }
      },

      clearForm() {
        this.$v.$reset();
        this.form.tag = '';
      },

       async checkCardExists() {
        return await http.get(`/api/card/card_no/${this.form.tag}`)
          .then(() => {return false})
          .catch(() => {return true});
      },

      validateCard() {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.addCard();
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .md-checkbox {
    padding-top: 10px;
    display: flex;
  }


  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }

  .box {
    -webkit-border-radius: 6px;
    border-radius: 6px;
  }

  .topLeft {
    position: absolute;
    right:    0;
    top: 100;
  }
</style>
