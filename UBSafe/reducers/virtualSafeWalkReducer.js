import { combineReducers } from  'redux';
//import { combineReducer } from 'react-redux';

// Reducer that will deal with virtual companion related actions
function virtualSafeWalkReducer(state = [], action) {
    return state;
};

// Reducer that will deal with profile editing related actions
function profileReducer(state = [], action) {
    return state;
};

const appReducer = combineReducers({
    virtualSafeWalkReducer, 
    profileReducer
});
//export default appReducer;