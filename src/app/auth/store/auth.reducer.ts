import { User } from './../user.model';
import { Action } from '@ngrx/store';

export interface State {
  user: User;
}

const inititalState: State = {
  user: null
};

export function authReducer(state: State = inititalState, action: Action) {
  return state;
}
