<template>
  <div>
    <h1 style="color:white">Assign Calendar To Calendar Times</h1>
    <br>
    <div>
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

        <md-step id="second" md-label="Select Calendar Times" :md-editable=editable :md-done.sync="second">
          <viewCalenderTimes v-if="active === 'second'" v-bind:standard=false></viewCalenderTimes>
          <md-button class="md-raised md-primary" :disabled=!timeData @click="setDone('second', 'third')">Continue</md-button>
        </md-step>

        <md-step id="third" md-label="Complete" :md-editable="false" :md-done.sync="third">
          <!-- Not Assigned -->
          <div v-if="!assigned">
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
                <md-icon>access_time</md-icon>
                <span class="md-list-item-text">Calendar Times:
                  <br>
                  <div style="margin-left:2em">
                    <span> Starting:</span>
                    <br>
                  </div>
                  <div style="margin-left:4.7em">
                    <span> Week: {{ timeData.startWeek }}</span>
                    <br>
                    <span> Day: {{ timeData.startDay }}</span>
                    <br>
                    <span> Time: {{ timeData.startTime }}</span>
                  </div>
                  <br>
                  <div style="margin-left:2em">
                    <span> Ending:</span>
                    <br>
                  </div>
                  <div style="margin-left:4em">
                    <span> Week:{{ timeData.endWeek }}</span>
                    <br>
                    <span> Day: {{ timeData.endDay }}</span>
                    <br>
                    <span> Time: {{ timeData.endTime }}</span>
                  </div>
                </span>
              </md-list-item>
            </md-list>
            <md-button class="md-raised md-primary" @click="assignTimes">Assign Calendar Times</md-button>
          </div>
          <!-- Assigned -->
          <div v-if="assigned">
            <h1>Successfully Assigned Calendar to Calendar Times!</h1>
            <md-button class="md-raised" style="color: lime;" to="/management">Back To Management</md-button>
            <md-button class="md-raised" style="color: yellow;" @click="resetStepper">Assign Another Calendar</md-button>
            <md-button class="md-raised" style="color: orange;" to="/management/assignCalendar">Assign Calendar To Employee</md-button>
          </div>
        </md-step>
      </md-steppers>
    </div>
  </div>
</template>

<script>
  import http from '../../public/app.service.ts';
  import addCalender from './add-Calender.vue';
  import viewCalender from './view-Calender.vue';
  import viewCalenderTimes from './view-CalenderTimes.vue';
  export default {
    name: 'assign-CalenderTimes',
    // Angular equivaent of INPUT
    props: {
    },
    //  Variables
    data() {
      return {
        active: 'first',
        editable: true,
        first: false,
        second: false,
        third: false,
        showCreatedCal: false,
        assigned: false,
      }
    },

    components : {
      addCalender,
      viewCalender,
      viewCalenderTimes,
    },

    methods: {
      async assignTimes() {
        let d = this.timeData;
        return await http.put(`/api/calender_times/${d.id}`,{
          'id': d.id,
          'calender_id': this.calendarData.id,
          'startWeek': d.startWeek,
          'startDay': d.startDay,
          'startTime': d.startTime,
          'endWeek': d.endWeek,
          'endDay': d.endDay,
          'endTime': d.endTime
        }).then(() => {
          this.$awn.success('Successfully Assigned Calendar Times');
          this.editable = false;
          this.assigned = true;
          return true;
        }).catch(() => {
          this.$awn.alert('Could Not Assign Calendar Times');
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
        this.$store.dispatch('updateCalendar', null);
        this.$store.dispatch('updateCalendarTime', null);
      },

      resetStepper() {
        this.first = false;
        this.second = false;
        this.third = false;
        this.active = 'first';
        this.showCreatedCal = false;
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

      timeData() {
        return this.$store.getters.calendarTime;
      }
    },

    destroyed() {
      this.clearStore();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .md-steppers {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    /* width: 50%; */
  }

</style>