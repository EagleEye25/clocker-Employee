<template>
  <div>
    <md-button class="md-icon-button md-dense topLeft" v-if="standard !== false" @click="help">
      <md-tooltip md-direction="left">Click Me For Help</md-tooltip>
      <md-icon>help_outline</md-icon>
    </md-button>
    <br>
    <!-- Form for entering information -->
    <form novalidate class="md-layout" @submit.prevent="validateReason">
      <!-- Display inputs on card -->
      <md-card class="md-layout-item md-size-50 md-small-size-100 center box" id="startRT">
        <!-- Header for card -->
        <md-card-header>
          <div class="md-title">Add Reason For Clocking Out</div>
        </md-card-header>
        <md-divider></md-divider>
        <!-- Content to be displayed on cards -->
        <md-card-content>
          <div class="md-layout md-gutter" >
            <!-- Description -->
            <div class="md-layout-item md-small-size-100" style="padding-left: 15%;">
              <md-field class="desc" :class="getValidationClass('description')" >
                <label for="description">* Description of Reason</label>
                <md-input v-model="form.description" :disabled="processing" autofocus=true />
                <span class="md-error" v-if="!$v.form.description.required">The description is required</span>
                <span class="md-error" v-else-if="!$v.form.description.minlength">Invalid description</span>
              </md-field>
            </div>
            <!-- Work -->
            <div id="work" class="md-layout-item md-small-size-100">
              <md-checkbox v-model="form.work">
                Work related
              </md-checkbox>
            </div>
            <div id="active" style="padding-right: 13%" class="md-layout-item md-small-size-100">
              <md-checkbox v-model="form.active">
                Activate
              </md-checkbox>
            </div>
          </div>
        </md-card-content>
        <md-divider></md-divider>
        <md-card-actions>
          <!-- Normal add -->
          <div v-if="!reasonData">
            <md-button id="cancel" style="color: orange" @click="clearForm">
              <md-icon>cancel</md-icon>
              Cancel
            </md-button>
            <md-button id="add" style="color: lime" type="submit">
              <md-icon>done</md-icon>
              Add Reason
            </md-button>
          </div>
          <!-- Update Reason -->
          <div v-if="reasonData">
            <md-button style="color: orange" to="/management/viewReasons" @click="clearForm">
              <md-icon>cancel</md-icon>
              Cancel
            </md-button>
            <md-button style="color: lime" type="submit">
              <md-icon>update</md-icon>
              Update Reason
            </md-button>
          </div>
        </md-card-actions>
        <v-tour name="addReason" :steps="steps"></v-tour>
      </md-card>
    </form>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import {
    required,
    minLength
  } from 'vuelidate/lib/validators';
  import http from '../../public/app.service.ts'

  export default {
    name: 'add-Reason',
    mixins: [validationMixin],
    // Angular equivaent of INPUT
    props: {
      standard: false,
    },
    //  Variables
    data() {
      return {
        steps: [
          {
            target: '#startRT',
            content: `This is where all reasons that are going to be used to clock out will be created.`,
            params: {
              placement: 'left'
            }
          },
          {
            target: '.desc',
            content: `Firstly enter the description of the reason i.e. 'Smoke Break'`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#work',
            content: `By checking this field it will mark the reason as work related, when employees clock out`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#active',
            content: `By selecting this field will set the reason as active, and will be available for use on the clocking aplication`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#cancel',
            content: `If you decide that you dont want to create the reason, simply click here to cancel the process`,
            params: {
              placement: 'bottom'
            }
          },
          {
            target: '#add',
            content: `Once the information is entered, simply click here and the reason will be created!`,
            params: {
              placement: 'bottom'
            }
          },
        ],
        form: {
          description: null,
          work: false,
          active: false,
        },
        processing: null,
        reasonID: null,
      }
    },
    validations: {
      form: {
        description: {
          required,
          minLength: minLength(4)
        }
      },
    },

    methods: {
      help() {
        this.$tours['addReason'].start();
      },

      fillInputs() {
        if (this.reasonData) {

          this.reasonData.work === 'yes' ? this.reasonData.work = true
            : this.reasonData.work = false;
          this.reasonData.active === 0 ? this.reasonData.active = false
            : this.reasonData.active = true;

          this.form.description = this.reasonData.description;
          this.form.work = this.reasonData.work;
          this.form.active = this.reasonData.active;
        }
      },

      async updateReason() {
        return await http.put(`/api/reason/${this.reasonData.id}`, {
          'id': this.reasonData.id,
          'description': this.form.description,
          'work': this.form.work,
          'active': this.form.active
        }).then(() => {
          this.clearForm();
          this.$awn.success('Successfully Updated Reason');
          this.$store.dispatch('updateReason', null);
          this.$router.push('/management/viewReasons');
          return true;
        }).catch(() => {
          this.$awn.alert('Could Not Update Reason');
          return false;
        });
      },

      addReason() {
        http.post(`/api/reason/create`, {
          'description': this.form.description,
          'work': this.form.work,
          'active': this.form.active
        }).then((resp) => {
          if (resp.status === 201) {
            this.clearForm();
            (this.standard === false) ? this.$emit('added') : null;
            document.getElementById('description').focus();
          }
          this.$awn.success('Successfully Added Reason');
        }).catch(() => {
          this.$awn.alert('Could Not Add Reason');
        })
      },

      getValidationClass(fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },

      clearForm() {
        this.$v.$reset();
        this.form.description = null;
        this.form.work = false;
        this.form.active = false;
      },

      validateReason() {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          (!this.reasonData) ? this.addReason() : this.updateReason();
        }
      }
    },

    computed: {
      reasonData() {
        return this.$store.getters.reasonData;
      }
    },

    beforeMount() {
      this.fillInputs();
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
    /* width: 50%; */
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
