import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actualizarUsuarioEnviar, infoActualizacion, buscarNombre, autoLogout, actualizarUsuarioSetOff, actualizarKPIUsuario, obtenerKPI } from "../actions/userActions";

import 'w3-css/w3.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { fechaActual, horaLocal, utcDateToLocal } from '../components/fechas';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';


import { Card, CardContent } from '@material-ui/core';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
}));

const useStylesChips = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));


const useStyles2 = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


const useStyles3 = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(40),
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Century Gothic',
    color: '#002d74'
  },
}));

const columns = [
  // { field: 'id', headerName: 'ID', type: 'text', width: 100 },
  { field: 'codigo_puesto', headerName: 'Código Puesto', width: 150 },
  { field: 'puesto', headerName: 'Puesto', width: 300 },
  { field: 'oficina', headerName: 'Oficina', width: 90 },

];



function ActualizarScreen(props) {
  const classes = useStyles();
  const classesChip = useStylesChips();
  const classes2 = useStyles2();
  const classes3 = useStyles3();


  const userInfoActualizar = useSelector(state => state.userInfoActualizar);
  const { loading, infoAct } = userInfoActualizar;

  const saveActualizar = useSelector(state => state.saveActualizar);
  const { saveAct } = saveActualizar;

  const infoBuscarNombre = useSelector(state => state.infoBuscarNombre);
  const { infoNombre } = infoBuscarNombre;

  // const userRegister = useSelector(state => state.userRegister );
  // const  {  errorRegistro, userRegisterInfo } = userRegister;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const userEntrada = useSelector(state => state.userEntrada);
  const { userKpiEntrada } = userEntrada;

  const infoKPIGet = useSelector(state => state.infoKPIGet);
  const { infoKPIActive } = infoKPIGet;

  const [open, setOpen] = React.useState(false);


  const [infoUsuarioAct, setInfoUsuarioAct] = React.useState({
    ut_id: null,
    nombre: null,
    email: "",
    id_empleado: "",
    puesto: "",
    codigo_puesto: "",
    razon_social: null,
    oficina: "",
    area: "",
    departamento: "",
    nombre_lider: null,
    id_lider: null,
    grupo: "",
    vista: null,
    isSuper: false,
    isRH: false,
    isActive: false,
    horaEntrada: null,
    minEntrada: null,
    horaSalida: null,
    minSalida: null,
    horaEntradaSabado: null,
    minEntradaSabado: null,
    horaSalidaSabado: null,
    minSalidaSabado: null,
    tiempo_comida: "",
    dias_laborables: ""
  });

  // const [selectedDateKPI, setSelectedDateKPI] = React.useState(new Date());
  const [selectedKPI, setSelectedKPI] = React.useState({
    ut_id: null,
    fecha: new Date(),
    fechaChange: false,
    entrada: null,
    entradaChange: false,
    salida: null,
    salidaChange: false,
    comidaIn: null,
    comidaInChange: false,
    comidaOut: null,
    comidaOutChange: false,
    permisoIn: null,
    permisoInChange: false,
    PermisoOut: null,
    PermisoOutChange: false

  });


  const dispatch = useDispatch();

  const handleChangeDateKPI = (date) => {

    setSelectedKPI({
      ...selectedKPI,
      fecha: date,
      fechaChange: true
    });
    console.log("obtencion de KPI")
    const infoKPIGet = {
      ut_id: infoUsuarioAct.ut_id,
      fecha: date,
    }
    dispatch(obtenerKPI(infoKPIGet))
  };




  const handleChangeTimeKPIEntrada = (time) => {
    setSelectedKPI({
      ...selectedKPI,
      entrada: time,
      entradaChange: true
    })
  };
  const handleChangeTimeKPISalida = (time) => {
    setSelectedKPI({
      ...selectedKPI,
      salida: time,
      salidaChange: true
    })
  };
  const handleChangeTimeKPIEntradaComida = (time) => {
    setSelectedKPI({
      ...selectedKPI,
      comidaIn: time,
      comidaInChange: true
    })

  };
  const handleChangeTimeKPIRegresoComida = (time) => {
    setSelectedKPI({
      ...selectedKPI,
      comidaOut: time,
      comidaOutChange: true
    })
  };
  const handleChangeTimeKPIInicioPermiso = (time) => {
    setSelectedKPI({
      ...selectedKPI,
      permisoIn: time,
      permisoInChange: true
    })
  };
  const handleChangeTimeKPIRegresoPermiso = (time) => {
    setSelectedKPI({
      ...selectedKPI,
      permisoOut: time,
      permisoOutChange: true
    })
  };


  const handleClose = () => {

    setOpen(false);
  };

const changePuestoInfo = (e) => {
  console.log('e', e)
  setInfoUsuarioAct(...infoUsuarioAct,
    {
    puesto: e.data.puesto,
    codigo_puesto: e.data.codigo_puesto,
    oficina: e.data.oficina,
    // area: (infoAct.puestos.filter(pu => pu.puesto ===   e.data.puesto) == undefined || infoAct.puestos.filter(pu => pu.puesto ===   e.data.puesto) == "") ? "":  infoAct.puestos.filter(pu => pu.puesto ===   e.data.puesto)[0].oficina,
    // departamento: (infoAct.puestos.filter(pu => pu.puesto ===  newValue) == undefined || infoAct.puestos.filter(pu => pu.puesto ===  newValue) == "") ? "":  infoAct.puestos.filter(pu => pu.puesto ===  newValue)[0].oficina,


  })
}

  useEffect(() => {
    console.log("userEffect")
    // console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy en ms", fechaActual(userKpiEntrada.data.fecha).getDate(),  new Date().getDate())
    // console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy", userKpiEntrada.data.fecha,fechaActual(userKpiEntrada.data.fecha).getDate() , new Date().getDate() )
    if (!userInfo) {
      props.history.push('/login');
    // } else if(userKpiEntrada && (new Date(userKpiEntrada.data.fecha).getUTCDate()!==fechaActual(Date.now()).getDate() ||  
  } else if(userKpiEntrada && (fechaActual(userKpiEntrada.data.fecha).getDate()!==new Date().getDate() ||  
    fechaActual(userKpiEntrada.data.fecha).getMonth()!==new Date().getMonth() || 
    fechaActual(userKpiEntrada.data.fecha).getFullYear() !== new Date().getFullYear())) {
      console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy en ms", fechaActual(userKpiEntrada.data.fecha).getDate(),  new Date().getDate())
      console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy", fechaActual(new Date(userKpiEntrada.data.fecha)), new Date())
      // //console.log("Fecha incorrecta, hay que hacer logout mes ",     fechaActual(userKpiEntrada.data.fecha).getMonth(), fechaActual(Date.now()).getMonth())
      // //console.log("Fecha incorrecta, hay que hacer logout ano", fechaActual(userKpiEntrada.data.fecha).getFullYear() , fechaActual(Date.now()).getFullYear() )
      dispatch(autoLogout())
      props.history.push('/login');
    }
    if (!infoAct) {
      dispatch(infoActualizacion());
    }
    //   if(userRegisterInfo){
    //     document.formaRegistro.reset();
    //     document.getElementById('id01').style.display='block';
    //   }
    if (infoNombre) {
      console.log("infornombre antes del save", infoNombre, infoAct);
      let grupox = infoNombre.lideres.filter(lider => lider.nombre === infoNombre.usuario.nombre_lider);
      let puesto = (infoAct.puestos.filter((pu) => pu.codigo_puesto === infoNombre.usuario.codigo_puesto) == undefined || infoAct.puestos.filter((pu) => pu.codigo_puesto === infoNombre.usuario.codigo_puesto) == "") ? "" : infoAct.puestos.filter((pu) => pu.codigo_puesto === infoNombre.usuario.codigo_puesto)[0].puesto;
      let oficina = (infoAct.puestos.filter(pu => pu.codigo_puesto === infoNombre.usuario.codigo_puesto) == undefined || infoAct.puestos.filter(pu => pu.codigo_puesto === infoNombre.usuario.codigo_puesto) == "") ? "" : infoAct.puestos.filter(pu => pu.codigo_puesto === infoNombre.usuario.codigo_puesto)[0].oficina;
      // let departamentox = (infoAct.puestos.filter(pu => pu.departamento === infoNombre.usuario.departamento) == undefined || infoAct.puestos.filter(pu => pu.departamento === infoNombre.usuario.departamento) == "") ? "" : infoAct.puestos.filter(pu => pu.departamento === infoNombre.usuario.codigo_puesto)[0].departamento;
      // let areax = (infoAct.puestos.filter(pu => pu.area === infoNombre.usuario.area) == undefined || infoAct.puestos.filter(pu => pu.area === infoNombre.usuario.area) == "") ? "" : infoAct.puestos.filter(pu => pu.area === infoNombre.usuario.area)[0].area;
      // let puestoMasCodigo = puesto + "-" + infoNombre.usuario.codigo_puesto
      console.log("grupox ", grupox)
      console.log("puesto ", infoAct.puestos)
      setSelectedKPI({ ...selectedKPI, 'ut_id': infoNombre.usuario.ut_id });
      setInfoUsuarioAct({
        ut_id: infoNombre.usuario.ut_id,
        nombre: infoNombre.usuario.nombre,
        email: infoNombre.usuario.email,
        id_empleado: infoNombre.usuario.id_empleado,
        puesto: puesto,
        codigo_puesto: infoNombre.usuario.codigo_puesto,
        razon_social: infoNombre.usuario.razon_social,
        oficina: oficina,
        area: infoNombre.usuario.area,
        departamento: infoNombre.usuario.departamento,
        nombre_lider: infoNombre.usuario.nombre_lider,
        id_lider: infoNombre.usuario.id_lider,
        grupo: grupox[0] !== undefined ? grupox[0].vista : "",
        vista: infoNombre.usuario.vista,
        isSuper: infoNombre.usuario.isSuper,
        isRH: infoNombre.usuario.isRH,
        isActive: infoNombre.usuario.isActive,
        horaEntrada: infoNombre.usuario.hora_entrada,
        minEntrada: infoNombre.usuario.minutos_entrada,
        horaSalida: infoNombre.usuario.hora_salida,
        minSalida: infoNombre.usuario.minutos_salida,
        horaEntradaSabado: infoNombre.usuario.hora_entrada_sabado,
        minEntradaSabado: infoNombre.usuario.minutos_entrada_sabado,
        horaSalidaSabado: infoNombre.usuario.hora_salida_sabado,
        minSalidaSabado: infoNombre.usuario.minutos_salida_sabado,
        tiempo_comida: infoNombre.usuario.tiempo_comida,
        dias_laborables: infoNombre.usuario.dias_laborables

      })

    }


    return () => {
      //
    }
  }, [infoNombre]); //userRegisterInfo

  useEffect(() => {

    if (saveAct) {
      console.log("exito", saveAct);
      dispatch(actualizarUsuarioSetOff());
      setInfoUsuarioAct({
        ut_id: null,
        nombre: null,
        id_empleado: "",
        puesto: "",
        codigo_puesto: "",
        email: "",
        razon_social: null,
        oficina: "",
        area: "",
        departamento: "",
        nombre_lider: null,
        id_lider: null,
        grupo: "",
        vista: null,
        isSuper: false,
        isRH: false,
        isActive: false,
        horaEntrada: null,
        minEntrada: null,
        horaSalida: null,
        minSalida: null,
        horaEntradaSabado: null,
        minEntradaSabado: null,
        horaSalidaSabado: null,
        minSalidaSabado: null,
        tiempo_comida: "",
        dias_laborables: ""
      })
      document.querySelector('#formaActualizacion').reset();
      document.querySelector('#formaIni').reset();
      setOpen(true);

    }
    return () => {
      //
    }
  }, [saveAct]); //userRegisterInfo

  useEffect(() => {

    if (infoKPIActive && selectedKPI['fechaChange'] === true) {
      console.log("exito", infoKPIActive, infoKPIActive.data.hora_entrada.fechaUT);

      setSelectedKPI({
        ...selectedKPI,
        fechaChange: false,
        entrada: infoKPIActive.data.hora_entrada && infoKPIActive.data.hora_entrada.fechaUTC ? utcDateToLocal(infoKPIActive.data.hora_entrada.fechaUTC) : null,
        entradaChange: false,
        salida: infoKPIActive.data.hora_salida && infoKPIActive.data.hora_salida.fechaUTC ? utcDateToLocal(infoKPIActive.data.hora_salida.fechaUTC) : null,
        salidaChange: false,
        comidaIn: infoKPIActive.data.hora_almuerzo_entrada && infoKPIActive.data.hora_almuerzo_entrada.fechaUTC ? utcDateToLocal(infoKPIActive.data.hora_almuerzo_entrada.fechaUTC) : null,
        comidaInChange: false,
        comidaOut: infoKPIActive.data.hora_almuerzo_salida && infoKPIActive.data.hora_almuerzo_salida.fechaUTC ? utcDateToLocal(infoKPIActive.data.hora_almuerzo_salida.fechaUTC) : null,
        comidaOutChange: false,
        permisoIn: infoKPIActive.data.hora_permiso_entrada && infoKPIActive.data.hora_permiso_entrada.fechaUTC ? utcDateToLocal(infoKPIActive.data.hora_permiso_entrada.fechaUTC) : null,
        permisoInChange: false,
        PermisoOut: infoKPIActive.data.hora_permiso_salida && infoKPIActive.data.hora_permiso_salida.fechaUTC ? utcDateToLocal(infoKPIActive.data.hora_permiso_salida.fechaUTC) : null,
        PermisoOutChange: false
      })



    }
    return () => {
      //
    }
  }, [infoKPIActive]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(actualizarUsuarioEnviar(infoUsuarioAct));

  }

  const submitHandlerKPI = (e) => {
    e.preventDefault();

    console.log("cambiando kpi", selectedKPI)
    dispatch(actualizarKPIUsuario(selectedKPI));

  }

  const manejarInputs = (event) => {
    if (['isSuper', 'isRH', 'isActive'].includes(event.target.name)) {
      setInfoUsuarioAct({ ...infoUsuarioAct, [event.target.name]: event.target.checked })
    } else {
      setInfoUsuarioAct({ ...infoUsuarioAct, [event.target.name]: event.target.value })
    }
  }

  const busqueda = (e, nombre) => {
    console.log('nombre Autocomplete', nombre)
    if (nombre) {
      dispatch(buscarNombre(nombre));
    } else {
      setInfoUsuarioAct({
        ut_id: null,
        nombre: null,
        id_empleado: "",
        puesto: null,
        codigo_puesto: null,
        email: "",
        razon_social: null,
        oficina: null,
        area: null,
        departamento: null,
        nombre_lider: null,
        id_lider: null,
        grupo: "",
        vista: null,
        isSuper: false,
        isRH: false,
        isActive: false,
        horaEntrada: null,
        minEntrada: null,
        horaSalida: null,
        minSalida: null,
        horaEntradaSabado: null,
        minEntradaSabado: null,
        horaSalidaSabado: null,
        minSalidaSabado: null,
        tiempo_comida: "",
        dias_laborables: ""
      })
    }
  }



  const miembros = () => {

    // let miembrosGrupoFiltro = infoNombre.miembros.find((grupo)=> grupo._id=== infoUsuarioAct['vista']  ).integrantes
    let miembrosGrupoFiltro = infoNombre.miembros.filter(function (grupo) {
      return grupo._id === infoUsuarioAct['vista'];
    }).map(function (integrantes) {
      return integrantes.integrantes
    })

    console.log('miembrosGrupoFiltro ', miembrosGrupoFiltro[0])
    return miembrosGrupoFiltro[0] ? miembrosGrupoFiltro[0].map(miembros => <Chip key={miembros} variant="outlined" color="primary" size="small" label={miembros} />) : null;
  }


  const jornadaFX = () => {

  
   let tiempoComida = (selectedKPI['comidaOut'] && selectedKPI['comidaIn']) ?  ((((new Date(selectedKPI['comidaOut']).getTime() ) - (new Date(selectedKPI['comidaIn']).getTime() ))/3600000).toFixed(2)) : comidaTiempo();
   let tiempoPermiso = (selectedKPI['permisoOut'] && selectedKPI['permisoIn']) ?  ((((new Date(selectedKPI['permisoOut']).getTime() ) - (new Date(selectedKPI['permisoIn']).getTime() ))/3600000).toFixed(2)) : 0
   let jornadaBasica = (selectedKPI['salida'] && selectedKPI['entrada']) ?  ((((new Date(selectedKPI['salida']).getTime() ) - (new Date(selectedKPI['entrada']).getTime() ))/3600000).toFixed(2)) - tiempoComida - tiempoPermiso : "";
  
    const jornada = "Jornada: "+ jornadaBasica;
    return jornada;
  }

  const comidaFX = () => {
    return "Comida: " + comidaTiempo();
  }

const permisoFX = () => {
  return "Permiso: " + permisoTiempo();
}

  const comidaTiempo = () =>  {
    const tiempoComidaAprobado = (selectedKPI.fecha.getUTCDay()===6 || selectedKPI.fecha.getUTCDay()===0)? 0 : infoUsuarioAct.tiempo_comida;
    let tiempoComida = (selectedKPI['comidaOut'] && selectedKPI['comidaIn']) ?  ((((new Date(selectedKPI['comidaOut']).getTime() ) - (new Date(selectedKPI['comidaIn']).getTime() ))/3600000).toFixed(2)) : tiempoComidaAprobado;
    return tiempoComida;
  }

  const permisoTiempo = () =>  {
    let tiempoPermiso = (selectedKPI['permisoOut'] && selectedKPI['permisoIn']) ?  ((((new Date(selectedKPI['permisoOut']).getTime() ) - (new Date(selectedKPI['permisoIn']).getTime() ))/3600000).toFixed(2)) : 0
    return tiempoPermiso;
  }



  return (<div className="w3-container w3-center" >

    <div className={classes3.root}>
      <Accordion expanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes3.heading}>Actualizar Usuario</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {infoAct && <div className={classes3.root}>
            <form id="formaIni" name="formaIni"
              //  className={classes.root} 
              // className="w3-margin-top w3-padding-bottom"
              onSubmit={submitHandler} >
              <FormControl fullWidth>

                <Autocomplete
                  {...{
                    options: infoAct.usuarios.map((nombre) => nombre),
                  }}
                  id="nombre"
                  // onChange= {(event, newValue) => dispatch(buscarNombre(newValue))}
                  onChange={busqueda}
                  renderInput={(params) => (
                    <TextField {...params} margin="normal" placeholder="Nombre" variant="outlined" label="Nombre y Apellido" required={true} />
                  )}
                />
                <Typography >Seleccione el nombre del usuario que desea modificar</Typography>
              </FormControl>


              {/* <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography> */}
            </form>
          </div>}
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1b-content"
          id="panel1b-header"
        >
          <Typography className={classes3.heading}>Datos del Usuario</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title" className="contenido-azul-NAD" >{"Actualización Exitosa"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description" className="contenido-verde-NAD">
                Usuario actualizado exitosamente
          </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                OK
                </Button>

            </DialogActions>
          </Dialog>
          <form id="formaActualizacion" name="formaActualizacion" className={classes.root} className="w3-margin-top w3-padding-bottom" onSubmit={submitHandler} >

            {loading && <div><AutorenewIcon className="w3-jumbo w3-text-blue w3-spin" /></div>}
            {infoUsuarioAct && console.log("infoUsuarioAct en jsx", infoUsuarioAct)}
            {infoAct && <div className={classes.root}>

              {/* <label htmlFor="name" className="contenido-verde-NAD">
                Nombre
            </label> */}

              <Grid container spacing={3}>
                {/* <Grid item xs={6}>
            <FormControl fullWidth>
                  <Autocomplete
                    {...{
                      options: infoAct.usuarios.map((nombre)=> nombre ),
                    }}
                    id="nombre"
                  // onChange= {(event, newValue) => dispatch(buscarNombre(newValue))}
                  onChange= {busqueda}
                    renderInput={(params) => (
                    <TextField {...params}  margin="normal" placeholder="Nombre" variant="outlined" label="Nombre y Apellido" required={true} /> 
                    )}
                  />
              </FormControl>
            </Grid> */}
                <Grid item xs={3} xs={12} sm={3}>
                  <FormControl fullWidth >
                    <Autocomplete
                      {...{
                        options: infoAct.rs.map((nombre) => nombre),
                      }}
                      // className={clsx(classes.margin, classes.textField)}
                      id="razon_social"
                      value={infoUsuarioAct['razon_social']}
                      onChange={(event, newValue) => setInfoUsuarioAct({ ...infoUsuarioAct, ['razon_social']: newValue })}
                      renderInput={(params) => (
                        <TextField {...params} margin="normal" placeholder="Razón Social" variant="outlined" label="Razón Social" required={true} />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth  >
                    <TextField
                      type="email"
                      name='email'
                      id="email"
                      variant="outlined"
                      label="Correo Electrónico"
                      required={true}
                      value={infoUsuarioAct['email']}
                      // onChange={(event) =>  setInfoUsuarioAct({...infoUsuarioAct, ['email']: event.target.value})}
                      onChange={manejarInputs}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={infoUsuarioAct['isActive']}
                        onChange={manejarInputs}
                        name="isActive"
                        color="primary"
                      />
                    }
                    label="Activo"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControl fullWidth >
                    <TextField
                      id="isActive"
                      type="text"
                      name='id_empleado'
                      required
                      value={infoUsuarioAct['id_empleado']}
                      onChange={manejarInputs}
                      placeholder="Id Empleado"
                      variant="outlined"
                      label="Id Empleado"
                    />
                  </FormControl>
                </Grid>

                {/* <div style={{ height: 400, width: '100%', rows:10}}>
                  <DataGrid 
                  // rows={rows}
                  rows={infoAct.puestos}
                  columns={columns} 
                  pageSize={10} 
                  onRowSelected={changePuestoInfo}
                  checkboxSelection 
                  components={{
                  Toolbar: GridToolbar,
                }}
                filterModel={{
                    items: [
                      { columnField: 'codigo_puesto', operatorValue: 'contains', value:''  },
                      { columnField: 'puesto', operatorValue: 'contains', value: ''  },
                    ],
                  }}

                  />
                </div> */}
{console.log("infoAct", infoAct)}
                <Grid item xs={6} sm={4}>
                  <FormControl fullWidth  >
                    <Autocomplete
                      {...{
                        options: infoAct.puestos.map((option) => option.puesto),
                      }}
                      id="puesto"

                      value={infoUsuarioAct['puesto']}
                      onChange={(event, newValue) => setInfoUsuarioAct({
                        ...infoUsuarioAct,
                        puesto: newValue,
                        codigo_puesto: (infoAct.puestos.filter((pu) => pu.puesto === newValue) == undefined || infoAct.puestos.filter((pu) => pu.puesto === newValue) == "") ? "" : infoAct.puestos.filter((pu) => pu.puesto === newValue)[0].codigo_puesto,
                        oficina: (infoAct.puestos.filter(pu => pu.puesto === newValue) == undefined || infoAct.puestos.filter(pu => pu.puesto === newValue) == "") ? "" : infoAct.puestos.filter(pu => pu.puesto === newValue)[0].oficina,
                        area: (infoAct.puestos.filter(pu => pu.puesto ===  newValue) == undefined || infoAct.puestos.filter(pu => pu.puesto ===  newValue) == "") ? "":  infoAct.puestos.filter(pu => pu.puesto ===  newValue)[0].area,
                        departamento: (infoAct.puestos.filter(pu => pu.puesto ===  newValue) == undefined || infoAct.puestos.filter(pu => pu.puesto ===  newValue) == "") ? "":  infoAct.puestos.filter(pu => pu.puesto ===  newValue)[0].departamento,

                      })}
                      renderInput={(params) => <TextField {...params} placeholder="Puesto" margin="normal" variant="outlined" label="Puesto" required={true} />}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControl fullWidth >
                    <TextField
                      id="codigo_puesto"
                      type="text"
                      name='codigo_puesto'
                      disabled={true}
                      value={infoUsuarioAct['codigo_puesto']}
                      variant="outlined"
                      margin="normal"
                      label="Codigo del Puesto"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControl fullWidth >
                    <TextField
                      id="oficina"
                      type="text"
                      name='oficina'
                      disabled={true}
                      value={infoUsuarioAct['oficina']}
                      variant="outlined"
                      margin="normal"
                      placeholder="Oficina"
                      label="Oficina"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <FormControl fullWidth >
                    <TextField
                      id="area"
                      type="text"
                      name='area'
                      disabled={true}
                      value={infoUsuarioAct['area']}
                      variant="outlined"
                      margin="normal"
                      label="Area"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <FormControl fullWidth >
                    <TextField
                      id="departamento"
                      type="text"
                      name='departamento'
                      disabled={true}
                      value={infoUsuarioAct['departamento']}
                      variant="outlined"
                      margin="normal"
                      label="Departamento"
                    />
                  </FormControl>
                </Grid>


                <Grid item xs={6} sm={4}>
                  <FormControl fullWidth >
                    <TextField
                      id="tiempo_comida"
                      type="number"
                      name='tiempo_comida'
                      required
                      value={infoUsuarioAct['tiempo_comida']}
                      onChange={manejarInputs}
                      placeholder="Tiempo de comida"
                      variant="outlined"
                      label="Tiempo de comida"
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth >
                    <TextField
                      id="horaEntrada"
                      type="number"
                      name='horaEntrada'
                      required={true}
                      value={Number(infoUsuarioAct['horaEntrada'])}
                      onChange={manejarInputs}
                      placeholder="Hora Entrada"
                      variant="outlined"
                      label="Hora Entrada"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth >
                    <TextField
                      id="minEntrada"
                      type="number"
                      name='minEntrada'
                      required={true}
                      value={Number(infoUsuarioAct['minEntrada'])}
                      onChange={manejarInputs}
                      placeholder="min Entrada"
                      variant="outlined"
                      label="min Entrada"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth >
                    <TextField
                      id="horaSalida"
                      type="number"
                      name='horaSalida'
                      required={true}
                      value={Number(infoUsuarioAct['horaSalida'])}
                      onChange={manejarInputs}
                      placeholder="Hora Salida"
                      variant="outlined"
                      label="Hora Salida"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth >
                    <TextField
                      id="minSalida"
                      type="number"
                      name='minSalida'
                      required={true}
                      value={Number(infoUsuarioAct['minSalida'])}
                      onChange={manejarInputs}
                      placeholder="min Salida"
                      variant="outlined"
                      label="min Salida"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControl fullWidth >
                    <TextField
                      id="dias_laborables"
                      type="number"
                      name='dias_laborables'
                      required
                      value={infoUsuarioAct['dias_laborables']}
                      onChange={manejarInputs}
                      placeholder="Días Laborables"
                      variant="outlined"
                      label="Días Laborables"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth >
                    <TextField
                      id="horaEntradaSabado"
                      type="number"
                      name='horaEntradaSabado'
                      required={true}
                      value={Number(infoUsuarioAct['horaEntradaSabado'])}
                      onChange={manejarInputs}
                      placeholder="Hora Entrada Sabado"
                      variant="outlined"
                      label="Hora Entrada Sabado"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth >
                    <TextField
                      id="minEntradaSabado"
                      type="number"
                      name='minEntradaSabado'
                      required={true}
                      value={Number(infoUsuarioAct['minEntradaSabado'])}
                      onChange={manejarInputs}
                      placeholder="min Entrada Sabado"
                      variant="outlined"
                      label="min Entrada Sabado"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth >
                    <TextField
                      id="horaSalidaSabado"
                      type="number"
                      name='horaSalidaSabado'
                      required={true}
                      value={Number(infoUsuarioAct['horaSalidaSabado'])}
                      onChange={manejarInputs}
                      placeholder="Hora Salida Sabado"
                      variant="outlined"
                      label="Hora Salida Sabado"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth >
                    <TextField
                      id="minSalidaSabado"
                      type="number"
                      name='minSalidaSabado'
                      required={true}
                      value={Number(infoUsuarioAct['minSalidaSabado'])}
                      onChange={manejarInputs}
                      placeholder="min Salida Sabado"
                      variant="outlined"
                      label="min Salida Sabado"
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={8} sm={8}>
                  <FormControl fullWidth  >
                    <Autocomplete
                      {...{
                        options: infoAct.lideres.map((option) => option.nombre),
                      }}
                      id="lider"
                      value={infoUsuarioAct['nombre_lider']}
                      onChange={(event, newValue) => {
                        console.log('newValue', newValue, "infoUsuarioAct", infoUsuarioAct, 'infoAct.lideres', infoAct.lideres)
                        console.log('grupo', infoNombre.lideres.filter(lider => lider.nombre === newValue)[0].vista)
                        setInfoUsuarioAct({
                          ...infoUsuarioAct,
                          nombre_lider: newValue,
                          grupo: infoNombre.lideres.filter(lider => lider.nombre === newValue)[0].vista
                        })
                      }}
                      renderInput={(params) => (
                        <TextField {...params} margin="normal" placeholder="Líder" variant="outlined" label="Líder" required={true} />
                      )}
                    />
                  </FormControl>
                </Grid>
                {console.log("infoUsuarioAct['grupo']", infoUsuarioAct['grupo'])}
                <Grid item xs={4} sm={4}>
                  <FormControl fullWidth >
                    <TextField
                      id="grupo"
                      type="text"
                      name='grupo'
                      required
                      value={infoUsuarioAct['grupo']}
                      // onChange={manejarInputs}
                      placeholder="Grupo"
                      variant="outlined"
                      label="Grupo"
                      disabled={true}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item xs={3} sm={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={infoUsuarioAct['isRH']}
                      onChange={manejarInputs}
                      name="isRH"
                      color="primary"
                    />
                  }
                  label="Capital Humano"
                />
              </Grid>


              <Grid item xs={3} sm={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={infoUsuarioAct['isSuper']}
                      onChange={manejarInputs}
                      name="isSuper"
                      color="primary"
                    />
                  }
                  label="Líder"
                />
              </Grid>
              <Grid item xs={6} sm={5}>
                <FormControl fullWidth  >
                  <Autocomplete
                    {...{
                      options: infoAct.lideres.map((option) => option.vista),
                    }}
                    id="vista"
                    value={infoUsuarioAct['vista']}
                    onChange={(event, newValue) => setInfoUsuarioAct({ ...infoUsuarioAct, vista: newValue })}
                    renderInput={(params) => <TextField {...params} placeholder="Vista" margin="normal" variant="outlined" label="Vista" />}
                  />
                </FormControl>
              </Grid>


            </div>}




            <div className="w3-col s12 m12 l12 w3-margin-top w3-card w3-white w3-padding">
              Miembros del Equipo:
         {infoNombre && infoAct && infoUsuarioAct &&
                <div className={classesChip.root}>{miembros()}</div>}
            </div>
            {/* <ul>{miembros().map((empleado) => <li className="w3-ul w3-border">{empleado}</li>) }</ul>} */}



            <div className="w3-col s12 m12 l12 w3-margin-top">
              <button
                type="submit"
                onSubmit={() => submitHandler()}
                //  disabled={true}
                className="w3-button w3-round full-width90 w3-blue" >Actualizar Usuario</button>
            </div>
            {/* disabled="true" */}
          </form>

        </AccordionDetails>
      </Accordion>
    </div>

    {/* <h2 className="contenido-azul-NAD w3-xlarge">Actualizar Usuario</h2> */}
    {/* {errorRegistro && <div className="w3-border w3-round w3-red w3-text-white">{errorRegistro}</div>} */}
    <Accordion >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1c-content"
        id="panel1c-header"
      >
        <Typography className={classes3.heading}>KPIs del Usuario</Typography>


      </AccordionSummary>
      <AccordionDetails>
        {/* <h4 className="contenido-azul-NAD w3-xlarge">Ajuste de KPI</h4> */}
        <form id="formaAjusteKPI" name="formaAjusteKPI"
        // className={classes.root}  className="w3-margin-top w3-padding-bottom"
         onSubmit={submitHandlerKPI} 
        >

          {selectedKPI && console.log('selectedKPI', selectedKPI)}
          <Typography className={classes3}>Seleccione la fecha del KPI que desea modificar</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="fechaKPI"
              autoOk={true}
              label="Fecha KPI"
              format="dd/MMM/yyyy"
              value={selectedKPI['fecha']}
              // defaulValue={selectedDateKPI}
              onChange={handleChangeDateKPI}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>

            <Card className={classes3.root}>
              <CardContent>

                {console.log("selectedKPI['entrada']",
                  selectedKPI['entrada'] && utcDateToLocal(selectedKPI['entrada']),
                  selectedKPI['entrada'],
                  new Date(selectedKPI['entrada']).getTimezoneOffset(),
                  new Date(selectedKPI['entrada']).getTimezoneOffset() / 60 * -1,
                  new Date(selectedKPI['entrada']).getTime() + new Date(selectedKPI['entrada']).getTimezoneOffset() / 60 * -1 * 3600000,
                  new Date(new Date(selectedKPI['entrada']).getTime() + new Date(selectedKPI['entrada']).getTimezoneOffset() / 60 * -1 * 3600000))
                }
                <Grid item xs={12}>
                <KeyboardTimePicker
                  margin="normal"
                  id="timePHoraEntrada"

                  label="Hora Entrada"
                  value={selectedKPI['entrada']}
                  onChange={handleChangeTimeKPIEntrada}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />

                <KeyboardTimePicker
                  margin="normal"
                  id="timePHoraSalida"
                  className="contenido-azul-NAD w3-large"
                  label="Hora Salida"
                  value={selectedKPI['salida']}
                  onChange={handleChangeTimeKPISalida}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />

                <Chip label= {jornadaFX().toString()}
                color="primary"
                variant="outlined" />

                <KeyboardTimePicker
                  margin="normal"
                  id="timePEntradaComida"
                  label="Hora Entrada Comida"
                  value={selectedKPI['comidaIn'] }
                  onChange={handleChangeTimeKPIEntradaComida}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />

                <KeyboardTimePicker
                  margin="normal"
                  id="timePRegresoComida"
                  label="Hora Regreso Comida"
                  value={selectedKPI['comidaOut'] }
                  onChange={handleChangeTimeKPIRegresoComida}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
                <Chip label={comidaFX()}
                color="primary"
                variant="outlined" />
 
                      </Grid>
                      <Grid item xs={12}>
                <KeyboardTimePicker
                  margin="normal"
                  id="timePInicioPermiso"
                  label="Hora Inicio Permiso"
                  value={selectedKPI['permisoIn'] }
                  onChange={handleChangeTimeKPIInicioPermiso}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />

                <KeyboardTimePicker
                  margin="normal"
                  id="timePRegresoPermiso"
                  label="Hora Regreso Permiso"
                  value={selectedKPI['permisoOut'] }
                  onChange={handleChangeTimeKPIRegresoPermiso}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
                <Chip label={permisoFX()}
                color="primary"
                variant="outlined" />
          
                    
                    </Grid>
              </CardContent>
            </Card>
         
          </MuiPickersUtilsProvider>
          <button
            type="submit"

            //  disabled={true}
            className="w3-button w3-round full-width90 w3-light-green" >Actualizar KPI</button>
        </form>
      </AccordionDetails>
    </Accordion>
    <div className="paddingFin"></div>
  </div>)
}

export default ActualizarScreen;


