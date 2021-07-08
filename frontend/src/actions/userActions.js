import axios from "axios";
import Cookie from "js-cookie";
import crypto from "crypto";
import {
  USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL,
  USER_LOGOUT,
  USER_ENTRADA_REQUEST, USER_ENTRADA_SUCCESS, USER_ENTRADA_FAIL,
  USER_SALIDA_REQUEST, USER_SALIDA_SUCCESS, USER_SALIDA_FAIL,
  USER_PERMISO_REQUEST, USER_PERMISO_SUCCESS, USER_PERMISO_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_INFO_REGISTER_REQUEST, USER_INFO_REGISTER_SUCCESS, USER_INFO_REGISTER_FAIL, USER_ALMUERZO_REQUEST, USER_ALMUERZO_SUCCESS, USER_ALMUERZO_FAIL,
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
  USER_CREATE_FAIL,
  USER_CHGPASS_REQUEST,
  USER_CHGPASS_SUCCESS,
  USER_CHGPASS_FAIL,
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
  USER_INFO_ACTUALIZAR_KPI_REQUEST,
  USER_INFO_ACTUALIZAR_KPI_SUCCESS,
  USER_INFO_ACTUALIZAR_KPI_FAIL,
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
  USER_OTS_FAIL
} from "../constants/userConstants";


const signin = (info) => async (dispatch) => {

  dispatch({ type: USER_SIGNIN_REQUEST, payload: info });

  try {
    const { data } = await axios.post("/api/users/login", info);
    // ////console.log'data', data);
    if (!data.error) {
      // const geoLat = info.info.crd ? { latitude: info.info.crd.latitude } : { latitude: null };
      // const geoLong = info.info.crd ? { longitude: info.info.crd.longitude } : { longitude: null };
      const registroInfo = { ...data, animoAM: info.feelingAM, /*geoLat, longitude: geoLong */ }
      dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
      Cookie.set('userInfo', JSON.stringify(data, { secure: true }));
      //no deberia ser una funcion aqui. debe estar en backend.
      // dispatch(registroEntrada(registroInfo));
      return registroInfo;
    } else if (data.error) {
      dispatch({ type: USER_SIGNIN_FAIL, payload: data });
      return false;
    } else {
      // ////console.log"Error Interno");
    }
    return false;
  } catch (error) {
    // ////console.log"error:", error);
  }
}; 


