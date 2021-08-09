import {
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_LOGOUT,
  USER_ENTRADA_REQUEST,
  USER_ENTRADA_SUCCESS,
  USER_ENTRADA_FAIL,
  USER_SALIDA_REQUEST,
  USER_SALIDA_SUCCESS,
  USER_SALIDA_FAIL,
  USER_PERMISO_REQUEST,
  USER_PERMISO_SUCCESS,
  USER_PERMISO_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_INFO_REGISTER_REQUEST,
  USER_INFO_REGISTER_SUCCESS,
  USER_INFO_REGISTER_FAIL,
  USER_ALMUERZO_REQUEST,
  USER_ALMUERZO_SUCCESS,
  USER_ALMUERZO_FAIL,
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
  USER_CREATE_FAIL,
  USER_RECOVERY_REQUEST,
  USER_RECOVERY_SUCCESS,
  USER_RECOVERY_FAIL,
  USER_MARCARLEIDO_REQUEST,
  USER_MARCARLEIDO_SUCCESS,
  USER_MARCARLEIDO_FAIL,
  USER_INFO_ACTUALIZAR_REQUEST,
  USER_INFO_ACTUALIZAR_SUCCESS,
  USER_INFO_ACTUALIZAR_FAIL,
  USER_INFO_ACTUALIZAR_NOMBRE_REQUEST,
  USER_INFO_ACTUALIZAR_NOMBRE_SUCCESS,
  USER_INFO_ACTUALIZAR_NOMBRE_FAIL,
  USER_SAVE_ACTUALIZAR_REQUEST,
  USER_SAVE_ACTUALIZAR_SUCCESS,
  USER_SAVE_ACTUALIZAR_FAIL,
  USER_INFO_KPI_GET_REQUEST,
  USER_INFO_KPI_GET_SUCCESS,
  USER_INFO_KPI_GET_FAIL,
  USER_STATUS_REQUEST,
  USER_STATUS_SUCCESS,
  USER_STATUS_FAIL,
  USER_PROYECTO_REQUEST,
  USER_PROYECTO_SUCCESS,
  USER_PROYECTO_FAIL,
  USER_PROYECTO_DETALLES_REQUEST,
  USER_PROYECTO_DETALLES_SUCCESS,
  USER_PROYECTO_DETALLES_FAIL,
  USER_OTS_REQUEST,
  USER_OTS_SUCCESS,
  USER_OTS_FAIL,
  SITIO_CREATE_REQUEST,
  SITIO_CREATE_SUCCESS,
  SITIO_CREATE_FAIL,
  SITIOS_CARGADOS_REQUEST,
  SITIOS_CARGADOS_SUCCESS,
  SITIOS_CARGADOS_FAIL,
  OT_NUEVA_CREATE_REQUEST,
  OT_NUEVA_CREATE_SUCCESS,
  OT_NUEVA_CREATE_FAIL,
  ARCHIVOS_CARGADOS_REQUEST,
  ARCHIVOS_CARGADOS_SUCCESS,
  ARCHIVOS_CARGADOS_FAIL,
  INGENIERIA_CARGADOS_REQUEST,
  INGENIERIA_CARGADOS_SUCCESS,
  INGENIERIA_CARGADOS_FAIL,
} from "../constants/userConstants";

function userSigninReducer(state = {}, action) {
  switch (action.type) {
    case USER_SIGNIN_REQUEST:
      return { loading: true };
    case USER_SIGNIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_SIGNIN_FAIL:
      return { loading: false, errorLogin: action.payload };
    case USER_SALIDA_REQUEST:
      return { loading: true, salida: true };
    case USER_SALIDA_SUCCESS:
      return {};
    default:
      return state;
  }
}

function userProyectoReducer(state = {}, action) {
  switch (action.type) {
    case USER_PROYECTO_REQUEST:
      return { loading: true };
    case USER_PROYECTO_SUCCESS:
      return { loading: false, userVista: action.payload };
    case USER_PROYECTO_FAIL:
      return { loading: false, errorVista: action.payload };
    default:
      return state;
  }
}

function archivosSitioReducer(state = {}, action) {
  switch (action.type) {
    case ARCHIVOS_CARGADOS_REQUEST:
      return { loadingArchivo: true };
    case ARCHIVOS_CARGADOS_SUCCESS:
      return { loadingArchivo: false, archivosDelSitio: action.payload };
    case ARCHIVOS_CARGADOS_FAIL:
      return { loadingArchivo: false, errorArchivo: action.payload };
    default:
      return state;
  }
}

function ingeSitioReducer(state = {}, action) {
  switch (action.type) {
    case INGENIERIA_CARGADOS_REQUEST:
      return { loadingInge: true };
    case INGENIERIA_CARGADOS_SUCCESS:
      return { loadingInge: false, ingesDelSitio: action.payload };
    case INGENIERIA_CARGADOS_FAIL:
      return { loadingInge: false, errorInge: action.payload };
    default:
      return state;
  }
}
function userOTSReducer(state = {}, action) {
  switch (action.type) {
    case USER_OTS_REQUEST:
      return { loadingOTs: true };
    case USER_OTS_SUCCESS:
      return { loadingOTs: false, userOTsInfo: action.payload };
    case USER_OTS_FAIL:
      return { loadingOTs: false, errorOTS: action.payload };
    default:
      return state;
  }
}

