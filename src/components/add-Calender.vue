<template>
  <div class="center">
    <md-button class="md-icon-button md-dense topLeft" v-if="standard !== false" @click="help">
      <md-tooltip md-direction="left">Click Me For Help</md-tooltip>
      <md-icon >help_outline</md-icon>
    </md-button>
    <br>
    <!-- Standard process -->
    <div v-if="standard !== false">
      <form novalidate class="md-layout" @submit.prevent="validateCal">
        <md-card class="md-layout-item md-size-50 md-small-size-100 center box">
          <md-card-header>
            <div id="startACT" class="md-title">{{title}}</div>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('calendarName')">
                  <label for="Calendar Name">* Calendar Name</label>
                  <md-input class="calendarName" v-model="form.calendarName"/>
                  <span class="md-error" v-if="!$v.form.calendarName.required">The calendar name is required</span>
                  <span class="md-error" v-else-if="!$v.form.calendarName.minlength">Invalid calendar name</span>
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="Calendar Name">Description</label>
                  <md-input class="description" v-model="form.description"/>
                  <span class="md-helper-text">(Optional)</span>
                  <!-- <span class="md-error" v-if="!$v.form.calendarName.required">The calendar name is required</span>
                  <span class="md-error" v-else-if="!$v.form.calendarName.minlength">Invalid calendar name</span> -->
                </md-field>
              </div>
            </div>
          </md-card-content>
          <!-- Standard -->
          <md-divider></md-divider>
          <md-card-actions v-if="!update && !create">
            <md-button class="cancelNorm" style="color: orange" @click="clearForm">
              <md-icon>cancel</md-icon>
              cancel
            </md-button>
            <md-button class="addNorm" style="color: lime" type="submit">
              <md-icon>done</md-icon>
              Add Calendar
            </md-button>
          </md-card-actions>
          <!-- Update, return to list -->
          <md-card-actions v-if="update">
            <md-button style="color: orange" @click="returnToView">
              <md-icon>cancel</md-icon>
              cancel
            </md-button>
            <md-button style="color: lime" type="submit">
              <md-icon>update</md-icon>
              Update Calendar
            </md-button>
          </md-card-actions>
          <!-- Create, return to list -->
          <md-card-actions v-if="create">
            <md-button style="color: orange" @click="returnToView">
              <md-icon>cancel</md-icon>
              cancel
            </md-button>
            <md-button style="color: lime" type="submit">
              <md-icon>done</md-icon>
              Add Calendar
            </md-button>
          </md-card-actions>
          <v-tour name="addCal" :steps="steps"></v-tour>
        </md-card>
      </form>
    </div>
    <!-- Part Process -->
    <div v-if="standard === false">
      <form novalidate class="md-layout" @submit.prevent="validateCal">
        <md-card class="md-layout-item md-size-50 md-small-size-100 center box">
          <md-card-header>
            <div class="md-title">{{title}}</div>
          </md-card-header>

          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                 <md-field :class="getValidationClass('calendarName')">
                  <label>Calendar Name</label>
                  <md-input v-model="form.calendarName"/>
                  <span class="md-error" v-if="!$v.form.calendarName.required">The calendar name is required</span>
                  <span class="md-error" v-else-if="!$v.form.calendarName.minlength">Invalid calendar name</span>
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Description</label>
                  <md-input v-model="form.description"/>
                  <span class="md-helper-text">(Optional)</span>
                  <!-- <span class="md-error" v-if="!$v.form.calendarName.required">The calendar name is required</span>
                  <span class="md-error" v-else-if="!$v.form.calendarName.minlength">Invalid calendar name</span> -->
                </md-field>
              </div>
            </div>
          </md-card-content>
          <!-- Standard part of process -->
          <md-card-actions>
            <md-button style="color: lime" type="submit">
              <md-icon>done</md-icon>
              Add Calendar
            </md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import {
    required,
    minLength,
  } from 'vuelidate/lib/validators';
  import http from '../../public/app.service.ts';
  export default {
    name: 'add-Calender',
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
            target: '#startACT',
            content: `This is where all calendars that will be assigned to employees will be created`,
            params: {
              placement: 'left'
            }
          },
          {
            target: '.calendarName',
            content: `Firstly start by entering a calendar name e.g. 9 - 5`,
            params: {
              placement: 'left'
            }
          },
          {
            target: '.description',
            content: `Descriptions are helpful in remembering what purpose the calendar serves (but is optional)`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '.cancelNorm',
            content: `If you decide that you dont want to create the calendar, simply click here to cancel the process`,
            params: {
              placement: 'bottom'
            }
          },
          {
            target: '.addNorm',
            content: `Once all information is entered, simply click here and your calendar will be created!`,
            params: {
              placement: 'bottom'
            }
          },
        ],
        form: {
          calendarName: '',
          description: '',
        },
        title: 'Add Calendar',
        update: false,
        create: false,
        showTour: false,
      }
    },

    validations: {
      form: {
        calendarName: {
          required,
          minLength: minLength(4)
        }
      },
    },

    methods: {
      help() {
        this.$tours['addCal'].start()
      },

      async createInProcess() {
        let id = await this.createCalendar();
        if (id) {
          let data = {
            'id': id,
            'name': this.form.calendarName,
            'description': this.form.description
          }
          this.standard === false ? this.$store.dispatch('updateCalendar', data) : null
          this.$emit('added');
        }
      },

      async createCalendar() {
        if (!await this.checkCalender(this.form.calendarName)) {
          return await http.post(`/api/calender/create`, {
            'name': this.form.calendarName,
            'description': this.form.description
          }).then((res) => {
            this.$awn.success('Successfully Created Calendar');
            this.clearForm();
            this.create ? this.returnToView() : null;
            return res.data.id;
          }).catch(() => {
            this.$awn.alert('Could Not Create Calendar');
            return false;
          });
        } else {
          this.$awn.warning('A Calendar with this name already exists');
        }
      },

      async updateCalendar() {
        let d = this.calendarData;
        return await http.put(`/api/calender/${d.id}`, {
          'id': d.id,
          'name': this.form.calendarName,
          'description': this.form.description
        }).then(() => {
          this.$awn.success('Successfully Updated Calendar');
          this.returnToView();
          return false
        }).catch(() => {
          this.$awn.alert('Could Not Update Calendar');
          return false
        });
      },

      async checkCalender(name) {
        return await http.get(`/api/calender/findByName/${name}`)
          .then(() => {
            return true
          }).catch(() => {
            return false
          });
      },

      clearForm() {
        this.$v.$reset();
        this.form.calendarName = '';
        this.form.description = '';
      },

      determine() {
        if (this.calendarData.update) {
          let d = this.calendarData;
          this.title = 'Update Calendar';
          this.update = true;

          this.form.calendarName = d.name;
          this.form.description = d.description;
        } else if (this.calendarData.create) {
          this.title = 'Add Calendar';
          this.create = true;
        }
      },

      returnToView() {
        this.clearForm();
        this.$store.dispatch('updateCalendar', null);
        this.$router.push('/management/viewCalendar');
      },

      getValidationClass(fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },

      validateCal() {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          if (this.update) {
            this.updateCalendar();
          } else if (this.standard !== false) {
            this.createCalendar()
          } else if (this.standard === false && !this.update) {
            this.createInProcess();
          }
        }
      }
    },

    beforeMount() {
      this.determine();
    },

    computed: {
      calendarData() {
        return this.$store.getters.calendarData;
      },
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

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
