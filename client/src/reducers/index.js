import { combineReducers } from 'redux';
import authReducer from './authReducer';
import erorrReducer from './erorrReducer';
import sampleReducer from './sampleReducer';
import writeoffReducer from './writeoffReducer';

export default combineReducers({
    auth: authReducer,
    errors: erorrReducer,
    samples: sampleReducer,
    writeoffs: writeoffReducer
});