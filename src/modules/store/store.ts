import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../app/state/slice";
import levelReducer from "../level/state/slice";

const store = configureStore({
  reducer: {
    app: appReducer,
    level: levelReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
