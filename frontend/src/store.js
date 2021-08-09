import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import Cookies from "js-cookie";
import {
    userSigninReducer,  userProyectoReducer, userDetallesSitioReducer, userRegisterReducer,userOTSReducer, userOTSCreateReducer, userSalidaReducer,
    infoRegisterReducer, createUsersReducer, emailRecoveryReducer, infoActualizarReducer, userStatusReducer, createSitioReducer, listaSitiosCargadosReducer,
    archivosSitioReducer,
    ingeSitioReducer
} from './reducers/userReducer';



const userInfo = Cookies.getJSON("userInfo") || null;



const initialState = {
    userSignin: { userInfo },  userStatusInfo: {},userProyecto: {}, userDetallesSitio: {}, 
    userOTS: {}, userOTSCreate:{},
    listaSitiosCargados: {},
    userRegister: {}, infoRegister: {},userInfoActualizar:{}, userSalida:{},
    archivosDisponiblesSitio: {}, ingeSitio:{}
};


const reducer = combineReducers({
    userSignin: userSigninReducer,
    // userEntrada: userEntradaReducer,
    userProyecto: userProyectoReducer,
    userDetallesSitio: userDetallesSitioReducer,
    userSalida: userSalidaReducer,
    userRegister: userRegisterReducer,
    userInfoActualizar:infoActualizarReducer,
    userOTS: userOTSReducer,
    userOTSCreate: userOTSCreateReducer,

    infoRegister: infoRegisterReducer,

    userStatusInfo: userStatusReducer,
    userCreateInfo: createUsersReducer,
    createSitioR: createSitioReducer,
    listaSitiosCargados: listaSitiosCargadosReducer,
    archivosDisponiblesSitio: archivosSitioReducer,
    ingeSitio:ingeSitioReducer,

    emailRecovery: emailRecoveryReducer,


   
});
const composeEnhancer = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));


export default store;