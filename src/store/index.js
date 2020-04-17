import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import {
  getSelectedPlan
} from '../../services/listing'
import routes from '../routes'

const SHARED = "shared";
const ENTIRE = "entire";
const STUDIO = "studio";
const MONTHLY = "monthly";
const DAILY = "daily";
const QUARTERLY = "quarterly";
const BIANNUALLY = "biannually";

export const store = new Vuex.Store({
  state: {
    level: null,
    step: 1,
    bedroomCount: 0,
    selectedSpaceType: "",
    onlyOneBed: false,
    verifiedStatus: false,
    login: false,
    subType: null,
    quarterly: null,
    biannually: null,
    entireSpace: false,
    coSharedSpace: false,
    rlsValue: false,
    dlsValue: false,
    apartmentId: null

  },
  mutations: {
    incrementLevel(state, payload) {
      state.level += payload
    },
    decrementLevel(state, payload) {
      state.level -= payload
    },
    incrementStep(state, payload) {
      state.step += payload
    },
    setStep(state, payload) {
      state.step = payload
    },
    setSelectedSpaceType(state, payload) {
      state.selectedSpaceType = payload
    },
    setLevel(state, payload) {
      state.level = payload
    },
    decrementStep(state, payload) {
      state.step -= payload
    },
    bedroomCountIncrement(state, payload) {
      state.bedroomCount += payload;
    },
    bedroomCountDecrement(state, payload) {
      state.bedroomCount -= payload;
    },
    updateSpaceType(state, message) {
      state.selectedSpaceType = message
    },
    updateSubType(state, message) {
      state.subType = message
    },
    updateQuarterly(state, message) {
      state.quarterly = message
    },
    updateBiannually(state, message) {
      state.biannually = message
    },
    updateEntire(state, message) {
      state.entireSpace = message
    },
    updateShared(state, message) {
      state.coSharedSpace = message
    },
    updateRlsValue(state, message) {
      state.rlsValue = message
    },
    updateDlsValue(state, message) {
      state.dlsValue = message
    },
    updateApartmentId(state, message) {
      state.apartmentId = message
    },
  },
  actions: {
    incrementActionLevel(context, payload) {
      context.commit('incrementLevel', payload)
    },
    decrementActionLevel(context, payload) {
      context.commit('decrementLevel', payload)
    },
    incrementAction(context, payload) {
      context.commit('incrementStep', payload)
    },
    decrementAction(context, payload) {
      context.commit('decrementStep', payload)
    },
    bedroomIncrementAction(context, payload) {
      context.commit('bedroomCountIncrement', payload)
    },
    bedroomDecrementAction(context, payload) {
      context.commit('bedroomCountDecrement', payload)
    },

    getSelectedPlan(context) {
      getSelectedPlan(routes.currentRoute.params.id)
        .then(data => {
          let returnPlans;
          let apartmentId;
          if (data.data.success) {
            let returnedData = data.data.data;

            if (returnedData.space_type == ENTIRE || returnedData.space_type == STUDIO) {
              context.commit('updateEntire', true);
              context.commit('updateShared', false);
              returnPlans = data.data.data.Apartment.Plans;
              apartmentId = data.data.data.Apartment.uuid;
              context.commit('updateApartmentId', apartmentId);
            }
            if (returnedData.space_type == SHARED) {
              context.commit('updateShared', true);
              context.commit('updateEntire', false);
              returnPlans = data.data.data.Rooms[0].Apartment.Plans;
              apartmentId = data.data.data.Rooms[0].Apartment.uuid;
              context.commit('updateApartmentId', apartmentId);
            }

            returnPlans.filter(plan => {
              if (plan.name == DAILY) {
                context.commit('updateDlsValue', true);
                context.commit('updateRlsValue', false);
              }
              if (plan.name == MONTHLY) {
                context.commit('updateDlsValue', false);
                context.commit('updateRlsValue', true);
              }
              if (plan.name == QUARTERLY) {
                context.commit('updateQuarterly', true);
              }
              if (plan.name == BIANNUALLY) {
                context.commit('updateBiannually', true);
              }
            });

          }
        })
        .catch(err => {
          throw err;
        });
    }
  },
  getters: {
    step(state) {
      return state.step
    },
    level(state) {
      return state.level
    },
    bedroomCount(state) {
      return state.bedroomCount
    }
  }
})
