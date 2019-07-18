<template>
  <div>
    <md-button class="md-icon-button md-dense topLeft" v-if="standard !== false" @click="help">
      <md-tooltip md-direction="left">Click Me For Help</md-tooltip>
      <md-icon>help_outline</md-icon>
    </md-button>
    <br>
    <!-- Form for entering information -->
    <form v-if="!empInfo" novalidate class="md-layout" @submit.prevent="validateUser" >
      <!-- Display inputs on card -->
      <md-card class="md-layout-item md-size-50 md-small-size-100 center box" id="empST">
        <!-- Header for card -->
        <md-card-header>
          <div class="md-title">Add Employee To Clocker</div>
        </md-card-header>
        <md-divider></md-divider>
        <!-- Content to be displayed on cards -->
        <md-card-content>
          <div class="md-layout md-gutter">
            <!-- First Name -->
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('firstName')">
                <label>* First Name</label>
                <md-input class="firstName" v-model="form.firstName" :disabled="processing" />
                <span class="md-error" v-if="!$v.form.firstName.required">The first name is required</span>
                <span class="md-error" v-else-if="!$v.form.firstName.minlength">Invalid first name</span>
              </md-field>
            </div>
            <!-- Last Name -->
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('lastName')">
                <label>* Last Name</label>
                <md-input class="lastName" v-model="form.lastName" :disabled="processing" />
                <span class="md-error" v-if="!$v.form.lastName.required">The last name is required</span>
                <span class="md-error" v-else-if="!$v.form.lastName.minlength">Invalid last name</span>
              </md-field>
            </div>
          </div>
          <!-- Second Part -->
          <div class="md-layout md-gutter">
            <!-- Admin -->
            <div id="admin" class="md-layout-item md-small-size-100">
              <md-checkbox v-model="form.admin"
                            @change="clearPass">
                  Admin
              </md-checkbox>
            </div>
            <!-- Reporting Admin -->
            <div id="report" class="md-layout-item md-small-size-100">
                <md-checkbox v-model="form.reporting_admin">
                  Reporting Admin
                </md-checkbox>
            </div>
          </div>
          <!-- Third Part -->
          <div class="md-layout md-gutter" v-if="form.admin">
            <!-- Password -->
            <div class="md-layout-item md-small-size-100">
              <md-field v-show=form.admin :class="getValidationClass('password')">
                <label for="password">* Password</label>
                <md-input type="password" class="password" v-model="form.password" :disabled="processing"/>
                <span class="md-error" v-if="!$v.form.password.required">Password is required</span>
                <span class="md-error" v-else-if="!$v.form.password.strongPassReg">Password Must Include:
                                                                                  2 numbers,
                                                                                  2 Special Characters <br>
                                                                                  2 Uppercase Characters,
                                                                                  Must be at least 10 Characters</span>
              </md-field>
            </div>
           <!-- Password -->
            <div class="md-layout-item md-small-size-100">
              <md-field v-show=form.admin :class="getValidationClass('confirmPass')">
                <label for="confirmPass">* Confirm Password</label>
                <md-input type="password" class="confirmPass" v-model="form.confirmPass" :disabled="processing"/>
                <span class="md-error" v-if="!$v.form.confirmPass.sameAsPassword">Passwords much match</span>
              </md-field>
            </div>
          </div>
        </md-card-content>
        <md-divider></md-divider>
        <md-card-actions v-if="standard !== false">
          <md-button id="cancel" style="color: orange"  v-on:click="clearForm" v-if="!id">
            <md-icon>cancel</md-icon>
            cancel
          </md-button>
          <md-button id="add" style="color: lime"  type="submit" v-if="!id">
            <md-icon>done</md-icon>
            Add Employee
          </md-button>
          <md-button style="color: orange" v-if="id" @click="clearForm">
            <md-icon>cancel</md-icon>
            Cancel
          </md-button>
          <md-button style="color: lime" v-if="id" type="submit">
            <md-icon>update</md-icon>
            Update Employee
          </md-button>
        </md-card-actions>
        <md-card-actions v-if="standard === false">
          <md-button style="color: orange" v-if="!$store.getters.employeeInfo" v-on:click="cancelAdd">
            <md-icon>cancel</md-icon>
            cancel
          </md-button>
          <md-button style="color: lime" v-if="!$store.getters.employeeInfo" type="submit">
            <md-icon>done</md-icon>
            Add Employee
          </md-button>
        </md-card-actions>
        <v-tour name="addEmployee" :steps="steps"></v-tour>

      </md-card>
    </form>
  </div>
</template>

