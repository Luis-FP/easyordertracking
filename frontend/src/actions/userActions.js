import axios from "axios";
import Cookie from "js-cookie";
import crypto from "crypto";
import {
  USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL,
  USER_LOGOUT,
  USER_ENTRADA_REQUEST, USER_ENTRADA_SUCCESS, USER_ENTRADA_FAIL,
  USER_SALIDA_REQUEST, USER_SALIDA_SUCCESS, USER_SALIDA_FAIL,
   USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_INFO_REGISTER_REQUEST, USER_INFO_REGISTER_SUCCESS, USER_INFO_REGISTER_FAIL, USER_ALMUERZO_REQUEST, USER_ALMUERZO_SUCCESS, USER_ALMUERZO_FAIL,
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
  OT_ACTUALIZAR_CREATE_REQUEST,
  OT_ACTUALIZAR_CREATE_SUCCESS,
  OT_ACTUALIZAR_CREATE_FAIL,
  ARCHIVOS_CARGADOS_REQUEST,
  ARCHIVOS_CARGADOS_SUCCESS,
  ARCHIVOS_CARGADOS_FAIL,
  INGENIERIA_CARGADOS_REQUEST,
  INGENIERIA_CARGADOS_SUCCESS,
  INGENIERIA_CARGADOS_FAIL
} from "../constants/userConstants";
import { ErrorValue } from "exceljs";


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

