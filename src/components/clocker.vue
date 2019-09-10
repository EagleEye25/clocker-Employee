<template>
  <div @click.stop.prevent="focusInput" @touch.stop.prevent="focusInput">
    <!-- <div> -->
    <div v-if="action === 'Clock_In' || action === null || action === 'completed'">
      <img class="center" src="../../public/pictures/lock.png" alt="Lock Image">
      <!-- Hides input off screen -->
      <!-- <div class="outer"> -->
        <!-- <div class="inner"> -->
          <input v-focus v-model="tag" type="text" @keyup.enter="onEnter" id="cardInput">
        <!-- </div> -->
      <!-- </div> -->
      <h1 style="color:white;">{{ message }}</h1>
    </div>
    <div v-if="action === 'Clock_Out'" class="center">
      <md-table v-model="reasons" md-card @md-selected="onSelect" md-sort="id"
                md-sort-order="asc" class="table" md-fixed-header>

      <md-table-toolbar>
        <h1 class="md-title">Clock Out Reason</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
        <md-table-cell md-label="Number" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Description" md-sort-by="description">{{ item.description }}</md-table-cell>
        <md-table-cell md-label="Work Related" md-sort-by="workW">{{ item.workW }}</md-table-cell>
      </md-table-row>
    </md-table>
    </div>
    <md-dialog-alert
      :md-click-outside-to-close=false
      :md-active.sync="showDialogD"
      md-title=""
      :md-content=dialogMsg
      md-confirm-text=""
    />
    <div>
      <md-dialog-prompt
        :md-active.sync="active"
        md-title="Change Server Address"
        md-input-placeholder="Server Address"
        v-model="serverAddy"
        md-confirm-text="Change"
        md-cancel-text="Cancel"
        @md-confirm="onConfirm" />

      <md-button @click="active = true, serverAddy = null">
        <md-icon>settings</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
  import http from '../../public/app.service.ts';
  import axios from 'axios';

  export default {
    name: 'clocker',
    // Angular equivaent of INPUT
    props: {
    },
    //  Variables
    data() {
      return {
        tag: '',
        message: 'Please Scan Your Employee Card',
        action: null,
        reasons: [],
        selectedReason: '',
        response: null,
        determineProcessing: false,
        inProcessing: false,
        showDialogD: false,
        dialogMsg: '',
        active: false,
        serverAddy: null,
      }
    },

    methods: {
      async onConfirm() {
        return await this.$awn.asyncBlock(axios.get(`${this.serverAddy}/app/test/`)
          .then((result) => {
            this.$awn.success('Valid Server Connection!');
            window.localStorage.setItem('serverAddy', this.serverAddy);
            return true
          }).catch((err) => {
            this.$awn.alert('Invalid Server Connection!');
            return false
          }), null, null);
      },

      onEnter() {
        this.determineAction();
      },

      clockIn(resp) {
        http.post(`/app/clocking/clock_in`, {
          'employee_id': resp.employee_id,
          'reason_id': null,
          'clock_in': Date.now(),
          'clock_out': null,
          'overtime': null
        }).then((resp) => {
          if (resp.status === 201) {
            this.success = 'CLOCKED IN';
            this.showDialog('InSuccess');
            this.tag = '';
          }
        }).catch((error) => {
          if (error) {
            this.showDialog('InFail');
          }
        });
      },

      clockOut(resp, reasonID) {
        http.put(`/app/clocking/clock_out/${resp.id}`, {
        'id': resp.id,
        'employee_id': resp.employee_id,
        'reason_id': reasonID,
        'clock_in': resp.clock_in,
        'clock_out': Date.now(),
        'overtime': null
      })
      .then(() => {
        this.action = 'completed'
        this.showDialog('OutSuccess');
        this.tag = '';
      }).catch(() => {
        this.showDialog('InFail');
      });
      },

      getReasons() {
        http.get(`/api/reason/`)
        .then((res) => {
          res.data.forEach(d => {
            let bool = 'no';
            if (d.work !== 0) {
              bool = 'yes'
            }
            let data = {
              'id': d.id,
              'description': d.description,
              'work': d.work,
              'workW': bool
            }
            this.reasons.push(data);
          });
          this.reasons.toString();
        }).catch(() => {

        });
      },

      onSelect(item) {
        this.selectedReason = item;
        if (this.selectedReason) {
          this.clockOut(this.response, this.selectedReason.id)
        }
      },

      determineAction() {
      // Determine if backend should clock in or out employee
      http.get(`/app/clocking/determineAction/${this.tag}`)
        .then((res) =>{
          console.log(res);
          if (res.status === 200 && res.data) {
            this.action = res.data.action;
            this.response = res.data;
            switch(this.action) {
              case 'Clock_In': {
                this.clockIn(res.data);
                break;
              }
              case 'Clock_Out': {
                this.getReasons();
                break;
              }
            }
          }
        }).catch(e => {
          console.log('here', e);
          let error = e.toString().indexOf('Network Error');
          if (error) {
            this.showDialog('NetworkError');
          }
        });
      },

      focusInput() {
        if (!this.showDialogD) {
          const el = document.querySelector('#cardInput');
          if (el) {
            el.focus();
          }
        }
      },

      showDialog(type) {
        this.tag = null;
        switch(type) {
          case 'InSuccess': {
            this.dialogMsg = 'Successfully Clocked In!'
            break;
          }
          case 'InFail': {
            this.dialogMsg = 'Please scan employee card again...';
            break;
          }
          case 'OutSuccess': {
            this.dialogMsg = 'Successfully Clocked Out!'
            break;
          }
          case 'OutFail': {
            this.dialogMsg = 'Please select a reason again...';
            break;
          }
          case 'NetworkError': {
            this.dialogMsg = 'No connection to network host';
          }
        }
        this.showDialogD = true;
        setTimeout(() =>{
          this.showDialogD = false;
          this.focusInput();
        }, 2000);
      },

    },

    directives: {
      focus: {
        // directive definition
        inserted: function (el) {
          el.focus()
        }
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  div {
    background-color: rgb(48,48,48);
  }

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    /* width: 50%; */
  }

  .outer {
    overflow: hidden;
    position: relative;
  }

  .inner {
    position: absolute;
    height: 100px;
    width: 100px;
    right: -50px;
    top: 50px;
  }

  .md-table {
    display: block;
    padding-top: 10px;
    margin: 0 auto;
    text-align: left;
    position: absolute;
    top: 50%;
    left: 50%;
    /* bring your own prefixes */
    transform: translate(-50%, -50%);
    /* width: 50%; */
  }

  .md-table-cell {
    text-align: center;
  }

  .md-table-toolbar {
    text-align: center;
  }

  .md-content {
    text-align: center;
  }
</style>
