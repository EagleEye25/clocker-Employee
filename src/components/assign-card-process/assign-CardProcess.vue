<template>
  <div>
    <h1 style="color:white">Assign Card To Employee</h1>
    <br>
    <div>
      <md-steppers :md-active-step.sync="active" md-vertical md-linear md-dynamic-height>
      <md-step id="first" md-label="Add Card" :md-done.sync="first" :md-editable="editable">
        <addCard v-bind:standard=false v-if="!showCreatedCards"></addCard>
        <!-- Displays if already created is clicked -->
        <selectCardForEmployee v-if="showCreatedCards && !cancelAdd" @canceled='cancelAddInSelect' v-bind:standard=false></selectCardForEmployee>
        <md-button style="color: yellow;" @click="showCreatedCards = true, cancelAdd = false" v-if="!showCreatedCards">
          Already created card
        </md-button>
        <md-button class="md-raised md-accent" v-if="showCreatedCards === true" @click="showCreatedCards = false, clearStore">
          Back
        </md-button>
        <md-button class="md-raised md-primary" v-if="showCreatedCards === true" @click="setDone('first', 'second')"
                  :disabled='!this.cardNumber'>
          Continue
        </md-button>
      </md-step>

      <md-step id="second" md-label="Assign Card To Employee" :md-error="secondStepError"
                :md-done.sync="second" :md-editable="editable">
        <viewEmployee v-if="active === 'second'" v-bind:standard=false v-bind:calUnAssigned=false></viewEmployee>
        <md-button class="md-raised md-primary" @click="setDone('second', 'third')"
                    :disabled='!$store.getters.employeeInfo'>
          Continue
        </md-button>
      </md-step>

      <md-step id="third" md-label="Complete" :md-done.sync="third">
        <div v-if="employeeName">
          <md-list>
            <md-list-item class="center">
              <md-icon>perm_identity</md-icon>
              <span class="md-list-item-text">Employee:
                <br>
                <div style="margin-left:2em">
                  <span>Name: {{ employeeName }}</span>
                </div>
              </span>
            </md-list-item>
            <br>
            <md-divider class="md-inset"></md-divider>
            <br>
            <md-list-item class="center">
              <md-icon>credit_card</md-icon>
              <span class="md-list-item-text">Card Number:
                <br>
                <div style="margin-left:2em">
                  <span>Name: {{ cardNumber }}</span>
                </div>
              </span>
            </md-list-item>
          </md-list>
        </div>
        <div v-if="completed">
          <h1 v-if="completed">Successfully Assigned Card To Employee</h1>
          <md-button class="md-raised" style="color: lime;" to="/management">Back To Management</md-button>
          <md-button class="md-raised" style="color: yellow;" @click="addAnother">Assign Another Employee</md-button>
        </div>
        <md-button class="md-raised md-primary" v-if="!completed" @click="assignEmployee">Assign</md-button>
      </md-step>

      </md-steppers>
    </div>
  </div>
</template>

<script>
  import http from '../../../public/app.service.ts';
  import addCard from '../add-Card.vue';
  import selectCardForEmployee from './select-CardForEmployee.vue';
  import viewEmployee from '../view-Employee.vue';

  export default {
    name: 'assign-CardProcess',
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
        secondStepError: null,
        showCreatedCards: false,
        cardID: null,
        completed: false,
        editable: true,
        cancelAdd: false,
      }
    },

    components: {
      addCard,
      selectCardForEmployee,
      viewEmployee
    },

    watch: {
      cardNumber: {
        handler(newValue) {
          if (newValue) {
            if (!this.showCreatedCards) {
              this.setDone('first', 'second');
            }
          }
        }
      }
    },

    methods: {
      cancelAddInSelect() {
        this.showCreatedCards = false
        this.cancelAdd = true;
      },

      async getCardID() {
        return await http.get(`/api/card/card_no/${this.cardNumber}`)
          .then((resp) => {
            this.cardID = resp.data.id;
            return true;
          }).catch(() => {
            return false;
          });
      },

      async assignEmployee() {
        if (await this.getCardID()) {
          http.post(`/api/employee_card/create`, {
            'employee_id': this.employeeID,
            'card_id': this.cardID,
            'issued_at': Date.now(),
            'active': true
          }).then(() => {
            this.completed = true;
            this.editable = false;
            this.$awn.success('Successfully Assigned Card');
          }).catch(() => {
            this.$awn.alert('Could Not Assign Card');
          })
        }
      },

      clearStore() {
        this.$store.dispatch('updateCardNo', null);
        this.$store.dispatch('updateAlreadyCreated', null);
        this.$store.dispatch('updateEmployeeInfo', null);
      },

      addAnother() {
        this.completed = false;
        this.editable = true;
        this.active = 'first';
        this.first = false;
        this.second = false;
        this.third = false;
        this.clearStore();
        this.showCreatedCards = false;
      },

      setDone (id, index) {
        this[id] = true;
        this.secondStepError = null
        if (index) {
          this.active = index;
        }
      },

      setError () {
        this.secondStepError = 'This is an error!';
      },
    },

    beforeMount() {
      this.clearStore();
    },

    computed: {
      employeeName() {
        return this.$store.getters.employeeName;
      },

      employeeID() {
        return this.$store.getters.employeeInfo.id;
      },

      cardNumber() {
        return this.$store.getters.cardNo;
      },

      alreadyCreated() {
        return this.$store.getters.alreadyCreated;
      },
      addCanceled() {
        return this.$store.getters.cancelAddEmp;
      }
    },

    destroyed() {
      this.clearStore();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    /* width: 50%; */
  }

</style>
