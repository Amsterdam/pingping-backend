export const state = {
  items: [],
};

export const mutations = {
  setItems(state, items) {
    state.items = items;
  },

  removeItem(state, id) {
    state.items = state.items.filter((i) => i.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
