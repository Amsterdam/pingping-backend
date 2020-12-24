const RequestUtil = {
  errorHook(error) {
    if (error.message === 'GraphQL error: unauthorized') {
      window.localStorage.removeItem('pp:token');
      window.alert('unauthorized');
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  },
};

export default RequestUtil;
