<template>
  <div class="center">
    <md-button class="md-icon-button md-dense topLeft" @click="help">
      <md-tooltip md-direction="left">Click Me For Help</md-tooltip>
      <md-icon>help_outline</md-icon>
    </md-button>
    <br>
    <div>
      <md-table v-model="searched" md-sort="id" md-sort-order="asc" md-card md-fixed-header
                @md-selected="onSelect" class="table box" v-if="!showReason" id="createdReasonsST">
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title"> Reasons for Clocking Out </h1>
          </div>

          <md-field md-clearable class="md-toolbar-section-end">
            <md-input placeholder="Search by reason description..." v-model="search" @input="searchOnTable"/>
          </md-field>
        </md-table-toolbar>

        <md-table-empty-state
          md-label="No reasons found"
          :md-description="`No reason found for this search term. Try a different search term or create a new reason.`">
          <md-button class="md-primary md-raised" @click="showReason = true">Create Reason</md-button>
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
          <md-table-cell md-label="Description" md-sort-by="description">{{ item.description }}</md-table-cell>
          <md-table-cell md-label="Work Related" md-sort-by="work">{{ item.work }}</md-table-cell>
          <md-table-cell md-label="Update" >
            <md-button class="md-raised md-primary" @click="updateReason(item)">
              Update
            </md-button>
          </md-table-cell>
          <!-- Activate / Deactivate -->
          <md-table-cell md-label="Active State" >
            <md-button @click="callDeactivate" v-if="item.active === 1" class="md-raised md-accent">
              Deactivate
            </md-button>
            <md-button @click="callActivate" v-if="item.active === 0" class="md-raised md-accent">
              Activate
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
      <v-tour name="viewReasons" :steps="steps"></v-tour>
      <addReason v-bind:standard=false v-if="showReason" @canceled="showReason = false" @added="refresh"></addReason>
      <md-dialog-confirm
        :md-active.sync="dialogActive"
        :md-title= mdTitle
        :md-content= mdDescription
        md-confirm-text="Agree"
        md-cancel-text="Cancel"
        @md-cancel="onCancel"
        @md-confirm="onConfirm" />
    </div>
  </div>
</template>

<script>
  import http from '../../public/app.service.ts';
  import addReason from '../components/add-Reason.vue';
 const toLower = text => {
    return text.toString().toLowerCase();
  }

  const searchByReason = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.description).includes(toLower(term)));
    }
    return items
  }

  export default {
    name: 'view-Reasons',
    // Angular equivaent of INPUT
    props: {
    },
    //  Variables
    data() {
      return {
        steps: [
          {
            target: '#createdReasonsST',
            content: `This is where all created reasons can be updated / deleted.`,
            params: {
              placement: 'left'
            }
          }
        ],
        selectedReason: null,
        search: null,
        searched: [],
        reasons: [],
        dialogActive: false,
        mdTitle: '',
        mdDescription: '',
        state: false,
        confirmedUnassign: false,
        showReason: false,
      }
    },

    components: {
      addReason
    },

    methods: {
      help() {
        this.$tours['viewReasons'].start();
      },

      updateReason(item) {
        this.$store.dispatch('updateReason', item);
        this.$router.push('/management/addReason');
      },

      callDeactivate() {
        this.mdTitle = 'Deactivate Reason';
        this.mdDescription = 'Are you sure you want to deactivate this reason?';
        this.dialogActive = true;
        this.state = false;
      },


      callActivate() {
        this.mdTitle = 'Activate Reason';
        this.mdDescription = 'Are you sure you want to activate this reason?';
        this.dialogActive = true;
        this.state = true;
      },

      searchOnTable () {
        this.searched = searchByReason(this.reasons, this.search);
      },

      onCancel() {
        this.confirmedUnassign = false;
      },

      changeActiveOnTable() {
        for (let k = 0; k < this.reasons.length; k++) {
          if (this.reasons[k].id === this.selectedReason.id) {
            let state = 0;
            this.state ? state = 1 : state  = 0
            this.reasons[k].active = state
          }
        }
      },

      async onConfirm() {
        let confirm = await this.updateActive()
        if (confirm) {
          this.changeActiveOnTable()
        }
        this.confirmedUnassign = true;
      },

      async updateActive() {
        let work = false;
        this.selectedReason.work ? work = true : work = false;
        return await http.put(`/api/reason/${this.selectedReason.id}`, {
          'id': this.selectedReason.id,
          'description': this.selectedReason.description,
          'work': work,
          'active': this.state
        }).then(() => {
          this.$awn.success('Successfully Updated Reason State');
          return true;
        }).catch(() => {
          this.$awn.alert('Could Not Update Reason State');
          return false;
        });
      },

      async refresh() {
        this.search = null;
        this.searched = [];
        this.reasons = [];
        await this.getReasons();
        this.showReason = false;
      },

      async getReasons() {
        return await http.get(`/api/reason`)
          .then((resp) => {
            resp.data.forEach(d => {
              let work = '';
              (d.work === 0) ? work = 'No' : work = 'yes';
              let data = {
                'id': d.id,
                'description': d.description,
                'work': work,
                'active': d.active
              }
              this.reasons.push(data);
            });
          }).catch((err) => {
            let error = err.toString().indexOf('404');
            (error > -1) ? this.$awn.warning('No Reasons Please Add A Reason') :
            this.$awn.alert('Could Not Get Reasons');
          });
      },

      onSelect(item) {
        if (item) {
          this.selectedReason = item;
        }
      },
    },

    created () {
      this.searched = this.reasons;
    },

    beforeMount() {
      this.getReasons();
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
    width: 35%;
  }

  .md-table-cell {
    text-align: center;
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
