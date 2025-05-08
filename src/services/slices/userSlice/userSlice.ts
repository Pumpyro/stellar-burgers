import { TUser, RequestStatus } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  forgotPassword,
  resetPassword
} from '@thunks';

type UserState = {
  user: TUser | null;
  userStatus: RequestStatus;
  userChecked: boolean;
};

const initialState: UserState = {
  user: null,
  userStatus: RequestStatus.Idle,
  userChecked: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    selectUser: (state) => state.user,
    selectUserChecked: (state) => state.userChecked,
    selectUserStatus: (state) => state.userStatus
  },
  reducers: {
    setCheckUser: (state) => {
      state.userChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userStatus = RequestStatus.Succeeded;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      })

      .addCase(loginUser.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userStatus = RequestStatus.Succeeded;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      })

      .addCase(logoutUser.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userStatus = RequestStatus.Succeeded;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      })

      .addCase(getUser.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userStatus = RequestStatus.Succeeded;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      })

      .addCase(updateUser.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userStatus = RequestStatus.Succeeded;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      });
  }
});

export default userSlice;
export const userSelectors = userSlice.selectors;

export const userActions = {
  ...userSlice.actions,
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword
};
