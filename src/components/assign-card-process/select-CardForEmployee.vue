<template>
  <div>
    <md-button class="md-icon-button md-dense topLeft" v-if="standard !== false" @click="help">
      <md-tooltip md-direction="left">Click Me For Help</md-tooltip>
      <md-icon>help_outline</md-icon>
    </md-button>
    <br>
    <div class="center">
      <!-- Part of process -->
      <div v-if="showNorm === false">
        <md-table v-model="searched" md-sort="id" md-sort-order="asc" md-card md-fixed-header
                  @md-selected="onSelect" class="table box">
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h1 class="md-title"> {{ title }} </h1>
            </div>

            <md-field md-clearable class="md-toolbar-section-end">
              <md-tooltip md-direction="bottom">Type / Scan</md-tooltip>
              <md-input placeholder="Search by Card Number..." v-model="search" @input="searchOnTable"/>
            </md-field>
          </md-table-toolbar>

          <md-table-empty-state
            md-label="No unused cards found"
            :md-description="`No card found for this search term. Try a different search term or create a new card.
                              Please press 'BACK' to create a new card`">
          </md-table-empty-state>
          <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
            <md-table-cell md-label="Card Number" md-sort-by="card_no">{{ item.card_no }}</md-table-cell>
          </md-table-row>
        </md-table>
      </div>
      <!-- Standard Process -->
      <div v-if="showNorm === true">
        <md-table v-model="searched" md-sort="id" md-sort-order="asc" md-card md-fixed-header
              @md-selected="onSelect" class="table" id="viewCardsST">
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title"> {{ title }} </h1>
            <md-checkbox v-model="showCreated" @click="changeView" v-if="standard !== false">
              Show Created Cards
            </md-checkbox>
          </div>

          <md-field md-clearable class="md-toolbar-section-end">
            <md-tooltip md-direction="bottom">Type / Scan</md-tooltip>
            <md-input placeholder="Search by Card Number..." v-model="search" @input="searchOnTable"/>
          </md-field>
        </md-table-toolbar>

        <md-table-empty-state
          md-label="No Assigned Employees Found"
          :md-description="`No Assigned Employees found for this search term. Try a different search term or create assign an employee.`">
          <md-button class="md-primary md-raised" to="/management/assignCardProcess">Assing Employee to card</md-button>
        </md-table-empty-state>
          <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
            <!-- NOT SHOW CREATED CARDS -->
            <md-table-cell v-if="!showCreated" md-label="Employee Name" md-sort-by="name" md-numeric>
              {{ item.name }}
            </md-table-cell>
            <md-table-cell v-if="!showCreated" md-label="Assigned Card" md-sort-by="card_no" md-numeric>
              {{ item.card_no }}
            </md-table-cell>
            <md-table-cell v-if="!showCreated" md-label="Deactivate Card" md-sort-by="active">
              <md-button class="md-raised" style="color: orange" v-if="item.active === 1" @click="callDeactivate(item.id)">
                Deactivate
              </md-button>
              <md-button class="md-raised" style="color: orange" v-if="item.active === 0" @click="callActivate(item.id)">
                Activate
              </md-button>
            </md-table-cell>
            <md-table-cell v-if="!showCreated" md-label="Unassign Card">
              <md-button class="md-raised md-accent" @click="callUnassign(item.id)">
                Unassign
              </md-button>
            </md-table-cell>
            <!-- SHOW CREATED CARDS -->
            <md-table-cell v-if="showCreated" md-label="Card No" md-sort-by="card_no" md-numeric>
              {{ item.card_no }}
            </md-table-cell>
            <md-table-cell v-if="showCreated">
              <md-button class="md-raised md-accent" >
                Delete
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
        <v-tour name="viewCards" :steps="steps"></v-tour>

        <md-dialog-confirm
        :md-active.sync="active"
        :md-title= mdTitle
        :md-content= mdDescription
        md-confirm-text="Agree"
        md-cancel-text="Cancel"
        @md-cancel="onCancel"
        @md-confirm="onConfirm" />
      </div>

    </div>
  </div>
</template>

<script>
  import http from '../../../public/app.service.ts';

  const toLower = text => {
    return text.toString().toLowerCase();
  }

  const searchByCardNo = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.card_no).includes(toLower(term)));
    }
    return items
  }

  export default {
    name: 'select-CardForEmployee',
    // Angular equivaent of INPUT
    props: {
      standard: true,
    },
    //  Variables
    data() {
      return {
        steps: [
          {
            target: '#viewCardsST',
            content: `This is where all created cards can be updated / Unassigned.`,
            params: {
              placement: 'left'
            }
          }
        ],
        cardData: [],
        selectedCard: null,
        search: null,
        searched: [],
        title: '',
        active: false,
        confirmedUnassign: false,
        mdTitle: '',
        mdDescription: '',
        state: '',
        showNorm: false,
        itemID: '',
        showCreated: false,
      }
    },

    watch: {
      showCreated: {
        handler() {
          this.changeView();
        }
      }
    },

    methods: {
      async changeView() {
        if (this.showCreated) {
          this.title = 'Unlinked Cards';
          this.searched = [];
          this.cardData = [];
          this.getUnlinkedCards();
          this.searched = this.cardData;
        } else {
          this.title = 'Employee Cards';
          this.searched = [];
          this.cardData = [];
          this.getCards();
          this.searched = this.cardData;
        }
      },

      help() {
        this.$tours['viewCards'].start();
      },

      cancelAdd() {
        this.$emit('canceled');
      },

      callDeactivate(itemID) {
        this.mdTitle = 'Deactivate Card';
        this.mdDescription = 'Are you sure you want to deactivate this card?';
        this.active = true;
        this.state = 'Deactivate';
        this.itemID = itemID;
      },

      callActivate(itemID) {
        this.mdTitle = 'Activate Card';
        this.mdDescription = 'Are you sure you want to activate this card?';
        this.active = true;
        this.state = 'Activate';
        this.itemID = itemID;
      },

      callUnassign(itemID) {
        this.mdTitle = 'Unassign Employee';
        this.mdDescription = 'Are you sure you want to unassign the employee from the card?';
        this.active = true;
        this.state = 'Unassign';
        this.itemID = itemID;
      },

      changeActiveOnTable(active) {
        let selectedItem = this.cardData.find(item => item.id === this.itemID);
        if (active === 0 || active === 1) {
          for (let k = 0; k < this.cardData.length; k++) {
            if (this.cardData[k].id === this.itemID) {
              this.cardData[k].active = active;
            }
          }
        } else if (active === 'Unassign') {
          const idx = this.cardData.findIndex((card) => card.id === this.itemID);
          if (idx > -1) {
            this.cardData.splice(idx, 1);
          }
        }
      },

      async onConfirm (active) {
        if (this.state === 'Deactivate') {
          let confirm = await this.changeActiveState(false);
          if (confirm) {
            this.changeActiveOnTable(0);
          }
        } else if (this.state === 'Activate') {
          let confirm = await this.changeActiveState(true);
          if (confirm) {
            this.changeActiveOnTable(1);
          }
        } else if (this.state === 'Unassign') {
          let confirm = await this.unAssignEmployee();
          if (confirm) {
            this.changeActiveOnTable('Unassign');
          }
        }
        this.confirmedUnassign = true;
      },

      onCancel () {
        this.confirmedUnassign = false;
      },

      async unAssignEmployee() {
        if (this.itemID) {
          return await http.delete(`/api/employee_card/${this.itemID}`)
            .then(() => {
              this.$awn.success('Successfully Unassigned Employee');
              return true;
            }).catch(() => {
              this.$awn.alert('Could Not Unassign Employee');
            });
        }
      },

      async changeActiveState(active) {
        return await http.put(`/api/employee_card/${this.selectedCard.id}`, {
          'id': this.selectedCard.id,
          'employee_id': this.selectedCard.employee_id,
          'card_id': this.selectedCard.card_id,
          'issued_at': this.selectedCard.issued_at,
          'active': active
        })
        .then(() => {
          this.$awn.success('Successfully Deactivated Card');
          return true;
        }).catch(() => {
          this.$awn.alert('Could Not Deactivate Card');
          return false
        });
      },

      async getCards() {
        return await http.get(`/api/employee_card/`)
          .then((res) => {
            res.data.forEach(d => {
              let data = {
                'id': d.id,
                'employee_id': d.employee_id,
                'card_id': d.card_id,
                'issued_at': d.issued_at,
                'active': d.active,
                'name': d.name,
                'card_no': d.card_no
              }
              this.cardData.push(data);
            });
          return true;
        }).catch((err) => {
          let error = err.toString().indexOf('404');
          error > -1 ? this.$awn.warning('No created employee cards, please assign a card to an employee ') :
              this.$awn.alert('Could Not Get Cards');
          return false;
        });
      },

      determineMsg() {
        if (this.standard !== false) {
          this.title = 'Employee Cards';
          this.showNorm = true;
          this.getCards();
        } else if (this.standard === false) {
          this.showNorm = false;
          this.title = 'Select Unused Card';
          this.getUnlinkedCards();
        }
      },

      async getUnlinkedCards() {
        await http.get(`/api/card/unlinked/cards`)
          .then((res) => {
            res.data.forEach(d => {
              let data = {
                'id': d.id,
                'card_no': d.card_no
              }
              this.cardData.push(data);
            });
          return true;
        }).catch((err) => {
          this.$awn.alert('Could Not Get Cards');
          return false;
        });
      },

      onSelect(item) {
        if (item) {
          this.selectedCard = item;
          if (this.standard === false) {
            this.$store.dispatch('updateCardNo', this.selectedCard.card_no);
            this.$store.dispatch('updateAlreadyCreated', true);
          }
        }
      },

      newCard () {
        this.$router.push('/management/addCard');
      },

      searchOnTable () {
        this.searched = searchByCardNo(this.cardData, this.search);
      }
    },

    created () {
      this.searched = this.cardData;
    },

    beforeMount() {
      this.determineMsg();
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
    width: 50%;
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
