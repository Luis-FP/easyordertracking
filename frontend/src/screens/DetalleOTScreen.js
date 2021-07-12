import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actualizarOT } from "../actions/userActions";
import { Gauge } from '../components/ReactGauge';
import { queFecha, horaLocal, fechaActual, fechaUnica } from '../components/fechas';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import CssBaseline from '@material-ui/core/CssBaseline';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles, useTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    color: 'green',
    textTransform: 'capitalize',
    textAlign:'center',
  },
  title2: {
    fontSize: 25,
    color: 'white',
    backgroundColor:'grey',
    border:'30px',
    textTransform: 'capitalize',
    textAlign:'center'
  },
  subtitle: {
    fontSize: 15,
    color: 'blue',
    textAlign:'left'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    fullWidth: 'true',
  },
  table: {
    // minWidth: 650,
  },
  multitexto: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
     
    },
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  nextButton: {
    aligned: 'right',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontSize: 20,
    color:"blue"
  },
  fab: {
    position: 'absolute',
    top: theme.spacing(22),
    right: theme.spacing(26),
  },
}));

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

function getSteps() {
  return [
  {_id:"p1", titulo:'Solicitudes Nuevas', codigo:'ini', paso:0},
  {_id:"p2",titulo:'Programación y Asignación', codigo:'plan', paso:1},
  {_id:"p3",titulo:'Revision con Cliente', codigo:'rev', paso:2},
  {_id:"p4",titulo:'En Ejecución', codigo:'ejec', paso:3},
  {_id:"p5",titulo:'Revisión de Calidad', codigo:'qa', paso:4},
  {_id:"p6",titulo:'Finalizado Entregado', codigo:'entregado', paso:5},
  {_id:"p7",titulo:'Aprobado por Cliente', codigo:'aprobado', paso:6},
  {_id:"p8",titulo:'Facturación', codigo:'facturacion', paso:7},
  {_id:"p9",titulo:'pagado', codigo:'pagado', paso:8},
]}


function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return getSteps()[stepIndex];
    case 1:
      return getSteps()[stepIndex];
    case 2:
      return getSteps()[stepIndex];
    case 3:
      return getSteps()[stepIndex];
    case 4:
      return getSteps()[stepIndex];
    case 5:
      return getSteps()[stepIndex];
    case 6:
      return getSteps()[stepIndex];
    case 7:
      return getSteps()[stepIndex];
    case 8:
      return getSteps()[stepIndex];
    default:
      return 'Error';
  }
}

const prioridades = [
  'Normal',
  'Alta',
  'Inmediata',
]