const archivosSitio = (value) => async (dispatch, getState) => {

  dispatch({ type: ARCHIVOS_CARGADOS_REQUEST });
  const { userSignin: { userInfo } } = getState();

  try {
    const { data } = await axios.post("/api/users/archivosSitio", value,{
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log('data', data);
    if (!data.error) {
      dispatch({ type: ARCHIVOS_CARGADOS_SUCCESS, payload: data });
      return true;
    } else if (data.error) {
      dispatch({ type: ARCHIVOS_CARGADOS_FAIL, payload: data });
      return false;
    } else {
      console.log("Error Interno");
    }
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const ingenieriaSitio = (value) => async (dispatch, getState) => {
console.log("value",value)
  dispatch({ type: INGENIERIA_CARGADOS_REQUEST });
  const { userSignin: { userInfo } } = getState();

  try {
    const { data } = await axios.post("/api/users/ingenieriaSitio", value,{
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log('data', data);
    if (!data.error) {
      dispatch({ type: INGENIERIA_CARGADOS_SUCCESS, payload: data });
      return true;
    } else if (data.error) {
      dispatch({ type: INGENIERIA_CARGADOS_FAIL, payload: data });
      return false;
    } else {
      console.log("Error Interno");
    }
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const buscarSitiosCargados = () => async (dispatch, getState) => {

  dispatch({ type: SITIOS_CARGADOS_REQUEST });
  const { userSignin: { userInfo } } = getState();

  try {
    const { data } = await axios.get("/api/users/listasitios", {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log('data', data);
    if (!data.error) {
      dispatch({ type: SITIOS_CARGADOS_SUCCESS, payload: data });
      return true;
    } else if (data.error) {
      dispatch({ type: SITIOS_CARGADOS_FAIL, payload: data });
      return false;
    } else {
      console.log("Error Interno");
    }
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const buscarDetallesSitio = (sitioBuscar) => async (dispatch, getState) => {

  dispatch({ type: USER_PROYECTO_DETALLES_REQUEST });
  const { userSignin: { userInfo } } = getState();

  try {
    const { data } = await axios.post("/api/users/detalles", sitioBuscar, {
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

const InfoRegister = () => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  console.log('data RegisterInfo');
  dispatch({ type: USER_INFO_REGISTER_REQUEST });
  try {
    const { data } = await axios.get("/api/users/inforegister", {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log('data RegisterInfo', data);
    if (data.errorInfo) {
      ////console.log'entro en error en user action')
      dispatch({ type: USER_INFO_REGISTER_FAIL, payload: data.message });
    } else {
      dispatch({ type: USER_INFO_REGISTER_SUCCESS, payload: data });
    }


  } catch (error) {
    dispatch({ type: USER_INFO_REGISTER_FAIL, payload: error.message });
  }
}


const register = (datosRegistroUsuario, proyVistas) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  console.log('datosRegistroUsuario', datosRegistroUsuario)
  dispatch({ type: USER_REGISTER_REQUEST, payload: {datosRegistroUsuario, proyVistas} });
  try {
    const { data } = await axios.post("/api/users/register", {datosRegistroUsuario, proyVistas}, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log('data Register', data);
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

    // const { data } = await axios.post("/api/users/salida", { info }, {
    //   headers: {
    //     Authorization: ' Bearer ' + userInfo.token
    //   }
    // }).catch(function (error) {
    //   if (error.response) { 
    //     console.log(error.response.data);
    //     console.log(error.response.status);
    //     console.log(error.response.headers);
    //   } else if (error.request) { 
    //     console.log(error.request);
    //   } else { 
    //     console.log('Error', error.message);
    //   }
    //   console.log(error.config);
    // });

    // console.log('data logout', data)
    // if (!data.error) {
      console.log("removing cookies")
      Cookie.remove("userInfo");
      Cookie.remove("userKpiEntrada");
      Cookie.remove("userKpiAlmuerzo");
      Cookie.remove("userKpiPermisos");
      Cookie.remove("mh");

      dispatch({ type: USER_SALIDA_SUCCESS, payload: info });
      return {error: false, message:"salida exitosa"};
    

  } catch (error) {
    // console.log("error:", error);
    dispatch({ type: USER_SALIDA_FAIL, payload: error });
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


const crearOTNueva = (otInfo, archivos) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: OT_NUEVA_CREATE_REQUEST });
  try {
    // seria bueno cifrar con server.
    const { data } = await axios.post("/api/users/createotnueva", {otInfo, archivos}, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log("exito ot Nueva.", data)
    if (!data.error) {
      dispatch({ type: OT_NUEVA_CREATE_SUCCESS, payload: data });
    } else {
      dispatch({ type: OT_NUEVA_CREATE_FAIL, payload: data });
    }
  } catch (error) {
    dispatch({ type: OT_NUEVA_CREATE_FAIL, payload: error });
  }
};



const actualizarOT = (detalleSitioInfo) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: OT_ACTUALIZAR_CREATE_REQUEST });
  try {
    // seria bueno cifrar con server.
    console.log("detalleSitioInfo", detalleSitioInfo)
    const { data } = await axios.post("/api/users/actualizarot", detalleSitioInfo, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log("exito ot Nueva.", data)
    if (!data.error) {
      dispatch({ type: OT_ACTUALIZAR_CREATE_SUCCESS, payload: data });
    } else {
      dispatch({ type: OT_ACTUALIZAR_CREATE_FAIL, payload: data });
    }
  } catch (error) {
    dispatch({ type: OT_ACTUALIZAR_CREATE_FAIL, payload: error });
  }
};

const crearUsuarios = (usuarios) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
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

const crearSitios = (datosSitios) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: SITIO_CREATE_REQUEST });
  try {
    // seria bueno cifrar con server.
    const { data } = await axios.post("/api/users/createSitios", { datosSitios }, {
      headers: {
        Authorization: ' Bearer ' + userInfo.token
      }
    });
    console.log("exito frontend.", data)
    if (!data.error) {
      dispatch({ type: SITIO_CREATE_SUCCESS, payload: data });
    } else {
      dispatch({ type: SITIO_CREATE_FAIL, payload: data });
    }
  } catch (error) {
    dispatch({ type: SITIO_CREATE_FAIL, payload: error });
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
  crearOTNueva,
  actualizarOT,
  
  register,
  InfoRegister,
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
  crearSitios,
  buscarSitiosCargados,

  chgPasswordNew,
  chgPasswordUser,
  sendRecoverEmail,
  encryptPublic,
  securePassword,
  securePassword2,
  secureLogin,
  marcarTCLeido,
  usersOTs,
  archivosSitio,
  ingenieriaSitio
};
