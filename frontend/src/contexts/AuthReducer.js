const AuthReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN_START":
        return {
          user: null,
          isFetching: true,
          error: false,
        };
      case "LOGIN_SUCCESS":
        return {
          user: action.payload,
          isFetching: false,
          error: false,
        };
      case "LOGIN_FAILURE":
        return {
          user: null,
          isFetching: false,
          error: action.payload, //true
        };
        case "LOGOUT":
            return {
                user:localStorage.setItem("user", null),
                isFetching:false,
                error:false
            };
        case "FOLLOW":
              return {
                ...state,
                user: {
                  ...state.user,
                  following: [...state.user.following, action.payload],
                },
              };
        case "UNFOLLOW":
              return {
                ...state,
                user: {
                  ...state.user,
                  following: state.user.following.filter(
                    (following) => following !== action.payload
                  ),
                },
              };
        case "EDIT":
              return {
                  user: action.payload,
                  isFetching: false,
                  error: false,
                };
      default:
            return state;
    }       
}

export default AuthReducer;