<template>
  <div class="center">
    <h1 style="color:white">Assign Calendar To Employee</h1>
    <br>
    <md-steppers :md-active-step.sync="active" md-vertical md-linear>
      <md-step id="first" md-label="Select Calendar" :md-editable=editable :md-done.sync="first">
        <addCalender v-if="!showCreatedCal" v-bind:standard=false @added="setDone('first', 'second')"></addCalender>
        <md-button v-if="!showCreatedCal" class="md-raised" style="color:orange" @click="showCreatedCal = true">Already Created Calendar</md-button>
        <div v-if="showCreatedCal">
          <viewCalender v-bind:standard=false></viewCalender>
          <md-button class="md-raised md-accent" @click="showCreatedCal = false">Back</md-button>
          <md-button class="md-raised md-primary" :disabled=!calendarData @click="setDone('first', 'second')">Continue</md-button>
        </div>
      </md-step>

      <md-step id="second" md-label="Select Employee" :md-editable=editable :md-done.sync="second">
        <viewEmployee v-if="active === 'second'" v-bind:standard=false v-bind:calUnAssigned=true></viewEmployee>
        <md-button class="md-raised md-primary" :disabled="!employeeInfo" @click="setDone('second', 'third')">Continue</md-button>
      </md-step>

      <md-step id="third" md-label="Complete" :md-editable=editable :md-done.sync="third">
        <!-- Not Assigned -->
        <div v-if="!assigned" class="center">
          <md-list>
            <md-list-item class="center">
              <md-icon>calendar_today</md-icon>
              <span class="md-list-item-text">Calendar:
                <br>
                <div style="margin-left:2em">
                  <span>Name: {{ calendarData.name }}</span>
                  <br>
                  <span>Description: {{ calendarData.description ? calendarData.description : 'No Description' }}</span>
                </div>
              </span>
            </md-list-item>
            <br>
            <md-divider class="md-inset"></md-divider>
            <br>
            <md-list-item class="center">
              <md-icon>perm_identity</md-icon>
              <span class="md-list-item-text">Employee:
                <br>
                <div style="margin-left:2em">
                  <span>Name: {{ employeeInfo.name }}</span>
                </div>
              </span>
            </md-list-item>
          </md-list>
          <md-button class="md-raised md-primary" @click="assign">Assign Calendar</md-button>
        </div>
        <!-- Assigned -->
        <div v-if="assigned">
           <h1>Successfully Assigned Calendar to Employee!</h1>
            <md-button class="md-raised" style="color: lime;" to="/management">Back To Management</md-button>
            <md-button class="md-raised" style="color: yellow;" @click="resetStepper">Assign Another Calendar</md-button>
        </div>
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
  import http from '../../public/app.service.ts';
  import addCalender from './add-Calender';
  import viewCalender from './view-Calender';
  import viewEmployee from './view-Employee';
  export default {
    name: 'assing-Calender',
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
        showCreatedCal: false,
        assigned: false,
      }
    },

    components: {
      addCalender,
      viewCalender,
      viewEmployee,
    },

    methods: {
      async assign() {
        return await http.post(`/api/employee_calender/create`, {
          'employee_id': this.employeeInfo.id,
          'calender_id': this.calendarData.id,
          'active_date': Date.now(),
        }).then(() => {
          this.$awn.success('Successfully Assigned Employee To Calendar');
          this.assigned = true;
          this.editable = false;
          return true;
        }).catch(() => {
          this.$awn.alert('Could Not Assign Employee To Calendar');
          return false;
        });
      },

      setDone (id, index) {
        this[id] = true

        this.secondStepError = null

        if (index) {
          this.active = index
        }
      },

      clearStore() {
        this.$store.dispatch('updateEmployeeInfo', null);
        this.$store.dispatch('updateCalendar', null);
      },

      resetStepper() {
        this.first = false;
        this.second = false;
        this.third = false;
        this.active = 'first';
        this.showCreatedCal = false;
        this.showCreatedCal = false;
        this.assigned = false;
        this.editable = true;
        this.clearStore();
      },
    },

    beforeMount() {
      this.clearStore();
    },

    computed: {
      calendarData() {
        return this.$store.getters.calendarData;
      },
      employeeInfo() {
        return this.$store.getters.employeeInfo;
      }
    },

    destroyed() {
      this.clearStore();
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

  .md-steppers {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

</style>