const proyectoVisualizado = (proyecto) => async (dispatch, getState) => {

  dispatch({ type: USER_PROYECTO_REQUEST });
  const { userSignin: { userInfo } } = getState();
console.log(proyecto)
  try {
    const { data } = await axios.post("/api/users/proyecto", proyecto, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log('data', data);
    if (!data.error) {
      dispatch({ type: USER_PROYECTO_SUCCESS, payload: data });
      return true;
    } else if (data.error) {
      dispatch({ type: USER_PROYECTO_FAIL, payload: data });
      return false;
    } else {
      console.log("Error Interno");
    }
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};


const usersOTs = () => async (dispatch, getState) => {

  dispatch({ type: USER_OTS_REQUEST });
  const { userSignin: { userInfo } } = getState();

  try {
    const { data } = await axios.get("/api/users/otsuser", {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log('data', data);
    if (!data.error) {
      dispatch({ type: USER_OTS_SUCCESS, payload: data });
      return true;
    } else if (data.error) {
      dispatch({ type: USER_OTS_FAIL, payload: data });
      return false;
    } else {
      console.log("Error Interno");
    }
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const buscarDetallesSitio = (sitio) => async (dispatch, getState) => {

  dispatch({ type: USER_PROYECTO_DETALLES_REQUEST });
  const { userSignin: { userInfo } } = getState();

  try {
    const { data } = await axios.post("/api/users/detalles", sitio, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log('data', data);
    if (!data.error) {
      dispatch({ type: USER_PROYECTO_DETALLES_SUCCESS, payload: data });
      return true;
    } else if (data.error) {
      dispatch({ type: USER_PROYECTO_DETALLES_FAIL, payload: data });
      return false;
    } else {
      console.log("Error Interno");
    }
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const marcarTCLeido = (u) => async (dispatch, getState) => {

  dispatch({ type: USER_MARCARLEIDO_REQUEST });
  const { userSignin: { userInfo } } = getState();
  console.log('userInfo', userInfo)
  try {
    const { data } = await axios.post("/api/users/marcarleido", u, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    // ////console.log'data', data);
    if (!data.error) {
      dispatch({ type: USER_MARCARLEIDO_SUCCESS, payload: data });
      return true;
    } else if (data.error) {
      dispatch({ type: USER_MARCARLEIDO_FAIL, payload: data });
      return false;
    } else {
      console.log("Error Interno");
    }
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};


const registroEntrada = (registroInfo) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: USER_ENTRADA_REQUEST, payload: registroInfo });

  try {
    const { data: nuevaEntrada } = await axios.post("/api/users/entrada", registroInfo, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });

    if (nuevaEntrada) {
      dispatch({ type: USER_ENTRADA_SUCCESS, payload: nuevaEntrada });
      Cookie.set('userKpiEntrada', JSON.stringify(nuevaEntrada, { secure: true }));
    } else {
      dispatch({ type: USER_ENTRADA_FAIL, payload: nuevaEntrada.message });
    }

  } catch (error) {
    // ////console.log"error:",error);
    dispatch({ type: USER_ENTRADA_FAIL, payload: error.message });
  }
}


const userStatusCheck = () => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: USER_STATUS_REQUEST});

  try {
    const { statusActivo } = await axios.get("/api/users/statuscheck", {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    }
    );
    console.log("checkStatusInfo:", statusActivo);
    if (statusActivo) {
      dispatch({ type: USER_STATUS_SUCCESS, payload: statusActivo });
      Cookie.set('userKpiAlmuerzo', JSON.stringify(statusActivo.almuerzo, { secure: true }));
      Cookie.set('userKpipermiso', JSON.stringify(statusActivo.permiso, { secure: true }));
    } else {
      dispatch({ type: USER_STATUS_FAIL, payload: statusActivo.message });
    }

  } catch (error) {
    ////console.log"error:", error);
    dispatch({ type: USER_STATUS_FAIL, payload: error.message });
  }
}



const userAlmuerzo = (infoAlmuerzo) => async (dispatch, getState) => {

  const { userSignin: { userInfo } } = getState();
  console.log('userInfo', userInfo)
  dispatch({ type: USER_ALMUERZO_REQUEST, payload: infoAlmuerzo });

  try {

    const { data: almuerzoActivo } = await axios.post("/api/users/almuerzo", infoAlmuerzo, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    // console.log("data2:", almuerzoActivo);

    if (almuerzoActivo) {
      dispatch({ type: USER_ALMUERZO_SUCCESS, payload: almuerzoActivo });
      Cookie.set('userKpiAlmuerzo', JSON.stringify(almuerzoActivo, { secure: true }));
    } else {
      dispatch({ type: USER_ALMUERZO_FAIL, payload: almuerzoActivo.message });
    }

  } catch (error) {
    ////console.log"error:", error);
    dispatch({ type: USER_ALMUERZO_FAIL, payload: error.message });
  }
}


const userPermiso = (infoPermiso) => async (dispatch, getState) => {
  console.log('infoPermiso', infoPermiso)
  const { userSignin: { userInfo } } = getState();

  dispatch({ type: USER_PERMISO_REQUEST, payload: infoPermiso });

  try {

    const { data: permisoActivo } = await axios.post("/api/users/permiso", infoPermiso, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    ////console.log"data2:", permisoActivo);

    if (permisoActivo) {
      dispatch({ type: USER_PERMISO_SUCCESS, payload: permisoActivo });
      Cookie.set('userKpiPermisos', JSON.stringify(permisoActivo, { secure: true }));
    } else {
      dispatch({ type: USER_PERMISO_FAIL, payload: permisoActivo.message });
    }

  } catch (error) {
    // ////console.log"error:",error);
    dispatch({ type: USER_PERMISO_FAIL, payload: error.message });
  }
}

const register = (datosRegistroUsuario) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: USER_REGISTER_REQUEST, payload: datosRegistroUsuario });
  try {
    const { data } = await axios.post("/api/users/register", datosRegistroUsuario, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    ////console.log'data Register', data);
    if (data.errorInfo) {
      ////console.log'entro en error en user action')
      dispatch({ type: USER_REGISTER_FAIL, payload: data.message });
    } else {
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    }


  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: error.message });
  }
}

const infoActualizacion = () => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: USER_INFO_ACTUALIZAR_REQUEST });
  try {
    const { data } = await axios.get("/api/users/infoactualizar", {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    }
    );
    dispatch({ type: USER_INFO_ACTUALIZAR_SUCCESS, payload: data });
    ////console.logdata);
  } catch (error) {
    dispatch({ type: USER_INFO_ACTUALIZAR_FAIL, payload: error.message });
  }
}

