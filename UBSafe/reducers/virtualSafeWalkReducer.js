import { combineReducer } from 'react-redux';

// Reducer that will deal with virtual companion related actions
function virtualSafeWalkReducer(state = [], action) {

};

// Reducer that will deal with profile editing related actions
function profileReducer(state = [], action) {
    
};

const appReducer = combineReducer({
    virtualSafeWalkReducer, 
    profileReducer
});
export default appReducer;