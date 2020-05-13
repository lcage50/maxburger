import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('auth reducer', () => {

  let initialState;
  beforeEach(() => {
    initialState = {
      token: null,
      id: null,
      error: null,
      loading: false,
      authRedirectPath: '/',
    };
});

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should store the token upon login', () => {
    expect(reducer(initialState, {
      type: actionTypes.AUTH_SUCCESS,
      idToken: 'my-token',
      userId: 'my-userId'
    })).toEqual({
      token: 'my-token',
      id: 'my-userId',
      error: null,
      loading: false,
      authRedirectPath: '/',
    });
  });
});