const actualizarUsuarioEnviar = (infoUsuarioAct) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: USER_SAVE_ACTUALIZAR_REQUEST });
  try {
    const { data } = await axios.post("/api/users/guardarActualizacion", infoUsuarioAct, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    })

    if(data){
      console.log("actualizacion realizada action")
    dispatch({ type: USER_SAVE_ACTUALIZAR_SUCCESS, payload: true });

    }
    ////console.logdata);
  } catch (error) {
    dispatch({ type: USER_SAVE_ACTUALIZAR_FAIL, payload: error.message });
  }
}

const actualizarUsuarioSetOff = () => (dispatch) => {

    dispatch({ type: USER_SAVE_ACTUALIZAR_SUCCESS, payload: false });

}

const buscarNombre = (nombreV) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: USER_INFO_ACTUALIZAR_NOMBRE_REQUEST });
  try {
    const { data } = await axios.get("/api/users/buscarnombre", {
      params:{
        nombre:nombreV
      },
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    } 
    );
    dispatch({ type: USER_INFO_ACTUALIZAR_NOMBRE_SUCCESS, payload: data });
    console.log("data",data);
  } catch (error) {
    dispatch({ type: USER_INFO_ACTUALIZAR_NOMBRE_FAIL, payload: error.message });
  }
}


const obtenerKPI = (infoKPIGet) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: USER_INFO_KPI_GET_REQUEST });
  console.log('infoKPIGet', infoKPIGet)
  try {
    const { data } = await axios.get("/api/users/buscarKPIUsuario", {
      params:{
        ut_id: infoKPIGet.ut_id,
        fecha: infoKPIGet.fecha
      },
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    } 
    );
    dispatch({ type: USER_INFO_KPI_GET_SUCCESS, payload: data });
    console.log("data",data);
  } catch (error) {
    dispatch({ type: USER_INFO_KPI_GET_FAIL, payload: error.message });
  }
}

const actualizarKPIUsuario = (selectedKPI) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  console.log("caction kpi", {selectedKPI})
  dispatch({ type: USER_INFO_ACTUALIZAR_KPI_REQUEST });
  try {
    const { data } = await axios.post("/api/users/actualizarKPI", selectedKPI, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    dispatch({ type: USER_INFO_ACTUALIZAR_KPI_SUCCESS, payload: data });
    ////console.logdata);
  } catch (error) {
    dispatch({ type: USER_INFO_ACTUALIZAR_KPI_FAIL, payload: error.message });
  }
}


const logout = (info) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  // const { userEntrada: { userKpiEntrada } } = getState();
  dispatch({ type: USER_SALIDA_REQUEST, payload: info });
  try {
    // const registroSalida = { ...userKpiEntrada, animoPM: info.info.feelingPM, latitude: info.info.crd.latitude, longitude: info.info.crd.longitude }
    // const registroSalida = { ...userKpiEntrada, info };
    // const registroSalida = { info };
    // ////console.log'registroSalida', registroSalida)
    const { data } = await axios.post("/api/users/salida", { info }, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    }).catch(function (error) {
      if (error.response) { 
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) { 
        console.log(error.request);
      } else { 
        console.log('Error', error.message);
      }
      console.log(error.config);
    });

    console.log('data logout', data)
    if (!data.error) {
      console.log("removing cookies")
      Cookie.remove("userInfo");
      Cookie.remove("userKpiEntrada");
      Cookie.remove("userKpiAlmuerzo");
      Cookie.remove("userKpiPermisos");
      Cookie.remove("mh");

      dispatch({ type: USER_SALIDA_SUCCESS });
      return data;
    }
    else {
      dispatch({ type: USER_SALIDA_FAIL });
      return data;
    }
  } catch (error) {
    // console.log("error:", error);
    dispatch({ type: USER_SALIDA_FAIL });
    return error;

  }

}

const autoLogout = () => async (dispatch, getState) => {
  dispatch({ type: USER_SALIDA_REQUEST });
  console.log('autologout')
  try {

    Cookie.remove("userInfo");
    Cookie.remove("userKpiEntrada");
    Cookie.remove("userKpiAlmuerzo");
    Cookie.remove("userKpiPermisos");
    Cookie.remove("mh");
    dispatch({ type: USER_SALIDA_SUCCESS });

  } catch (error) {
    ////console.log"error:", error);

  }

}