function DetalleOTScreen(props) {
  
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const userDetallesSitio = useSelector(state => state.userDetallesSitio);
  const { detallesSitio } = userDetallesSitio;
  const dispatch = useDispatch();

  const classes = useStyles();
  const theme = useTheme();
  const [edit, setEdit] = React.useState(false);
  const [state, setState] = React.useState({
    checkedDetalles: false,
    checkedProcesos: false
  });
  const handleChangeSwitch = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
 
  const steps = getSteps();
  const responsablesOT = [
    {_id:"r1", responsable_ot:'Bayardo', email_responsable_ot:'bayardo@gmail.com'},
    {_id:"r2", responsable_ot:'Royer', email_responsable_ot:'royer@gmail.com'},
  ];

console.log( responsablesOT.map((option) => {
  return(<MenuItem key={option._id} selected={option === ''}  >
    {option}
  </MenuItem>)
}));

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setDetalleSitioInfo( {
      ...detalleSitioInfo,
      ['estado']: getStepContent(activeStep+1).codigo,
      ['estadoChange']: true,
  })
  console.log('detalleSitioInfo', detalleSitioInfo['estado'],'getStep', getStepContent(activeStep+1).codigo)
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setDetalleSitioInfo({
      ...detalleSitioInfo,
      ['estado']: getStepContent(activeStep-1).codigo,
      ['estadoChange']: true,
  })
};

  const handleReset = () => {
    setActiveStep(0);
  };

  // const [selectedDate, setSelectedDate] = React.useState(rows);

  const [detalleSitioInfo, setDetalleSitioInfo] = React.useState({
      cliente: detallesSitio? detallesSitio.data[0].cliente : "",
      detalle_requerimiento: detallesSitio? detallesSitio.data[0].detalle_requerimiento: "",
      detallesSitio: detallesSitio? detallesSitio.data[0].detallesSitio: "",
      email_responsable_cliente: detallesSitio? detallesSitio.data[0].email_responsable_cliente: "",
      estado: detallesSitio? detallesSitio.data[0].estado: "",
      fecha_requerida: detallesSitio? detallesSitio.data[0].fecha_requerida: "",
      ot_number: detallesSitio? detallesSitio.data[0].ot_number: "",
      pais: detallesSitio? detallesSitio.data[0].pais: "",
      prioridad: detallesSitio? detallesSitio.data[0].prioridad: "",
      proyecto: detallesSitio? detallesSitio.data[0].proyecto: "",
      requerimiento: detallesSitio? detallesSitio.data[0].requerimiento: "",
      responsable_cliente: detallesSitio? detallesSitio.data[0].responsable_cliente: "",
      sitio_codigo: detallesSitio? detallesSitio.data[0].sitio_codigo: "",
      sitio_nombre: detallesSitio? detallesSitio.data[0].sitio_nombre: "",
      responsable_ot: detallesSitio? detallesSitio.data[0].responsable_ot: "",
      comentarios_responsable_ot: detallesSitio? detallesSitio.data[0].comentarios_responsable_ot: "",
    });
    // const pasoInicial = getSteps().filter(paso => detalleSitioInfo && paso.codigo===detalleSitioInfo.estado)[0].paso
    //  console.log(pasoInicial)
    const [activeStep, setActiveStep] = React.useState(0);


  const handleChange = (event) => {
    const name = event.target.name;
    setDetalleSitioInfo({
      ...detalleSitioInfo,
      [name]: event.target.value,
    });
  };

 


  useEffect(() => {

    
    if (!userInfo ) {
      props.history.push('/login');

  }

  if(detallesSitio){
    setDetalleSitioInfo({
      cliente: detallesSitio.data[0].cliente,
      detalle_requerimiento: detallesSitio.data[0].detalle_requerimiento,
      detallesSitio: detallesSitio.data[0].detallesSitio,
      email_responsable_cliente: detallesSitio.data[0].email_responsable_cliente,
      estado: detallesSitio.data[0].estado,
      fecha_requerida: detallesSitio.data[0].fecha_requerida,
      ot_number: detallesSitio.data[0].ot_number,
      pais: detallesSitio.data[0].pais,
      prioridad: detallesSitio.data[0].prioridad,
      proyecto: detallesSitio.data[0].proyecto,
      requerimiento: detallesSitio.data[0].requerimiento,
      responsable_cliente: detallesSitio.data[0].responsable_cliente,
      sitio_codigo: detallesSitio.data[0].sitio_codigo,
      sitio_nombre: detallesSitio.data[0].sitio_nombre,
      responsable_ot: detallesSitio.data[0].responsable_ot? detallesSitio.data[0].responsable_ot :"Sin Asignar" ,
      email_responsable_ot: detallesSitio.data[0].email_responsable_ot? detallesSitio.data[0].email_responsable_ot :"" ,
      comentarios_responsable_ot: detallesSitio? detallesSitio.data[0].comentarios_responsable_ot: "",
      altura_pararrayos:  detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].altura_pararrayos: "",
      altura_validada:  detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].altura_validada: "",
      area_a_utilizar:  detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].area_a_utilizar: "",
      area_arrendada:  detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].area_arrendada: "",
      arrendatario:  detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].arrendatario: "",
      identificacion_arrendatario:  detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].identificacion_arrendatario: "",
      departamento:  detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].departamento: "",
      direccion_sitio: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].direccion_sitio: "",
      latitud_validada_grados: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].latitud_validada_grados: "",
      longitud_validada_grados: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].longitud_validada_grados: "",
      numero_finca: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].numero_finca: "",
      orientacion_torre: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].orientacion_torre: "",
      pais: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].pais: "",
      provincia: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].provincia: "",
      proyecto: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].proyecto: "",
      resistencia_viento: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].resistencia_viento: "",
      tipo_estructura:detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].tipo_estructura: "",
      tipologia_sitio: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].tipologia_sitio: "",
      tx: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].tx: "",
      derecho_paso_sitio: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].derecho_paso_sitio: "",
      electricidad_sitio: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].electricidad_sitio: "",
      observaciones_sitio: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].observaciones_sitio: "",
