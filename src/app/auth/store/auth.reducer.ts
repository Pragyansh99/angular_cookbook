import { User } from './../user.model';
import { Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';


export interface State {
  user: User;
}

const inititalState: State = {
  user: null
};

export function authReducer(state: State = inititalState, action: AuthActions.AuthAction) {
  switch (action.type) {
    case AuthActions.LOGIN:
        const user = new User(
          action.payload.email,
          action.payload.userId,
          action.payload.token,
          action.payload.expirationDate
        );
        return {
          ...state,
          user: user
        };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    default: return state;
  }
}
