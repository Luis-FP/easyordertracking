import { 
    KPI_PENDIENTES_REQUEST, KPI_PENDIENTES_SUCCESS, KPI_PENDIENTES_FAIL, 
    KPI_CREAR_PENDIENTES_REQUEST, KPI_CREAR_PENDIENTES_SUCCESS, KPI_CREAR_PENDIENTES_FAIL, 
    KPI_ACTUALIZAR_PENDIENTES_REQUEST, KPI_ACTUALIZAR_PENDIENTES_SUCCESS, KPI_ACTUALIZAR_PENDIENTES_FAIL, 
    KPI_GRUPO_LISTA_FAIL, KPI_GRUPO_LISTA_SUCCESS, KPI_GRUPO_LISTA_REQUEST, 
    KPI_LIST_REQUEST, KPI_LIST_SUCCESS, KPI_LIST_FAIL, KPI_USER_DETALLE_REQUEST, 
    KPI_USER_DETALLE_SUCCESS, KPI_USER_DETALLE_FAIL, 
    KPI_USER_CAMBIO_JORNADA_MIN_REQUEST, KPI_USER_CAMBIO_JORNADA_MIN_SUCCESS, KPI_USER_CAMBIO_JORNADA_MIN_FAIL, KPI_USER_CAMBIO_JORNADA_HORA_REQUEST, KPI_USER_CAMBIO_JORNADA_HORA_SUCCESS, KPI_USER_CAMBIO_JORNADA_HORA_FAIL, 
    KPI_DELETE_PENDIENTES_REQUEST, KPI_DELETE_PENDIENTES_SUCCESS, KPI_DELETE_PENDIENTES_FAIL, KPI_MODIFICAR_PENDIENTES_REQUEST, KPI_MODIFICAR_PENDIENTES_SUCCESS, KPI_MODIFICAR_PENDIENTES_FAIL, KPI_HORA_VISTA_REQUEST, KPI_HORA_VISTA_SUCCESS, KPI_HORA_VISTA_FAIL

    } from "../constants/kpiConstants";


function kpiPendientesListReducer(state = {}, action) {
    switch (action.type) {
      case KPI_PENDIENTES_REQUEST:
        return { loadingListaPendientes: true };
      case KPI_PENDIENTES_SUCCESS:
        return { loadingListaPendientes: false, pendienteReady: true, kpiPendientes: action.payload };
      case KPI_PENDIENTES_FAIL:
        return { loadingListaPendientes: false, error: action.payload };
      default: return state;
    }
  }



  function CrearPendienteReducer(state = {}, action) {
    switch (action.type) {
      case KPI_CREAR_PENDIENTES_REQUEST:
        return { loading: true };
      case KPI_CREAR_PENDIENTES_SUCCESS:
        return { loading: false, kpiNewPendiente: action.payload };
      case KPI_CREAR_PENDIENTES_FAIL:
        return { loading: false, error: action.payload };
      default: return state;
    }
  }

  function ActualizarPendienteReducer(state = {}, action) {
    switch (action.type) {
      case KPI_ACTUALIZAR_PENDIENTES_REQUEST:
        return { loadingPendiente: true };
      case KPI_ACTUALIZAR_PENDIENTES_SUCCESS:
        return { loadingPendiente: false, kpiActualizaPendiente: action.payload };
      case KPI_ACTUALIZAR_PENDIENTES_FAIL:
        return { loadingPendiente: false, error: action.payload };
      default: return state;
    }
  }

  function ModificarPendienteReducer(state = {}, action) {
    switch (action.type) {
      case KPI_MODIFICAR_PENDIENTES_REQUEST:
        return { loadingPendiente: true };
      case KPI_MODIFICAR_PENDIENTES_SUCCESS:
        return { loadingPendiente: false, pendienteModificado: true };
      case KPI_MODIFICAR_PENDIENTES_FAIL:
        return { loadingPendiente: false,  pendienteModificado: false, error: action.payload };
      default: return state;
    }
  }

  function DeletePendienteReducer(state = {}, action) {
    switch (action.type) {
      case KPI_DELETE_PENDIENTES_REQUEST:
        return { loading: true };
      case KPI_DELETE_PENDIENTES_SUCCESS:
        return { loading: false, kpiBorradoPendiente: action.payload };
      case KPI_DELETE_PENDIENTES_FAIL:
        return { loading: false, error: action.payload };
      default: return state;
    }
  }
  function kpiGrupoReducer(state = {}, action) {
    switch (action.type) {
      case KPI_GRUPO_LISTA_REQUEST:
        return { loading: true };
      case KPI_GRUPO_LISTA_SUCCESS:
        return { loading: false, kpiGrupo: action.payload };
      case KPI_GRUPO_LISTA_FAIL:
        return { loading: false, error: action.payload };
      default: return state;
    }
  }

  function kpiUserListReducer(state = {}, action) {
    switch (action.type) {
      case KPI_LIST_REQUEST:
        return { loadingMio: true };
      case KPI_LIST_SUCCESS:
        return { loadingMio: false, kpiMioList: action.payload };
      case KPI_LIST_FAIL:
        return { loadingMio: false, error: action.payload };
      default: return state;
    }
  }

  function kpiHoraVistaReducer(state = {}, action) {
    switch (action.type) {
      case KPI_HORA_VISTA_REQUEST:
        return { loading: true };
      case KPI_HORA_VISTA_SUCCESS:
        return { loading: false, horaVista: action.payload };
      case KPI_HORA_VISTA_FAIL:
        return { loading: false, errorVista: action.payload };
      default: return state;
    }
  }

  function kpiUserDetalleReducer(state = {}, action) {
    switch (action.type) {
      case KPI_USER_DETALLE_REQUEST:
        return { loading: true };
      case KPI_USER_DETALLE_SUCCESS:
        return { loading: false, kpisUserDetail: action.payload };
      case KPI_USER_DETALLE_FAIL:
        return { loading: false, error: action.payload };
      default: return state;
    }
  }
 
  function kpiUserCambioJornadaHoraReducer(state = {}, action) {
    switch (action.type) {
      case KPI_USER_CAMBIO_JORNADA_HORA_REQUEST:
        return { loading: true };
      case KPI_USER_CAMBIO_JORNADA_HORA_SUCCESS:
        return { loading: false, kpisUserJornadaHora: action.payload };
      case KPI_USER_CAMBIO_JORNADA_HORA_FAIL:
        return { loading: false, error: action.payload };
      default: return state;
    }
  }

  function kpiUserCambioJornadaMinReducer(state = {}, action) {
    switch (action.type) {
      case KPI_USER_CAMBIO_JORNADA_MIN_REQUEST:
        return { loading: true };
      case KPI_USER_CAMBIO_JORNADA_MIN_SUCCESS:
        return { loading: false, kpisUserJornadaMin: action.payload };
      case KPI_USER_CAMBIO_JORNADA_MIN_FAIL:
        return { loading: false, error: action.payload };
      default: return state;
    }
  }


  export {
    kpiPendientesListReducer, kpiHoraVistaReducer, CrearPendienteReducer, ActualizarPendienteReducer, DeletePendienteReducer,
    kpiGrupoReducer, kpiUserListReducer, kpiUserDetalleReducer, 
    kpiUserCambioJornadaHoraReducer, kpiUserCambioJornadaMinReducer, ModificarPendienteReducer
  }