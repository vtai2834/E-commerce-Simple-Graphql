const { localStorage } = global.window;

const LocalStorage = {
  logout: () => {
    localStorage.clear();
  },
};

export default LocalStorage;
