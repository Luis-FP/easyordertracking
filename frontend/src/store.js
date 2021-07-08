import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import Cookies from "js-cookie";
import {
    userSigninReducer, userEntradaReducer, userProyectoReducer, userDetallesSitioReducer, userRegisterReducer, userAlmuerzoReducer,userOTSReducer,
    userPermisoReducer, infoRegisterReducer, createUsersReducer, emailRecoveryReducer, infoActualizarReducer, infoBuscarNombreReducer, saveActualizarReducer, infoKPIGetReducer, userStatusReducer
} from './reducers/userReducer';
import {
    kpiPendientesListReducer, CrearPendienteReducer, ActualizarPendienteReducer,
    kpiGrupoReducer, kpiUserListReducer, kpiHoraVistaReducer, kpiUserDetalleReducer, kpiUserCambioJornadaHoraReducer, DeletePendienteReducer, ModificarPendienteReducer, 
} from './reducers/kpiReducer';


const userInfo = Cookies.getJSON("userInfo") || null;
const userKpiEntrada = Cookies.getJSON("userKpiEntrada") || null;


const initialState = {
    userSignin: { userInfo }, userEntrada: { userKpiEntrada },  userStatusInfo: {},userProyecto: {}, userDetallesSitio: {}, userOTS: {},
    userRegister: {}, infoRegister: {},userInfoActualizar:{}, infoBuscarNombre:{}, saveActualizar:{},
     infoKPIGet: {}, kpiPendienteLista: {},  kpiCrearPendiente: {}, kpiModificarPendiente:{}, 
    kpiDeletePendiente: {}, kpiGrupo: {}, kpiMio: {},
    kpiUserDetalle: {}, kpiUserCambioJornadaHora: {},
};


const reducer = combineReducers({
    userSignin: userSigninReducer,
    userEntrada: userEntradaReducer,
    userProyecto: userProyectoReducer,
    userDetallesSitio: userDetallesSitioReducer,
    // userSalida: userSalidaReducer,
    userRegister: userRegisterReducer,
    userInfoActualizar:infoActualizarReducer,

    userOTS: userOTSReducer,

    infoBuscarNombre: infoBuscarNombreReducer,
    infoRegister: infoRegisterReducer,
    userAlmuerzoInfo: userAlmuerzoReducer,
    userPermisoInfo: userPermisoReducer,
    userStatusInfo: userStatusReducer,
    userCreateInfo: createUsersReducer,
    emailRecovery: emailRecoveryReducer,
    saveActualizar:saveActualizarReducer,
    infoKPIGet: infoKPIGetReducer,

    kpiPendienteLista: kpiPendientesListReducer,
    kpiHoraVista: kpiHoraVistaReducer,
    kpiCrearPendiente: CrearPendienteReducer,
    kpiActualizarPendiente: ActualizarPendienteReducer,
    kpiModificarPendiente: ModificarPendienteReducer,
    kpiDeletePendiente: DeletePendienteReducer,
    kpiGrupo: kpiGrupoReducer,
    kpiMio: kpiUserListReducer,
    kpiUserDetalle: kpiUserDetalleReducer,
    kpiUserCambioJornadaHora: kpiUserCambioJornadaHoraReducer,
    // kpiUserCambioJornadaMin: kpiUserCambioJornadaMinReducer,

   
});
const composeEnhancer = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));


export default store;