<script>
  const strongPassReg = helpers.regex('password',
    /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{10,}$/
  );
  import { validationMixin } from 'vuelidate';
  import {
    required,
    minLength,
    sameAs,
    helpers
  } from 'vuelidate/lib/validators';
  import http from '../../public/app.service.ts'

  export default {
    name: 'add-Employee',
    mixins: [validationMixin],
    // Angular equivaent of INPUT
    props: {
      standard: true,
    },
    //  Variables
    data() {
      return {
        steps: [
          {
            target: '#empST',
            content: `This is where all employees that will be using the system are going to be created`,
            params: {
              placement: 'left'
            }
          },
          {
            target: '.firstName',
            content: `Firstly enter the employees first name`,
            params: {
              placement: 'left'
            }
          },
          {
            target: '.lastName',
            content: `Secondly enter their last name`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#admin',
            content: `By checking this feild, will grant employees access to the admin side of the management system.
              Once this has been selected you will have to enter in a password that will be used to gain access to the
              system in the case of a lost card.`,
            params: {
              placement: 'left'
            }
          },
          {
            target: '#report',
            content: `By checking this feild, will grant employees access to the reporting side of the management system.`,
            params: {
              placement: 'right'
            }
          },
          {
          target: '#cancel',
          content: `If you decide that you dont want to create the employee, simply click here to cancel the process`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '#add',
          content: `Once the information is entered, simply click here and the employee will be created!`,
          params: {
            placement: 'bottom'
          }
        }],
        form: {
          firstName: '',
          lastName: '',
          admin: false,
          reporting_admin: false,
          password: null,
          confirmPass: null,
        },
        processing: null,
        passVis: false,
        combinedName: '',
        selectedEmployee: '',
        updateInfo: '',
        addMsg: 'Add Employee',
        id: null,
      }
    },
    // TODO: fix when admin isnt clicked, also proper password validations
    validations() {
      if (!this.form.admin) {
        return {
          form: {
            firstName: {
              required,
              minLength: minLength(3)
            },
            lastName: {
              required,
              minLength: minLength(3)
            },
          }
        }
      } else {
        return {
          form: {
            firstName: {
              required,
              minLength: minLength(3)
            },
            lastName: {
              required,
              minLength: minLength(3)
            },
            password: {
              required,
              strongPassReg
            },
            confirmPass: {
              sameAsPassword: sameAs('password')
            }
          }
        }
      }
    },

    methods: {
      help() {
        this.$tours['addEmployee'].start();
      },

      async updateEmployee() {
        this.combinedName = (this.form.firstName + ' ' + this.form.lastName).toLowerCase();
        return await http.put(`/api/employee/${this.id}`, {
          'id': this.id,
          'name': this.combinedName,
          'admin': this.form.admin,
          'reporting_admin': this.form.reporting_admin,
          'password': this.form.password,
        }).then(() => {
            this.clearForm();
            this.$store.dispatch('updateEmp', null);
            this.$router.push('/management/viewEmployee');
            this.$awn.success('Successfully Updated Employee');
            return true
          }).catch(() => {
            this.$awn.alert('Could Not Update Employee');
            return false
          });
      },

      async addEmployee() {
        this.combinedName = (this.form.firstName + ' ' + this.form.lastName).toLowerCase();
        if (this.form.password !== this.form.confirmPass) {
          this.$awn.warning('Passwords do not match');
          return;
        }
        if (!await this.checkUser(this.combinedName)) {
            http.post(`/api/employee/create`, {
            'name': this.combinedName,
            'admin': this.form.admin,
            'reporting_admin': this.form.reporting_admin,
            'password': this.form.password,
            'active': true,
          }).then((resp) => {
            if (resp.status === 201) {
              if (this.standard === false) {
                this.$store.dispatch('updateEmployeeInfo', resp.data);
                this.$emit('added');
              }
              this.clearForm();
              this.$awn.success('Successfully Added Employee');
              return true;
            }
          }).catch(() => {
            this.$awn.alert('Could Not Add Employee');
            return false;
          })
        } else {
          this.$awn.warning('Employee Already Exists');
        }
      },

      async fillInputs() {
        if (this.standard !== false && this.updateEmpInfo.update) {
          this.id = this.updateEmpInfo.id;

          const got = await this.getInfoUpdate();
          if (got) {
            let admin = false;
            let reporting = false;
            (this.updateInfo.admin === 0) ? admin = false : admin = true;
            (this.updateInfo.reporting_admin === 0) ? reporting = false : reporting = true;
            let name = this.updateInfo.name.split(' ');

            this.form.firstName = name[0];
            this.form.lastName = name[1];
            this.form.admin = admin;
            this.form.reporting_admin = reporting;
            if (this.updateInfo.password) {
              this.form.password = this.updateInfo.password;
            }
          }
        }
      },

      async getInfoUpdate() {
        return await http.get(`/api/employee/${this.id}`)
          .then((resp) => {
            this.updateInfo = resp.data;
            return true
          }).catch(() => {
            return false
          });
      },

      cancelAdd() {
        this.$store.dispatch('updateChangeCancelAddEmp', true);
        this.clearForm();
        this.$emit('canceled');
      },

      async checkUser(name) {
        return await http.get(`/api/employee/findByName/${name}`)
          .then(() => {
            return true
          }).catch(() => {
            return false
          });
      },

      passwordVisibility() {
        if (this.form.admin == false) {
          this.passVis = false;
        } else if (this.form.admin == true) {
          this.passVis = true;
        }
      },

      clearPass() {
        this.form.password = '';
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
        this.$v.$reset()
        this.form.firstName = null
        this.form.lastName = null
        this.form.admin = false
        this.form.reporting_admin = false
        this.form.password = null
        this.form.confirmPass = null;
        const el = document.querySelector('#first-name');
          if (el) {
            el.focus();
          }
        if (this.id) {
          this.id = null;
          this.$router.push('/management/viewEmployee');
        }
      },

      validateUser() {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          if (!this.id || this.standard === false) {
            this.addEmployee();
          } else if (this.id) {
            this.updateEmployee();
          }
        }
      }
    },
    computed: {
      addEmp() {
        return this.$store.getters.addEmp;
      },

      empInfo() {
        return this.$store.getters.employeeInfo;
      },

      updateEmpInfo() {
        return this.$store.getters.updateEmp;
      }
    },

    // created() {
    //   this.fillInputs();
    // },

    beforeMount() {
      this.fillInputs();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .md-checkbox {
    display: flex;
  }


  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    /* width: 50%; */
  }

  .box {
    -webkit-border-radius: 6px;;
    border-radius: 6px;;
  }

  .topLeft {
    position: absolute;
    right:    0;
    top: 100;
  }
</style>
