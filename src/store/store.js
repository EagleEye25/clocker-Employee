import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cardNo: null,
    employeeInfo: null,
    alreadyCreated: null,
    created: null,
    cancelAddEmp: null,
    addEmp: null,
    updateEmp: null,
    reasonData: null,
    calendarData: null,
    calendarTime: null,
    loginInfo: null,
  },
  mutations: {
    changeCardNo(state, cardNo) {
      state.cardNo = cardNo
    },
    changeCreated(state, created) {
      state.created = created
    },
    changeAlreadyCreated(state, alreadyCreated) {
      state.alreadyCreated = alreadyCreated
    },
    changeEmployeeInfo(state, employeeInfo) {
      state.employeeInfo = employeeInfo
    },
    changeCancelAddEmp(state, cancelAddEmp) {
      state.cancelAddEmp = cancelAddEmp
    },
    changeAddEmp(state, addEmp) {
      state.addEmp = addEmp
    },
    changeUpdateEmp(state, updateEmp) {
      state.updateEmp = updateEmp
    },
    changeReasonData(state, reasonData) {
      state.reasonData = reasonData
    },
    changeCalendarData(state, calendarData) {
      state.calendarData = calendarData
    },
    changeCalendarTime(state, calendarTime) {
      state.calendarTime = calendarTime
    },
    changeLoginInfo(state, loginInfo) {
      state.loginInfo = loginInfo
    },
  },
  getters: {
    cardNo: state => state.cardNo ? state.cardNo || '' : '',
    created: state => state.created ? state.created || '' : '',
    alreadyCreated: state => state.alreadyCreated ? state.alreadyCreated || '' : '',
    employeeInfo: state => state.employeeInfo ? state.employeeInfo || '' : '',
    employeeName: state => state.employeeInfo ? state.employeeInfo.name || '' : '',
    cancelAddEmp: state => state.cancelAddEmp ? state.cancelAddEmp || '' : '',
    addEmp: state => state.addEmp ? state.addEmp || '' : '',
    updateEmp: state => state.updateEmp ? state.updateEmp || '' : '',
    reasonData: state => state.reasonData ? state.reasonData || '' : '',
    calendarData: state => state.calendarData ? state.calendarData || '' : '',
    calendarTime: state => state.calendarTime ? state.calendarTime || '' : '',
    loginInfo: state => state.loginInfo ? state.loginInfo || '' : ''
  },
  actions: {
    updateCardNo(ctx, num) {
      ctx.commit('changeCardNo', num);
    },
    updateEmployeeInfo(ctx, employeeInfo) {
      ctx.commit('changeEmployeeInfo', employeeInfo);
    },
    updateAlreadyCreated(ctx, created) {
      ctx.commit('changeAlreadyCreated', created);
    },
    updateChangeCreated(ctx, created) {
      ctx.commit('changeCreated', created);
    },
    updateChangeCancelAddEmp(ctx, cancel) {
      ctx.commit('changeCancelAddEmp', cancel);
    },
    updateAddEmp(ctx, addEmp){
      ctx.commit('changeAddEmp', addEmp)
    },
    updateEmp(ctx, updateEmp){
      ctx.commit('changeUpdateEmp', updateEmp)
    },
    updateReason(ctx, updateReason){
      ctx.commit('changeReasonData', updateReason)
    },
    updateCalendar(ctx, updateCalendar){
      ctx.commit('changeCalendarData', updateCalendar)
    },
    updateCalendarTime(ctx, updateCalendarTime){
      ctx.commit('changeCalendarTime', updateCalendarTime)
    },
    updateLoginInfo(ctx, updateLoginInfo){
      ctx.commit('changeLoginInfo', updateLoginInfo)
    },
  }
});

export default store;