const crearUsuarios = (usuarios) => async (dispatch) => {
  dispatch({ type: USER_CREATE_REQUEST });
  try {
    // seria bueno cifrar con server.
    const { data } = await axios.post("/api/users/create", { usuarios });
    ////console.log"exito frontend.", data)
    if (!data.error) {
      dispatch({ type: USER_CREATE_SUCCESS, payload: data });
    } else {
      dispatch({ type: USER_CREATE_FAIL, payload: data });
    }
  } catch (error) {
    dispatch({ type: USER_CREATE_FAIL, payload: error });
  }
};

const chgPasswordNew = (info) => async (dispatch) => {
  dispatch({ type: USER_CHGPASS_REQUEST });
  try {
    // seria bueno cifrar con server.
    const { data } = await axios.put("/api/users/chpass/" + info.hash, { ...info });
    ////console.log"exito frontend.", data)
    if (!data.error) {
      //ahorita me doy cuenta que talves la persona no quiere hacer login ahi mismo entonces mejor no coloco esto.
      // Cookie.set('userInfo', JSON.stringify(data.userInfo, { secure: true }));
      dispatch({ type: USER_CHGPASS_SUCCESS, payload: data });
      return true;
    } else {
      dispatch({ type: USER_CHGPASS_FAIL, payload: data });
      return false;
    }
  } catch (error) {
    dispatch({ type: USER_CHGPASS_FAIL, payload: error });
    return false;
  }
};

const chgPasswordUser = (info) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: USER_CHGPASS_REQUEST });
  try {
    // seria bueno cifrar con server.
    const { data } = await axios.put("/api/users/chpass", { ...info }, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    ////console.log"exito frontend.", data)
    if (!data.error) {
      //como el usuario ya esta logged in simplemente actualizo los datos
      Cookie.set('userInfo', JSON.stringify(data.userInfo, { secure: true }));
      dispatch({ type: USER_CHGPASS_SUCCESS, payload: data });
      return true;
    } else {
      dispatch({ type: USER_CHGPASS_FAIL, payload: data });
      return false;
    }
  } catch (error) {
    dispatch({ type: USER_CHGPASS_FAIL, payload: error });
    return false;
  }
};


const sendRecoverEmail = (info) => async (dispatch) => {

  dispatch({ type: USER_RECOVERY_REQUEST });
  try {
    // cifrar el correo? no creo que sea necesario.
    const { data } = await axios.put("/api/users/recoverEmail", { ...info },);
    ////console.log"exito frontend.", data)
    if (!data.error) {
      dispatch({ type: USER_RECOVERY_SUCCESS, payload: data });
      return data;
    } else {
      dispatch({ type: USER_RECOVERY_FAIL, payload: data });
      return data;
    }
  } catch (error) {
    dispatch({ type: USER_RECOVERY_FAIL, payload: error });
    ////console.logerror)
    return false;
  }
};


const securePassword = async (hash) => {

  try {
    const { data } = await axios.post("/api/secure/chpass", { hash });
    if (!data.error) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    ////console.logerror)
    return false;
  }
};
const securePassword2 = async (ut_id) => {

  try {
    const { data } = await axios.post("/api/secure/chpass2", { ut_id });
    if (!data.error) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    ////console.logerror)
    return false;
  }
};

const encryptPublic = (toEncrypt, publicKey) => {
  var buffer = Buffer.from(toEncrypt);
  var encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};
const secureLogin = async (email) => {
  try {
    ////console.log"sending data")
    const { data } = await axios.post("/api/secure/login", { email });
    ////console.log"frontend data", data)
    if (!data.error) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    ////console.logerror)
    return false;
  }
};
export {
  signin,
  proyectoVisualizado,
  buscarDetallesSitio,

  register,
  infoActualizacion,
  actualizarKPIUsuario,
  actualizarUsuarioEnviar,
  actualizarUsuarioSetOff,
  obtenerKPI,
  buscarNombre,
  logout,
  autoLogout,
  registroEntrada,
  crearUsuarios,
  chgPasswordNew,
  chgPasswordUser,
  sendRecoverEmail,
  encryptPublic,
  securePassword,
  securePassword2,
  secureLogin,
  marcarTCLeido,
  usersOTs
};
