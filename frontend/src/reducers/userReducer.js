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

function userOTSReducer(state = {}, action) {
  switch (action.type) {
    case USER_OTS_REQUEST:
      return { loading: true };
    case USER_OTS_SUCCESS:
      return { loading: false, userOTsInfo: action.payload };
    case USER_OTS_FAIL:
      return { loading: false, errorOTS: action.payload };
    default:
      return state;
  }
}

function userDetallesSitioReducer(state = {}, action) {
  switch (action.type) {
    case USER_PROYECTO_DETALLES_REQUEST:
      return { loading: true };
    case USER_PROYECTO_DETALLES_SUCCESS:
      return { loading: false, detallesSitio: action.payload };
    case USER_PROYECTO_DETALLES_FAIL:
      return { loading: false, errorVista: action.payload };
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

// function userSalidaReducer(state = {}, action) {
//   switch (action.type) {
//     case USER_SALIDA_REQUEST:
//       return { loading: true };
//     case USER_SALIDA_SUCCESS:
//       return { loading: false, logoutSuccess: true, payload: action.payload };
//     case USER_SALIDA_FAIL:
//       return { loading: false, logoutSuccess: false, error: action.payload };
//     default:
//       return state;
//   }
// }

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

function infoKPIGetReducer(state = {}, action) {
  switch (action.type) {
    case USER_INFO_KPI_GET_REQUEST:
      return { loading: true };
    case USER_INFO_KPI_GET_SUCCESS:
      return { loading: false, infoKPIActive: action.payload };
    case USER_INFO_KPI_GET_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function saveActualizarReducer(state = {}, action) {
  switch (action.type) {
    case USER_SAVE_ACTUALIZAR_REQUEST:
      return { loading: true };
    case USER_SAVE_ACTUALIZAR_SUCCESS:
      return { loading: false, saveAct: action.payload };
    case USER_SAVE_ACTUALIZAR_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function infoBuscarNombreReducer(state = {}, action) {
  switch (action.type) {
    case USER_INFO_ACTUALIZAR_NOMBRE_REQUEST:
      return { loading: true };
    case USER_INFO_ACTUALIZAR_NOMBRE_SUCCESS:
      return { loading: false, infoNombre: action.payload };
    case USER_INFO_ACTUALIZAR_NOMBRE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function userAlmuerzoReducer(state = {}, action) {
  switch (action.type) {
    case USER_ALMUERZO_REQUEST:
      return { loading: true };
    case USER_ALMUERZO_SUCCESS:
      return { loading: false, userKpiAlmuerzo: action.payload };
    case USER_ALMUERZO_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function userPermisoReducer(state = {}, action) {
  switch (action.type) {
    case USER_PERMISO_REQUEST:
      return { loading: true };
    case USER_PERMISO_SUCCESS:
      return { loading: false, userKpiPermisos: action.payload };
    case USER_PERMISO_FAIL:
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
      return { loading: true };
    case USER_CREATE_SUCCESS:
      return { loading: false, createUser: action.payload };
    case USER_CREATE_FAIL:
      return { loading: false, error: action.payload };
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
  // userSalidaReducer,
  userRegisterReducer,
  infoActualizarReducer,
  infoBuscarNombreReducer,
  userAlmuerzoReducer,
  userPermisoReducer,
  userStatusReducer,

  userOTSReducer,

  infoRegisterReducer,
  createUsersReducer,
  emailRecoveryReducer,
  userMarcarLeidoReducer,
  saveActualizarReducer,
  infoKPIGetReducer,
};
