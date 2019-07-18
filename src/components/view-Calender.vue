<template>
  <div class="center">
    <md-button class="md-icon-button md-dense topLeft" v-if="standard !== false" @click="help">
      <md-tooltip md-direction="left">Click Me For Help</md-tooltip>
      <md-icon>help_outline</md-icon>
    </md-button>
    <br>
    <!-- Standard -->
    <div v-if="standard !== false">
      <md-table v-model="searched" md-sort="id" md-sort-order="asc" md-card md-fixed-header
                @md-selected="onSelect" class="table box" id="createdCalST">
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title"> Created Calenders </h1>
          </div>

          <md-field md-clearable class="md-toolbar-section-end">
            <md-input placeholder="Search by calendar name..." v-model="search" @input="searchOnTable"/>
          </md-field>
        </md-table-toolbar>

        <md-table-empty-state
          md-label="No calendar's found"
          :md-description="`No calendar found for this search term. Try a different search term or create a new calendar.`">
          <md-button class="md-primary md-raised" @click="updateCalendar(false)">Create Calendar</md-button>
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
          <md-table-cell md-label="Description" md-sort-by="description">{{ item.description ? item.description : 'No Description' }}</md-table-cell>
          <md-table-cell>
            <md-button class="md-raised md-primary" @click="updateCalendar(item)">
              <md-icon>update</md-icon>
              Update
            </md-button>
          </md-table-cell>
          <!-- Activate / Deactivate -->
          <md-table-cell>
            <md-button class="md-raised md-accent" @click="callDelete(item.id)">
              <md-icon>warning</md-icon>
              Delete
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
      <md-dialog-confirm
        :md-active.sync="dialogActive"
        :md-title= mdTitle
        :md-content= mdDescription
        md-confirm-text="Agree"
        md-cancel-text="Cancel"
        @md-cancel="onCancel"
        @md-confirm="onConfirm" />
      <v-tour name="viewCal" :steps="steps"></v-tour>
    </div>
    <!-- Process -->
    <div v-if="standard === false">
      <md-table v-model="searched" md-sort="id" md-sort-order="asc" md-card md-fixed-header
                @md-selected="onSelect" class="table">
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title"> Created Calenders </h1>
          </div>

          <md-field md-clearable class="md-toolbar-section-end">
            <md-input placeholder="Search by calendar name..." v-model="search" @input="searchOnTable"/>
          </md-field>
        </md-table-toolbar>

        <md-table-empty-state
          md-label="No calendar's found"
          :md-description="`No calendar found for this search term. Try a different search term or create a new calendar.
            Please press 'BACK' to create a calender`">
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
          <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
          <md-table-cell md-label="Description" md-sort-by="description">{{ item.description ? item.description : 'No Description'}}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
  import http from '../../public/app.service.ts';

  const toLower = text => {
    return text.toString().toLowerCase();
  }

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.name).includes(toLower(term)));
    }
    return items
  }

  export default {
    name: 'view-Calender',
    // Angular equivaent of INPUT
    props: {
      standard: true,
    },
    //  Variables
    data() {
      return {
        steps: [
          {
            target: '#createdCalST',
            content: `This is where all created calendars can be updated / deleted.`,
            params: {
              placement: 'left'
            }
          }
        ],
        selectedCalendar: null,
        search: null,
        searched: [],
        calendars: [],
        dialogActive: false,
        mdTitle: '',
        mdDescription: '',
        updateCal: false,
        calID: null,
      }
    },

    methods: {
      help() {
        this.$tours['viewCal'].start();
      },

      async determineAction() {
        await this.getCalendars();
        // this.standard === false ? await this.getUnassigned() : await this.getCalendars()
      },

      async getUnassigned() {
        return await http.get(`/api/calender/unassigned/calender`)
          .then((res) => {
            res.data.forEach(d => {
              let data = {
                'id': d.id,
                'name': d.name,
                'description': d.description
              }
              this.calendars.push(data);
            });
          }).catch((err) => {
            let error = err.toString().indexOf('404');
            (error > -1) ? this.$awn.warning('No Calendars Found') :
            this.$awn.alert('Could Not Get Calendars');
          });
      },

      updateCalendar(item) {
        if (item) {
          this.updateCal = true;
          item.update = true;
          this.$store.dispatch('updateCalendar', item);
        } else {
          let create = {'create': true};
          this.$store.dispatch('updateCalendar', create);
        }
        this.$router.push('/management/addCalendar');
      },

      getCalendars() {
        http.get(`/api/calender`)
          .then((res) => {
            res.data.forEach(d => {
              let data = {
                'id': d.id,
                'name': d.name,
                'description': d.description
              }
              this.calendars.push(data);
            });
          }).catch((err) => {
            let error = err.toString().indexOf('404');
            error > -1 ? this.$awn.warning('No created calendars, please create a calendar') :
            this.$awn.alert('Could Not Get Calendars');
          });
      },

      onCancel() {
        this.dialogActive = false;
      },

      async onConfirm() {
        let confirm = await this.deleteCal()
        if (confirm) {
          this.removeFromTable();
        }
        this.dialogActive = false;
      },

      callDelete(id) {
        this.calID = id;
        this.mdTitle = 'Delete Calendar';
        this.mdDescription = `Are you sure you want to delete this calendar? <br> This may affect reports.`;
        this.dialogActive = true;
      },

      removeFromTable() {
        const idx = this.calendars.findIndex((cal) => cal.id === this.calID);
        if (idx > -1) {
          this.calendars.splice(idx, 1);
        }
      },

      async deleteCal() {
        await http.delete(`/api/calender/${this.calID}`)
          .then(() => {
            this.$awn.success('Successfully deleted Calendar');
            return true;
          }).catch(() => {
            this.$awn.alert('Could Not Delete Calendars');
            return false;
          });
      },

      searchOnTable () {
        this.searched = searchByName(this.calendars, this.search);
      },

      onSelect(item) {
        if (item) {
          this.selectedCalendar = item;
          this.standard === false ? this.$store.dispatch('updateCalendar', item) : null;
        }
      },
    },

    created () {
      this.searched = this.calendars;
    },

    beforeMount() {
      this.determineAction();
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

  .md-table {
    padding-top: 10px;
    margin: 0 auto;
    text-align: left;
    width: auto;
    max-width: 50%;
  }

  .md-table-cell {
    text-align: left;
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

  .topLeft {
    position: absolute;
    right:    0;
    top: 100;
  }
</style>
