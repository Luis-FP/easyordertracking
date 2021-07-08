import axios from "axios";

import {
    KPI_PENDIENTES_REQUEST, KPI_PENDIENTES_SUCCESS, KPI_PENDIENTES_FAIL, 
    KPI_CREAR_PENDIENTES_REQUEST, KPI_CREAR_PENDIENTES_SUCCESS, KPI_CREAR_PENDIENTES_FAIL, 
    KPI_ACTUALIZAR_PENDIENTES_FAIL, KPI_ACTUALIZAR_PENDIENTES_SUCCESS, KPI_ACTUALIZAR_PENDIENTES_REQUEST, 
    KPI_DELETE_PENDIENTES_FAIL, KPI_DELETE_PENDIENTES_SUCCESS, KPI_DELETE_PENDIENTES_REQUEST, 
    KPI_GRUPO_LISTA_REQUEST, KPI_GRUPO_LISTA_SUCCESS, KPI_GRUPO_LISTA_FAIL, KPI_LIST_FAIL, KPI_LIST_SUCCESS, 
    KPI_LIST_REQUEST, KPI_USER_DETALLE_FAIL, KPI_USER_DETALLE_SUCCESS, KPI_USER_DETALLE_REQUEST, 
    KPI_USER_CAMBIO_JORNADA_HORA_FAIL, KPI_USER_CAMBIO_JORNADA_HORA_SUCCESS, KPI_USER_CAMBIO_JORNADA_HORA_REQUEST, KPI_MODIFICAR_PENDIENTES_REQUEST, KPI_MODIFICAR_PENDIENTES_SUCCESS, KPI_MODIFICAR_PENDIENTES_FAIL, KPI_HORA_VISTA_REQUEST, KPI_HORA_VISTA_SUCCESS, KPI_HORA_VISTA_FAIL
  } from "../constants/kpiConstants";
 
  const userKpiList = () => async (dispatch, getState) => {

    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_LIST_REQUEST});
    dispatch({ type: KPI_HORA_VISTA_REQUEST});

    try {

      const {  data  } = await axios.get("/api/kpis/mine",  { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });
      
      console.log("Data horaVista",data.data.horaVista);
      dispatch({ type: KPI_LIST_SUCCESS, payload: data});

      dispatch({ type: KPI_HORA_VISTA_SUCCESS, payload: data.data.horaVista})
      

    } catch (error) {
      // //console.log"error:",error);
      dispatch({ type: KPI_LIST_FAIL, payload: error.message });
    }
  }

  
  const horaVistaHoy = (estatus) => async (dispatch, getState) => {

    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_HORA_VISTA_REQUEST});

    try {

      const {  data  } = await axios.post("/api/kpis/horavista", {estatus,userInfo}, { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });
 
        dispatch({ type: KPI_HORA_VISTA_SUCCESS, payload: data});
     console.log("horaVista",data);
    } catch (error) {
      // //console.log"error:",error);
      dispatch({ type: KPI_HORA_VISTA_FAIL, payload: error.message });
    }
  }

  const userPendientesList = () => async (dispatch, getState) => {

    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_PENDIENTES_REQUEST});

    try {

      const {  data  } = await axios.get("/api/pendientes/mine",  { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });
 
        dispatch({ type: KPI_PENDIENTES_SUCCESS, payload: data});
     //console.log"Data",data);
    } catch (error) {
      // //console.log"error:",error);
      dispatch({ type: KPI_PENDIENTES_FAIL, payload: error.message });
    }
  }

  const crearPendiente = (pendienteNuevo, compromiso, entregable) => async (dispatch, getState) => {

    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_CREAR_PENDIENTES_REQUEST});

    try {

      const {  data  } = await axios.post("/api/pendientes/crear", {pendienteNuevo, compromiso, entregable}, { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });
 
        dispatch({ type: KPI_CREAR_PENDIENTES_SUCCESS, payload: data});
     //console.log"Data",data);
    } catch (error) {
      // //console.log"error:",error);
      dispatch({ type: KPI_CREAR_PENDIENTES_FAIL, payload: error.message });
    }
  }

  const crearPendienteManager = (idUserDetail, pendienteNuevo, compromiso, entregable) => async (dispatch, getState) => {

    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_CREAR_PENDIENTES_REQUEST});

    try {

      const {  data  } = await axios.post("/api/pendientes/crearmanager", {idUserDetail, pendienteNuevo, compromiso, entregable}, { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });
      const { message } = await axios.post( // envio del email
        "/api/email/pendiente", 
        {idUserDetail, pendienteNuevo, compromiso, entregable},
        {
          headers: {
            Authorization: " Bearer " + userInfo.token,
          },
        }
      );
        dispatch({ type: KPI_CREAR_PENDIENTES_SUCCESS, payload: data});
     //console.log"Data",data);
    } catch (error) {
      // //console.log"error:",error);
      dispatch({ type: KPI_CREAR_PENDIENTES_FAIL, payload: error.message });
    }
  };

  const actualizarPendiente = (update) => async (dispatch, getState) => {

    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_ACTUALIZAR_PENDIENTES_REQUEST});

    try {

      const {  data  } = await axios.post("/api/pendientes/actualizar", update, { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });
 
        dispatch({ type: KPI_ACTUALIZAR_PENDIENTES_SUCCESS, payload: data});
     //console.log"Data",data);
    } catch (error) {
      // //console.log"error:",error);
      dispatch({ type: KPI_ACTUALIZAR_PENDIENTES_FAIL, payload: error.message });
    }
  }

  

  const modificarPendiente = (update) => async (dispatch, getState) => {

    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_MODIFICAR_PENDIENTES_REQUEST});

    try {

      const {  data  } = await axios.post("/api/pendientes/modificar", update, { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });
 
        dispatch({ type: KPI_MODIFICAR_PENDIENTES_SUCCESS, payload: data});
     console.log("Data",data);
    } catch (error) {
      // console.log("error:",error);
      dispatch({ type: KPI_MODIFICAR_PENDIENTES_FAIL, payload: error.message });
    }
  }

  const deletePendiente = (pendiente) => async (dispatch, getState) => {

    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_DELETE_PENDIENTES_REQUEST});

    try {

      const {  data  } = await axios.post("/api/pendientes/delete", {pendiente}, { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });
 
        dispatch({ type: KPI_DELETE_PENDIENTES_SUCCESS, payload: data});
     //console.log"Data",data);
    } catch (error) {
      // //console.log"error:",error);
      dispatch({ type: KPI_DELETE_PENDIENTES_FAIL, payload: error.message });
    }
  };
  
  const grupoLista = () => async (dispatch, getState) => {
 
    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_GRUPO_LISTA_REQUEST});

    try { 
      //console.log"antes axios");
      const {  data  } = await axios.get("/api/kpis/listagrupo", { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });

        dispatch({ type: KPI_GRUPO_LISTA_SUCCESS, payload: data});
     //console.log"Data",data);
    } catch (error) {
      // //console.log"error:",error);
      dispatch({ type: KPI_GRUPO_LISTA_FAIL, payload: error.message });
    }
  }

  const userKpiDetalle = (infoDetalleSearch) => async (dispatch, getState) => {

    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_USER_DETALLE_REQUEST});

    try {

      const {  data  } = await axios.post("/api/kpis/kpisuser", infoDetalleSearch, { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });

        dispatch({ type: KPI_USER_DETALLE_SUCCESS, payload: data});
     //console.log"Data",data);
    } catch (error) {
      // //console.log"error:",error);
      dispatch({ type: KPI_USER_DETALLE_FAIL, payload: error.message });
    }
  };
 
  const ajusteJornadaHora = (idUser, cambioJornada) => async (dispatch, getState) => {

    const { userSignin: { userInfo } } = getState();

    dispatch({ type: KPI_USER_CAMBIO_JORNADA_HORA_REQUEST});

    try {

      const {  data  } = await axios.post("/api/kpis/kpisuserjornadahora", {idUser, cambioJornada}, { headers: {
        Authorization: ' Bearer ' + userInfo.token}
      });

        dispatch({ type: KPI_USER_CAMBIO_JORNADA_HORA_SUCCESS, payload: data});
     //console.log"Data",data);
    } catch (error) {
      // //console.log"error:",error);
      dispatch({ type: KPI_USER_CAMBIO_JORNADA_HORA_FAIL, payload: error.message });
    }
  };


  
  export { userPendientesList, crearPendiente, crearPendienteManager, actualizarPendiente, horaVistaHoy,
     grupoLista, userKpiList, userKpiDetalle , deletePendiente, ajusteJornadaHora, modificarPendiente};