// flag cambio
      clienteChange: false,
      detalle_requerimientoChange: false,
      detallesSitioChange: false,
      email_responsable_clienteChange: false,
      estado:  false,
      fecha_requeridaChange: false,
      ot_numberChange: false,
      paisChange: false,
      prioridadChange: false,
      proyectoChange: false,
      requerimientoChange: false,
      responsable_clienteChange: false,
      sitio_codigoChange: false,
      sitio_nombreChange: false,
      responsable_otChange: false,
      email_responsable_otChange: false,
      comentarios_responsable_otChange: false,
      altura_pararrayosChange: false,
      altura_validadaChange: false,
      area_a_utilizarChange: false,
      area_arrendadaChange: false,
      arrendatarioChange: false,
      identificacion_arrendatarioChange: false,
      departamentoChange: false,
      direccion_sitioChange: false,
      latitud_validada_gradosChange: false,
      longitud_validada_gradosChange: false,
      numero_fincaChange: false,
      orientacion_torreChange: false,
      paisChange: false,
      provinciaChange: false,
      proyectoChange: false,
      resistencia_vientoChange: false,
      tipo_estructuraChange: false,
      tipologia_sitioChange: false,
      txChange: false,
      derecho_paso_sitioChange: false,
      electricidad_sitioChange: false,
      observaciones_sitioChange: false,
    });
    setActiveStep(getSteps().filter(paso => paso.codigo===detallesSitio.data[0].estado)[0].paso)
  }

    return () => {
 
    };
  }, [ detallesSitio]);
  

  const handleProceso = (e) =>{
    e.preventDefault();
    console.log("a grabar!", detalleSitioInfo)
    dispatch(actualizarOT(detalleSitioInfo))
  }

  return (<div>
     <React.Fragment>
      <CssBaseline />
      <Container width="70%">
      <form autoComplete onSubmit={handleProceso}>
    <Grid container margintop className={classes.root} spacing={2}>
        <Grid item xs={12}>  

          <Paper elevation={5} className={classes.title2} >
          {detallesSitio && detallesSitio.data.length>0 && <div>
            <Typography  className={classes.title2} >
            {"OT #" + detallesSitio.data[0].ot_number+' Cliente: '+detallesSitio.data[0].cliente  }
          </Typography>
          <div>Sitio:  {detallesSitio.data[0].sitio_codigo + " - " +  detallesSitio.data[0].sitio_nombre} </div>
          <div>Proyecto: {detallesSitio.data[0].proyecto + " - " +  detallesSitio.data[0].pais} </div></div>}
          </Paper>
        </Grid>

        
                { detallesSitio && 
                <Grid item xs={12} sm={12} container>
                <Fab color="primary" aria-label="add" className={classes.fab} type="submit">
                  <SaveIcon />
                </Fab>
                <Grid item xs={12} sm={4}> 
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="responsable_cliente">Responsable Cliente</InputLabel>
                      <OutlinedInput id="responsable_cliente" value={detalleSitioInfo['responsable_cliente']} 
                      disabled="true" 
                      label="Responsable Cliente" 
                      fullWidth="true" />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}> 
                    <Autocomplete
                        id="prioridad"
                        required={true}
                        onChange={(e, value)=> setDetalleSitioInfo({...detalleSitioInfo, ['prioridad']:value , ['prioridadChange']:true })}
                        options={prioridades}
                        getOptionLabel={(option) => option}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Prioridad" variant="outlined" />}
                        value={detalleSitioInfo['prioridad']} 
                      />
                   

                    </Grid>
                    <Grid item xs={12} sm={4}> 
                    <Autocomplete
                        id="responsable_ot"
                        required={true}
                        onChange={(e, value)=> setDetalleSitioInfo({...detalleSitioInfo, ['responsable_ot']:value.responsable_ot, ['email_responsable_ot']:value.email_responsable_ot,  
                         ['responsable_otChange']:true , ['email_responsable_otChange']:true })}
                        options={responsablesOT}
                        getOptionLabel={(option) => option.responsable_ot}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Responsable OT" variant="outlined" />}
                        value={detalleSitioInfo['responsable_ot']} 
                      />
                    
                    </Grid>
                    <Grid item md={3}  xs={5}  sm={5}> 
                      
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                     
                        <KeyboardDatePicker
                        
                          margin="normal"
                          disabled={userInfo.isSuper? true : false}
                          id="fecha_sla"
                          label="Fecha SLA"
                          format="MM/dd/yyyy"
                          value={detalleSitioInfo['fecha_sla']}
                          onChange={(date)=> setDetalleSitioInfo({...detalleSitioInfo, ['fecha_sla']: new Date(date),  ['fecha_slaChange']:true})}
                          KeyboardButtonProps={{
                            'aria-label': 'change date', 
                          }}
                        />
                        </MuiPickersUtilsProvider>
                    </Grid>
                      <Grid item md={4}  xs={6}  sm={6}> 
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="fecha_requerida"
                        label="Fecha Requerida"
                        format="MM/dd/yyyy"
                        onChange={(date)=> setDetalleSitioInfo({...detalleSitioInfo, ['fecha_requerida']: new Date(date), ['fecha_requeridaChange']:true})}
                        value={detalleSitioInfo['fecha_requerida']}
                        disabled={userInfo.isSuper? true : false}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                      </MuiPickersUtilsProvider>
                      </Grid>
                {activeStep === steps.length ? (
                          <div>
                            <Typography className={classes.instructions}>Proceso Terminado</Typography>
                            <Button onClick={handleReset}>Reset</Button>
                          </div>
                        ) : (
                          <div style={{width:'100%', alignItems:'center'}}>
                          <Grid item xs={12} sm={12} container>
                          <Grid item xs={3} sm={3}> 
                              <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={classes.backButton}
                              >
                                Atras
                              </Button>
                             
                            </Grid>
                            <Grid item xs={6} sm={6}> 
                            Proceso:<Button className={classes.instructions}> {getStepContent(activeStep).titulo}</Button>
                            </Grid>
                            <Grid item xs={3} sm={3}> 
                            <Button variant="contained" color="primary" className={classes.nextButton} onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Próximo'}
                              </Button>
                              </Grid>
                            </Grid>
                          </div>
                          
                        )}
                <div className={classes.root}>
                      <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (userInfo.isSuper===false && index< 7) || (userInfo.isSuper===true ) && (
                          <Step key={label.id}>
                            <StepLabel>{label.titulo}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
          
                    </div>

                    <Grid item xs={4} sm={4}> 
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel htmlFor="Requerimiento">Requerimiento</InputLabel>
                      <OutlinedInput id="Requerimiento" value={detalleSitioInfo['requerimiento']} 
                      onChange={(e)=> setDetalleSitioInfo({...detalleSitioInfo, ['requerimiento']: e, ['requerimientoChange']:true})}
                      disabled={userInfo.isSuper? true : false}
                      label="Requerimiento" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={8} sm={8}> 
                    <TextField
                                  id="Detalle"
                                  label="Detalle"                               
                                  multiline
                                  rows={4}
                                  variant="outlined"
                                  fullWidth
                                  disabled={userInfo.isSuper? true : false}
                                  value={detalleSitioInfo['detalle_requerimiento']} 
                                  onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['detalle_requerimiento']:value, ['detalle_requerimientoChange']:true })}
                                />
                    </Grid>
                    <Grid item xs={12} sm={12}> 
                    <TextField
                                  id="comentarios_responsable_ot"
                                  label="Comentarios de Ingeniería"
                                  disabled={userInfo.isSuper? false : true}
                                  multiline
                                  rows={4}
                                  placeholder="Comente cualquier observación sobre esta Orden de Trabajo..."
                                  variant="outlined"
                                  fullWidth
                                  value={detalleSitioInfo['comentarios_responsable_ot']} 
                                  onChange={(e)=> setDetalleSitioInfo({...detalleSitioInfo, ['comentarios_responsable_ot']:e.target.value, ['comentarios_responsable_otChange']:true })}
                                />
                    </Grid>
              </Grid>}

                            <Grid  container>
                          
                            <Grid item xs={12} sm={12} >
                             <FormControlLabel
                                control={
                                  <Switch
                                    checked={state.checkedDetalles}
                                    onChange={handleChangeSwitch}
                                    name="checkedDetalles"
                                    color="primary"
                                  />
                                }
                                label="Detalles del Sitio"
                              />
                            </Grid>
                           
                            {state.checkedDetalles && <Grid  container>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="tipo_estructura">Tipo de Estructura</InputLabel>
                                        <OutlinedInput id="tipo_estructura" value={detalleSitioInfo['tipo_estructura']} 
                                        disabled={userInfo.isSuper? true : false}
                                        onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['tipo_estructura']:value, ['tipo_estructuraChange']:true })}
                                        label="Tipo de Estructura" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="area">Área Rentada</InputLabel>
                                        <OutlinedInput id="area" value={detalleSitioInfo['area_arrendada']}
                                         onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['area_arrendada']:value, ['area_arrendadaChange']:true })}
                                         label="Área Rentada" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="area_a_utilizar">Area a Utilizar</InputLabel>
                                        <OutlinedInput id="area_a_utilizar" value={detalleSitioInfo['area_a_utilizar']}
                                         onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['area_a_utilizar']:value, ['area_a_utilizarChange']:true })}
                                         label="Área a Utilizar" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="tipologia_sitio">Tipologia Sitio</InputLabel>
                                        <OutlinedInput id="tipologia_sitio" value={detalleSitioInfo['tipologia_sitio']} 
                                        onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['tipologia_sitio']:value, ['tipologia_sitioChange']:true })}
                                        label="Tipología Sitio" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="arrendatario">Arrendatario/Propietario</InputLabel>
                                        <OutlinedInput id="arrendatario" value={detalleSitioInfo['arrendatario']} 
                                        onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['arrendatario']:value, ['arrendatarioChange']:true })}
                                        label="Arrendatario/Propietario" />
                                      </FormControl>
                              </Grid>
                             
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="identificacion_arrendatario">Identificacion Arrendatario</InputLabel>
                                        <OutlinedInput id="identificacion_arrendatario" value={detalleSitioInfo['identificacion_arrendatario']} 
                                        onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['identificacion_arrendatario']:value, ['identificacion_arrendatarioChange']:true })}
                                        label="Identificacion Arrendatario" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="numero_finca">Número de Finca</InputLabel>
                                        <OutlinedInput id="numero_finca" value={detalleSitioInfo['numero_finca']}
                                         onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['numero_finca']:value, ['numero_fincaChange']:true })} 
                                         label="Número de Finca" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                              <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="direccion_sitio">Direccion de la Finca</InputLabel>
                                        <OutlinedInput id="direccion_sitio" value={detalleSitioInfo['direccion_sitio']} 
                                        onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['direccion_sitio']:value, ['direccion_sitioChange']:true })} 
                                        label="Direccion de la Finca" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="provincia">Provincia</InputLabel>
                                        <OutlinedInput id="provincia" value={detalleSitioInfo['provincia']} 
                                        onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['provincia']:value, ['provinciaChange']:true })}  
                                        label="Provincia" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="departamento">Departamento</InputLabel>
                                        <OutlinedInput id="departamento" value={detalleSitioInfo['departamento']}
                                         onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['departamento']:value, ['departamentoChange']:true })}  
                                         label="Departamento" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="latitud_validada_grados">Latitud Validada en Grados</InputLabel>
                                        <OutlinedInput id="latitud_validada_grados" value={detalleSitioInfo['latitud_validada_grados']} 
                                        onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['latitud_validada_grados']:value, ['latitud_validada_gradosChange']:true })}  
                                        label="Latitud Validada en Grados" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="longitud_validada_grados">Longitud Validada en Grados</InputLabel>
                                        <OutlinedInput id="longitud_validada_grados" value={detalleSitioInfo['longitud_validada_grados']} 
                                        onChange={(value)=> setDetalleSitioInfo({...detalleSitioInfo, ['longitud_validada_grados']:value, ['longitud_validada_gradosChange']:true })} 
                                        label="Longitud Validada en Grados" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={12} className={classes.multitexto}> 
                       
                              <TextField
                                  id="derecho_paso_sitio"
                                  label="Información Derecho de Paso"
                                  multiline
                                  rows={4}
                                  placeholder="describa el Derecho de paso..."
                                  variant="outlined"
                                  fullWidth
                                  disabled={userInfo.isSuper? true : false}
                                  value={detalleSitioInfo['derecho_paso_sitio']} 
                                  onChange={(e)=> setDetalleSitioInfo({...detalleSitioInfo, ['derecho_paso_sitio']:e.target.value , ['derecho_paso_sitioChange']:true })}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} className={classes.multitexto}> 

                              <TextField
                                  id="electricidad_sitio"
                                  label="Información Energia Eléctrica"
                                  multiline
                                  rows={4}
                                  placeholder="Datos de la electricidad del sitio..."
                                  variant="outlined"
                                  fullWidth
                                  disabled={userInfo.isSuper? true : false}
                                  value={detalleSitioInfo['electricidad_sitio']} 
                                  onChange={(e)=> setDetalleSitioInfo({...detalleSitioInfo, ['electricidad_sitio']:e.target.value, ['electricidad_sitioChange']:true })}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} className={classes.multitexto}> 

                              <TextField
                                  id="observaciones_sitio"
                                  label="Observaciones del Sitio"
                                  multiline
                                  rows={4}
                                  defaultValue="Observaciones del sitio..."
                                  variant="outlined"
                                  fullWidth
                                  disabled={userInfo.isSuper? true : false}
                                  value={detalleSitioInfo['observaciones_sitio']} 
                                  onChange={(e)=> setDetalleSitioInfo({...detalleSitioInfo, ['observaciones_sitio']:e.target.value, ['observaciones_sitioChange']:true  })}
                                />
                              </Grid>
                              </Grid>}
                            </Grid>
                            </Grid>
                            </form>
                          </Container>
    </React.Fragment>
  </div>
    )

}
export default DetalleOTScreen;


