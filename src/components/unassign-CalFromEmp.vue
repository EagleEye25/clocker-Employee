<template>
  <div class="center">
    <md-button class="md-icon-button md-dense topLeft" @click="help">
      <md-tooltip md-direction="left">Click Me For Help</md-tooltip>
      <md-icon>help_outline</md-icon>
    </md-button>
    <h2 class="unassignCalT" style="color: white;">Unassign Calendar From Employee</h2>
    <div style="padding-left: 42.3%">
      <md-card class="md-layout md-gutter box" style="width: 30%" id="calenders">
        <div class="md-layout-item center">
          <md-field class="center">
            <label>Please select a calendar</label>
            <md-select v-model="selectedCalID" :disabled="!calenders">
              <md-option
                v-for="(item, index) in calenders"
                :key="index"
                :value=item.id>
                  {{ item.name }}
                </md-option>
            </md-select>
          </md-field>
        </div>
      </md-card>
    </div>
    <br />
    <div v-if="selectedCalID">
      <md-table id="empTable"
        v-model="searched"
        md-sort="id"
        md-sort-order="asc"
        md-card
        md-fixed-header
        @md-selected="onSelect"
        class="table box"
      >
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title">Assigned Employees</h1>
          </div>

          <md-field md-clearable class="md-toolbar-section-end">
            <md-input
              placeholder="Search by Employee name..."
              v-model="search"
              @input="searchOnTable"
            />
          </md-field>
        </md-table-toolbar>

        <md-table-empty-state
          md-label="No calendar's found"
          :md-description="`No Employee's found for this search term. Try a different search term.`"
        ></md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Employee Name" md-sort-by="name">{{ item.name }}</md-table-cell>
          <md-table-cell md-label="Admin" md-sort-by="admin">{{ item.admin }}</md-table-cell>
          <md-table-cell
            md-label="Reporting Admin"
            md-sort-by="reporting_admin"
          >{{ item.reporting_admin }}</md-table-cell>
          <md-table-cell>
            <md-button class="md-raised md-accent" @click="active = true, empID = item.id">Unassign</md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
    <v-tour name="unCalS" :steps="steps"></v-tour>

    <md-dialog-confirm
    :md-active.sync="active"
    md-title= "Unassign Calender"
    md-content= "Are you sure you want to unassign this calendar from the selected employee? <br>
      By completing this action, it will affect the reports for the selected employee."
    md-confirm-text="Agree"
    md-cancel-text="Cancel"
    @md-cancel="onCancel"
    @md-confirm="unassign" />
  </div>
</template>

<script>
import http from "../../public/app.service.ts";

const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.name).includes(toLower(term)));
  }

  return items;
};

export default {
  name: "unasign-CalFromEmp",
  // Angular equivaent of INPUT
  props: {},
  //  Variables
  data() {
    return {
      steps: [
        {
          target: '.unassignCalT',
          content: `This is where Calendars assigned to an employee can be unassigned`,
          params: {
            placement: 'left'
          }
        },
        {
          target: '#calenders',
          content: `Firstly select a calendar`,
          params: {
            placement: 'left'
          }
        },
        {
          target: '#empTable',
          content: `Select the employee you would like to unassign from the calendar,
            a dialoge will prompt you to confirm, after confirmation the calendar will be
            unassigned from the employee.`,
          params: {
            placement: 'top'
          }
        }
      ],
      selectedEmp: null,
      search: null,
      searched: [],
      calenders: [],
      selectedCalID: null,
      active: false,
      empID: null,
    };
  },

  watch: {
    selectedCalID: {
      handler(newValue) {
        if (newValue) {
          this.getEmployees();
        }
      }
    }
  },

  methods: {
    help() {
      this.$tours['unCalS'].start();
    },

    onCancel () {
      this.active = false;
    },

    async unassign() {
      return await http
        .delete(`api/employee_calender/remove/emp/${this.empID}`)
        .then(() => {
          const idx = this.searched.findIndex((emp) => emp.id === this.empID);
          if (idx > -1) {
            this.searched.splice(idx, 1);
          }
          this.$awn.success("Successfully unassigned employee from calendar");
        })
        .catch(() => {
          this.$awn.alert("Could not unassigned employee from calendar");
        });
    },

    async getEmployees() {
      this.searched = [];
      return await http
        .get(`/api/employee/assigned/cal/employees/${this.selectedCalID}`)
        .then(res => {
          res.data.forEach(d => {
            let boolAdmin = "no";
            d.admin !== 0 ? (boolAdmin = "yes") : "";

            let boolReport = "no";
            d.reporting_admin !== 0 ? (boolReport = "yes") : "";

            let active = false;
            d.active !== 0 ? (active = true) : (active = false);
            let data = {
              id: d.id,
              name: d.name,
              admin: boolAdmin,
              reporting_admin: boolReport,
              active: active
            };
            this.searched.push(data);
          });
          return true;
        })
        .catch(err => {
          let error = err.toString().indexOf("404");
          error > -1
            ? this.$awn.warning("No Assigned Employees")
            : this.$awn.alert("Could Not Get Employees");
          return false;
        });
    },

    async getCalendars() {
      return await http
        .get(`/api/calender/assigned/calender`)
        .then(res => {
          res.data.forEach(d => {
            let data = {
              id: d.id,
              name: d.name,
              description: d.description
            };
            this.calenders.push(data);
          });
          return true;
        })
        .catch((err) => {
          let error = err.toString().indexOf('404');
          error > -1 ? this.$awn.warning("No created calendars, please add a calendar") :
          this.$awn.alert("Could Not Get Calendars");
          return false;
        });
    },

    searchOnTable() {
      this.searched = searchByName(this.users, this.search);
    },

    onSelect(item) {
      if (item) {
        this.selectedEmp = item;
      }
    }
  },

  async beforeMount() {
    await this.getCalendars();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  /* width: 50%; */
}

.md-table {
  padding-top: 10px;
  margin: 0 auto;
  text-align: center;
  width: 50%;
}

.md-table-cell {
  text-align: left;
  max-width: 120px;
}

.md-field {
  max-width: 300px;
}

.md-table-toolbar {
  text-align: left;
}

.box {
  -webkit-border-radius: 6px;
  border-radius: 6px;
}
</style>