function userOTSCreateReducer(state = {}, action) {
  switch (action.type) {
    case OT_NUEVA_CREATE_REQUEST:
      return { loadingNuevaOT: true };
    case OT_NUEVA_CREATE_SUCCESS:
      return { loadingNuevaOT: false, OTNuevaInfo: action.payload };
    case OT_NUEVA_CREATE_FAIL:
      return { loadingNuevaOT: false, errorOTNueva: action.payload };
    default:
      return state;
  }
} 

function userDetallesSitioReducer(state = {}, action) {
  switch (action.type) {
    case USER_PROYECTO_DETALLES_REQUEST:
      return { loadingSitio: true };
    case USER_PROYECTO_DETALLES_SUCCESS:
      return { loadingSitio: false, detallesSitio: action.payload };
    case USER_PROYECTO_DETALLES_FAIL:
      return { loadingSitio: false, errorVista: action.payload };
    default:
      return state;
  }
}

function userMarcarLeidoReducer(state = {}, action) {
  switch (action.type) {
    case USER_MARCARLEIDO_REQUEST:
      return { loading: true };
    case USER_MARCARLEIDO_SUCCESS:
      return { loading: false, userTC: action.payload };
    case USER_MARCARLEIDO_FAIL:
      return { loading: false, errorTC: action.payload };
    default:
      return state;
  }
}

function userEntradaReducer(state = {}, action) {
  switch (action.type) {
    case USER_ENTRADA_REQUEST:
      return { loading: true };
    case USER_ENTRADA_SUCCESS:
      return { loading: false, userKpiEntrada: action.payload };
    case USER_ENTRADA_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
}

function userSalidaReducer(state = {}, action) {
  switch (action.type) {
    case USER_SALIDA_REQUEST:
      return { loading: true };
    case USER_SALIDA_SUCCESS:
      return { loading: false, logoutSuccess: true, payload: action.payload };
    case USER_SALIDA_FAIL:
      return { loading: false, logoutSuccess: false, error: action.payload };
    default:
      return state;
  }
}

function userRegisterReducer(state = {}, action) {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userRegisterInfo: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, errorRegistro: action.payload };
    default:
      return state;
  }
}

function infoRegisterReducer(state = {}, action) {
  switch (action.type) {
    case USER_INFO_REGISTER_REQUEST:
      return { loading: true };
    case USER_INFO_REGISTER_SUCCESS:
      return { loading: false, infoReg: action.payload };
    case USER_INFO_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function infoActualizarReducer(state = {}, action) {
  switch (action.type) {
    case USER_INFO_ACTUALIZAR_REQUEST:
      return { loading: true };
    case USER_INFO_ACTUALIZAR_SUCCESS:
      return { loading: false, infoAct: action.payload };
    case USER_INFO_ACTUALIZAR_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}







function userStatusReducer(state = {}, action) {
  switch (action.type) {
    case USER_STATUS_REQUEST:
      return { loading: true };
    case USER_STATUS_SUCCESS:
      return { loading: false, userKpiStatus: action.payload };
    case USER_STATUS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function createUsersReducer(state = {}, action) {
  switch (action.type) {
    case USER_CREATE_REQUEST:
      return { loadingOT: true };
    case USER_CREATE_SUCCESS:
      return { loadingOT: false, createUser: action.payload };
    case USER_CREATE_FAIL:
      return { loadingOT: false, errorOT: action.payload };
    default:
      return state;
  }
}

function createSitioReducer(state = {}, action) {
  switch (action.type) {
    case SITIO_CREATE_REQUEST:
      return { loadingSitio: true };
    case SITIO_CREATE_SUCCESS:
      return { loadingSitio: false, createSitio: action.payload };
    case SITIO_CREATE_FAIL:
      return { loadingSitio: false, errorSitio: action.payload };
    default:
      return state;
  }
}

function listaSitiosCargadosReducer(state = {}, action) {
  switch (action.type) {
    case SITIOS_CARGADOS_REQUEST:
      return { loadingSitios: true };
    case SITIOS_CARGADOS_SUCCESS:
      return { loadingSitios: false, sitiosCargados: action.payload };
    case SITIOS_CARGADOS_FAIL:
      return { loadingSitios: false, errorSitio: action.payload };
    default:
      return state;
  }
}

function emailRecoveryReducer(state = {}, action) {
  switch (action.type) {
    case USER_CREATE_REQUEST:
      return { loading: true };
    case USER_CREATE_SUCCESS:
      return { loading: false, emailRecovery: action.payload };
    case USER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
export {
  userSigninReducer,
  userEntradaReducer,
  userProyectoReducer,
  userDetallesSitioReducer,
  userSalidaReducer,
  userRegisterReducer,
  infoActualizarReducer,
  archivosSitioReducer,

  userStatusReducer,
  userOTSCreateReducer,
  userOTSReducer,
  createSitioReducer,
  createUsersReducer,
  listaSitiosCargadosReducer,
  infoRegisterReducer,
 
  emailRecoveryReducer,
  userMarcarLeidoReducer,
  ingeSitioReducer


};
