const initState = {};

const pollReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_POLL_SUCCESS":
      console.log("create post success");
      return state;
    case "CREATE_POLL_ERROR":
      console.log("create post error");
      return state;
    default:
      return state;
  }
};

export default pollReducer;
