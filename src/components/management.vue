<template>
  <div>
    <div>
      <md-toolbar id="v-step-0">

      <!-- Calenders -->
      <md-menu md-size="medium" md-align-trigger :mdCloseOnSelect=true>
        <md-button md-menu-trigger>
          <md-icon>calendar_today</md-icon>
          Calenders
        </md-button>
        <md-menu-content>
          <md-menu-item to="/management/addCalendar">
            Add Calendar
          </md-menu-item>
          <md-menu-item to="/management/addCalendarTimes">
            Add Calendar Times
          </md-menu-item>
          <md-menu-item to="/management/viewCalendar">
            View Calendars
          </md-menu-item>
          <md-menu-item to="/management/viewCalendarTimes">
            View Calendar Times
          </md-menu-item>
          <md-menu-item to="/management/unassignCalFromEmp">
            Unassign Calendar From Employee
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <!-- Cards -->
      <md-menu md-size="medium" md-align-trigger>
        <md-button md-menu-trigger>
          <md-icon>credit_card</md-icon>
          Cards
        </md-button>
        <md-menu-content>
          <md-menu-item to="/management/addCard">
            Add Card
          </md-menu-item>
          <md-menu-item to="/management/selectCardForEmployee">
            View Cards
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <!-- Employees -->
      <md-menu md-size="medium" md-align-trigger>
        <md-button md-menu-trigger>
          <md-icon>person</md-icon>
          Employees
        </md-button>
        <md-menu-content>
          <md-menu-item to="/management/addEmployee">
            Add Employee
          </md-menu-item>
          <md-menu-item to="/management/viewEmployee">
            View Employees
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <!-- Processes -->
      <md-menu md-size="medium" md-align-trigger>
        <md-button md-menu-trigger>
          <md-icon>trending_up</md-icon>
          Processes
        </md-button>
        <md-menu-content>
          <md-menu-item to="/management/assignCardProcess">
            1) Assign Card To Employee
          </md-menu-item>
          <md-menu-item to="/management/assignCalendarTimes">
            2) Assign Calendar To Times
          </md-menu-item>
          <md-menu-item to="/management/assignCalendar">
            3) Assign Calendar To Employee
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <!-- Reasons -->
      <md-menu md-size="medium" md-align-trigger>
        <md-button md-menu-trigger>
          <md-icon>swap_vert</md-icon>
          Reasons
        </md-button>
        <md-menu-content>
          <md-menu-item to="/management/addReason">
            Add Reason
          </md-menu-item>
          <md-menu-item to="/management/viewReasons">
            View Reasons
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <!-- Reports -->
      <md-menu md-size="medium" md-align-trigger>
        <md-button md-menu-trigger>
          <md-icon>insert_chart_outlined</md-icon>
          Reports
        </md-button>
        <md-menu-content>
          <md-menu-item to="/management/employeeReports">
            Generate Employee Reports
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-toolbar>
    </div>
    <br>
    <router-view></router-view>
  </div>
</template>

<script>
  import http from '../../public/app.service.ts';
  export default {
    name: 'management',
    // Angular equivaent of INPUT
    props: {
    },
    //  Variables
    data() {
      return {

      }
    },

    methods: {

    },

    beforeMount() {
      // this.checkConnectivity();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .md-button {
    color: aqua;
  }

  .md-toolbar {
    background-color: #424242;
  }
</style>
