<template>
  <div>

  </div>
</template>

<script>
  export default {
    name: 'clocker',
    // Angular equivaent of INPUT
    props: {
    },
    //  Variables
    data() {
      return {

      }
    },

    methods: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
// STANDARD TABLE LAYOUT
      // <md-table v-model="searched" md-sort="id" md-sort-order="asc" md-card md-fixed-header
      //           @md-selected="onSelect" class="table">
      //   <md-table-toolbar>
      //     <div class="md-toolbar-section-start">
      //       <h1 class="md-title"> Created Calenders </h1>
      //     </div>

      //     <md-field md-clearable class="md-toolbar-section-end">
      //       <md-input placeholder="Search by calendar name..." v-model="search" @input="searchOnTable"/>
      //     </md-field>
      //   </md-table-toolbar>

      //   <md-table-empty-state
      //     md-label="No calendar's found"
      //     :md-description="`No calendar found for this '${search}' query. Try a different search term or create a new calendar.`">
      //     <md-button class="md-primary md-raised">Create Calendar</md-button>
      //   </md-table-empty-state>

      //   <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
      //     <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
      //     <md-table-cell md-label="Description" md-sort-by="description">{{ item.description }}</md-table-cell>
      //     <md-table-cell md-label="Update" >
      //       <md-button class="md-raised md-primary">
      //         Update
      //       </md-button>
      //     </md-table-cell>
      //     <!-- Activate / Deactivate -->
      //     <md-table-cell md-label="Delete" >
      //       <md-button class="md-raised md-accent">
      //         Delete
      //       </md-button>
      //     </md-table-cell>
      //   </md-table-row>
      // </md-table>





























      // <v-tour name="addCard" :steps="steps"></v-tour>

      // <md-button v-if="standard !== false" @click="help">
      //   Help
      // </md-button>

      // steps: [
      //   {
      //     target: '#addCardS',
      //     content: `This is where all cards that are going to be used to clock in and out will be created.`,
      //     params: {
      //       placement: 'left'
      //     }
      //   },
      //   {
      //     target: '.tag',
      //     content: `Simply scan / enter the RFID card at hand`,
      //     params: {
      //       placement: 'right'
      //     }
      //   },
      //   {
      //     target: '#cancel',
      //     content: `If you decide that you dont want to create the card, simply click here to cancel the process`,
      //     params: {
      //       placement: 'bottom'
      //     }
      //   },
      //   {
      //     target: '#add',
      //     content: `Once the information is entered, simply click here and your card will be created!`,
      //     params: {
      //       placement: 'bottom'
      //     }
      //   },
      // ],


      // help() {
      //   this.$tours['addCard'].start();
      // },