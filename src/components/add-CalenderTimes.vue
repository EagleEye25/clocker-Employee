<template>
  <div>
    <md-button class="md-icon-button md-dense topLeft" v-if="standard !== false" @click="help">
      <md-tooltip md-direction="left">Click Me For Help</md-tooltip>
      <md-icon>help_outline</md-icon>
    </md-button>
    <br>
    <!-- Standard Process -->
    <div>
      <form novalidate class="md-layout" @submit.prevent="validateCalTimes">
        <md-card class="md-layout-item md-size-40 md-small-size-100 center box">
        <md-card-header>
          <div id="startT" class="md-title">{{ title }}</div>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <!-- Starting -->
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('sWeek')">
                <label>* Starting Week</label>
                <md-input type="number" class="sWeek" v-model="form.sWeek"/>
                <span class="md-error" v-if="!$v.form.sWeek.required">The starting week is required</span>
                <span class="md-error" v-else-if="!$v.form.sWeek.between">The starting week has to be between 1 AND 52</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('sDay')">
                <label>* Starting Day</label>
                <md-select class="sDay" v-model="form.sDay" md-dense>
                  <md-option value="1">Monday</md-option>
                  <md-option value="2">Tuesday</md-option>
                  <md-option value="3">Wednesday</md-option>
                  <md-option value="4">Thursday</md-option>
                  <md-option value="5">Friday</md-option>
                  <md-option value="6">Saturday</md-option>
                  <md-option value="7">Sunday</md-option>
                </md-select>
                <span class="md-error">The starting day is required</span>
                <div id="sDayT"></div>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('sTime')">
                <VueCtkDateTimePicker id="sTime" name="sTime" v-model="form.sTime"
                                     :onlyTime=true format="HH:mm" formatted="HH:mm"
                                     color="#27C96D" :dark=true label="* Starting Time"
                                     class="center">
                </VueCtkDateTimePicker>
                <span class="md-error">The starting time is required</span>
              </md-field>
                <!-- <span class="md-error" v-if="!$v.form.sWeek.required">The starting week is required</span> -->
            </div>
          </div>
          <br>
          <md-divider></md-divider>
          <!-- Ending -->
          <div class="md-layout md-gutter center">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('eDay')">
                <label>* Ending Day</label>
                <md-select class="eDay" v-model="form.eDay" md-dense>
                  <md-option value="1">Monday</md-option>
                  <md-option value="2">Tuesday</md-option>
                  <md-option value="3">Wednesday</md-option>
                  <md-option value="4">Thursday</md-option>
                  <md-option value="5">Friday</md-option>
                  <md-option value="6">Saturday</md-option>
                  <md-option value="7">Sunday</md-option>
                </md-select>
                <span class="md-error">The ending day is required</span>
                <div id="eDayT"></div>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('eTime')">
                <VueCtkDateTimePicker id="eTime" name="eTime" v-model="form.eTime"
                                     :onlyTime=true format="HH:mm" formatted="HH:mm"
                                     color="#27C96D" :dark=true label="* Ending Time"
                                     class="center">
                </VueCtkDateTimePicker>
                <span class="md-error">The ending time is required</span>
              </md-field>
                <!-- <span class="md-error" v-if="!$v.form.sWeek.required">The starting week is required</span> -->
            </div>
          </div>
        </md-card-content>
          <!-- standard -->
          <md-divider></md-divider>
          <md-card-actions v-if="!update && !create">
            <md-button class="cancelNorm" style="color: orange" @click="clearForm">
              <md-icon>cancel</md-icon>
              Cancel
            </md-button>
            <md-button class="addNorm" style="color: lime" type="submit">
              <md-icon>done</md-icon>
              Add Times
            </md-button>
          </md-card-actions>
          <!-- update, return -->
          <md-card-actions v-if="update">
            <md-button style="color: orange" @click="returnToView">
              <md-icon>cancel</md-icon>
              Cancel
            </md-button>
            <md-button style="color: lime" type="submit">
              <md-icon>update</md-icon>
              Update Times
            </md-button>
          </md-card-actions>
          <!-- create, return -->
          <md-card-actions v-if="create">
            <md-button style="color: orange" @click="returnToView">
              <md-icon>cancel</md-icon>
              Cancel
            </md-button>
            <md-button style="color: lime" type="submit">
              <md-icon>done</md-icon>
              Add Times
            </md-button>
          </md-card-actions>
          <v-tour name="addTimes" :steps="steps"></v-tour>
        </md-card>
      </form>
    </div>
    <!-- Part of Process -->
    <div>
    </div>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import {
    required,
    minLength,
    between
  } from 'vuelidate/lib/validators';
  import http from '../../public/app.service.ts';

  export default {
    name: 'add-CalendarTimes',
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
            target: '#startT',
            content: `This is where all times for calendars are created.`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '.sWeek',
            content: `Firstly start by entering a starting week (1 - 52)`,
            params: {
              placement: 'left'
            }
          },
          {
            target: '#sDayT',
            content: `Then enter a starting day`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#sTime',
            content: `Then select a starting time`,
            params: {
              placement: 'left'
            }
          },
          {
            target: '#eDayT',
            content: `Then enter a ending day`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#eTime',
            content: `Then enter a ending time.`,
            params: {
              placement: 'left'
            }
          },
          {
            target: '.cancelNorm',
            content: `If you decide that you dont want to create the calendar Times, simply click here to cancel the process.`,
            params: {
              placement: 'bottom'
            }
          },
          {
            target: '.addNorm',
            content: `Once all information is entered, simply click here and your calendar Times will be created!`,
            params: {
              placement: 'bottom'
            }
          },
        ],
        form: {
          sWeek: null,
          sDay: null,
          sTime: null,
          eDay: null,
          eTime: null
        },
        title: 'Create Calendar Times',
        update: false,
        create: false,
      }
    },

    validations: {
      form: {
        sWeek: {
          required,
          between: between(1, 52)
        },
        sDay: {
          required,
        },
        sTime: {
          required,
        },
        eDay: {
          required,
        },
        eTime: {
          required,
        },
      },
    },

    methods: {
      help() {
        this.$tours['addTimes'].start()
      },

      async addCalTimes() {
        if (!await this.checkCalTimes(this.form)) {
          return await http.post(`/api/calender_times/create`, {
            'startWeek': this.form.sWeek,
            'startDay': this.form.sDay,
            'startTime': this.form.sTime,
            'endDay': this.form.eDay,
            'endTime': this.form.eTime
          }).then((res) => {
            this.$awn.success('Successfully Created Calendar Times');
            if (this.standard === false) {
              this.$store.dispatch('updateCalendarTime', res.data);
              this.$emit('added');
            }
            this.create ? this.returnToView(true) : null;
            this.clearForm();
            return true;
          }).catch((err) => {
            this.$awn.alert('Could Not Create Calendar Times');
            return false;
          });
        } else {
          this.$awn.warning('Calendar Times Already Exist');
        }
      },

      async UpdateTimes() {
        let d = this.timeData;
        return await http.put(`/api/calender_times/${d.id}`,{
          'id': d.id,
          'startWeek': this.form.sWeek,
          'startDay': this.form.sDay,
          'startTime': this.form.sTime,
          'endDay': this.form.eDay,
          'endTime': this.form.eTime
        }).then(() => {
          this.$awn.success('Successfully Updated Calendar Times');
          this.returnToView();
          return true;
        }).catch(() => {
          this.$awn.alert('Could Not Update Calendar Times');
          return false;
        });
      },

      clearForm() {
        this.$v.$reset();
        this.form.sWeek = null;
        this.form.sDay = null;
        this.form.sTime = null;
        this.form.eDay = null;
        this.form.eTime = null;
        this.standard === false ? this.$emit('canceled') : null;
      },

      async checkCalTimes(c_times) {
        return await http.get(`/api/calender_times/times/existing`, {c_times})
          .then(() => {
            return true
          }).catch(() => {
            return false
          });
      },

      determine() {
        if (this.timeData.update) {
          let d = this.timeData;
          this.title = 'Update Calendar Times'
          this.update = true;

          this.form.sWeek = d.startWeek;
          this.form.sDay = d.startDay;
          this.form.sTime = d.startTime;
          this.form.eDay = d.endDay;
          this.form.eTime = d.endTime;
        } else if (this.timeData.create) {
          this.title = 'Add Calendar';
          this.create = true;
        }
      },

      returnToView(keep) {
        this.clearForm();
        keep ? null : this.$store.dispatch('updateCalendarTime', null);
        this.$router.push('/management/viewCalendarTimes');
      },

      getValidationClass(fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },

      validateCalTimes() {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          if (!this.update) {
            this.addCalTimes()
          } else if (this.update) {
            this.UpdateTimes();
          }
        }
      }
    },

    beforeMount() {
      this.determine();
    },

    computed: {
      timeData() {
        return this.$store.getters.calendarTime;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }
  .form {
    width: 30%
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
