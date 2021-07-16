import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { actualizarOT, buscarDetallesSitio } from "../actions/userActions";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import CssBaseline from '@material-ui/core/CssBaseline';

import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles, useTheme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';

import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import { Tooltip } from '@material-ui/core';


const verdefondo = green[900]
const azulfondo = blue[900]
const rojoFondo = red[900]
const greyfondo = grey[300]

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
    color: azulfondo,
    borderRadius:10,
    backgroundColor: greyfondo,
    border:'30px',
    textTransform: 'capitalize',
    textAlign:'center'
  },
  subtitle: {
    fontSize: 15,
    color: azulfondo,
    textAlign:'left'
  },
  proceso: {
    width:"100%",
    borderRadius:10,
    backgroundColor: 'white',
    border: 'black',

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
  warning: {
    width:"100%",
    textAlign:"center",
    border: "black",
    borderRadius:6,
    fontSize: 15,
    color:"white",
    backgroundColor:rojoFondo
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontSize: 20,
    color:azulfondo
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
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
  {_id:"p2",titulo:'Revision con Cliente y Programación', codigo:'rev', paso:1},
  {_id:"p3",titulo:'En Ejecución', codigo:'ejec', paso:2},
  {_id:"p4",titulo:'Revisión de Calidad', codigo:'qa', paso:3},
  {_id:"p5",titulo:'Finalizado Entregado', codigo:'entregado', paso:4},
  {_id:"p6",titulo:'Aprobado por Cliente', codigo:'aprobado', paso:5},
  {_id:"p7",titulo:'Facturación', codigo:'facturacion', paso:6},
  {_id:"p8",titulo:'pagado', codigo:'pagado', paso:7},
]}

const responsablesOT = [
  {_id:"r0", responsable_ot:'', email_responsable_ot:''},
  {_id:"r1", responsable_ot:'Bayardo', email_responsable_ot:'bayardo@gmail.com'},
  {_id:"r2", responsable_ot:'Royer', email_responsable_ot:'royer@gmail.com'},
  

];
const prioridades = [
  "",
  'Normal',
  'Alta',
  'Inmediata',
]

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




function DetalleOTScreen(props) {
  
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const userDetallesSitio = useSelector((state) => state.userDetallesSitio);
  const { loadingSitio, detallesSitio } = userDetallesSitio;
  // const [detallesSitioInfo, setDetallesSitioInfo] = React.useState(
  const [detallesSitioInfo, setDetallesSitioInfo] = React.useState([{
    cliente: detallesSitio? detallesSitio.data[0].cliente : "",
    detalle_requerimiento: detallesSitio? detallesSitio.data[0].detalle_requerimiento: "",
    detallesSitio: detallesSitio? detallesSitio.data[0].detallesSitio: "",
    email_responsable_cliente: detallesSitio? detallesSitio.data[0].email_responsable_cliente: "",
    estado: detallesSitio? detallesSitio.data[0].estado: "",
    fecha_requerida: detallesSitio? detallesSitio.data[0].fecha_requerida: new Date(),
    fecha_sla: detallesSitio? detallesSitio.data[0].fecha_sla: new Date(),
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
  }]);

  const dispatch = useDispatch();
  const history = useHistory();
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

  const split = props.location.search.split("&");
  console.log("split", split) 
  
  const sitioBuscar ={
    codigo: props.location.search ? split[0].substring(+ 8) : 1,
    ot_number: props.location.search ? split[1].substring(+ 10) : 1
  }



console.log( responsablesOT.map((option) => {
  return(<MenuItem key={option._id} selected={option === ''}  >
    {option}
  </MenuItem>)
}));

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setDetallesSitioInfo( {
      ...detallesSitioInfo,
      ['estado']: getStepContent(activeStep+1).codigo,
      ['estadoChange']: true,
  })
  console.log('detallesSitioInfo', detallesSitioInfo['estado'],'getStep', getStepContent(activeStep+1).codigo)
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setDetallesSitioInfo({
      ...detallesSitioInfo,
      ['estado']: getStepContent(activeStep-1).codigo,
      ['estadoChange']: true,
  })
};

  const handleReset = () => {
    setActiveStep(0);
  };

  const defaultProps = {
    options: responsablesOT,
    getOptionLabel: (option) =>  option.responsable_ot,
  };

  const handleDateChangefecha_requerida = (date) => {
    setDetallesSitioInfo({...detallesSitioInfo, ['fecha_requerida']: new Date(date), ['fecha_requeridaChange']:true})
  };

  const handleDateChangefecha_sla = (date) => {
    setDetallesSitioInfo({...detallesSitioInfo, ['fecha_sla']: new Date(date), ['fecha_slaChange']:true})
  };

  
    // const [detallesSitioInfo, setDetallesSitioInfo] = React.useState([]);
    const [activeStep, setActiveStep] = React.useState(0);

   


    // const pasoInicial = getSteps().filter(paso => detallesSitioInfo && paso.codigo===detallesSitioInfo.estado)[0].paso
    //  console.log(pasoInicial)
   
 

  const handleChange = (event) => {
    const name = event.target.name;
    setDetallesSitioInfo({
      ...detallesSitioInfo,
      [name]: event.target.value,
    });
  };

 
  

  useEffect(() => {
      
    if (!userInfo ) {
      props.history.push('/login');

    }
      let caso =0;
      if(!detallesSitio){
        caso=1; //no existe
      }else if(detallesSitio.data.sitio_codigo === sitioBuscar.codigo){
      caso = 1 // diferente
      }else {
        caso =0 // no hay cambio
      }
      console.log("caso", caso) 
      switch (caso){
        case 0:
        setDetallesSitioInfo({
          cliente: detallesSitio.data[0].cliente,
          detalle_requerimiento: detallesSitio.data[0].detalle_requerimiento,
          detallesSitio: detallesSitio.data[0].detallesSitio,
          email_responsable_cliente: detallesSitio.data[0].email_responsable_cliente,
          estado: detallesSitio.data[0].estado,
          fecha_requerida: detallesSitio.data[0].fecha_requerida,
          ot_number: detallesSitio.data[0].ot_number,
          pais: detallesSitio.data[0].pais,
          prioridad: detallesSitio.data[0].prioridad ? detallesSitio.data[0].prioridad : "",
          proyecto: detallesSitio.data[0].proyecto,
          requerimiento: detallesSitio.data[0].requerimiento,
          responsable_cliente: detallesSitio.data[0].responsable_cliente,
          sitio_codigo: detallesSitio.data[0].sitio_codigo,
          sitio_nombre: detallesSitio.data[0].sitio_nombre,
          responsable_ot: detallesSitio.data[0].responsable_ot? detallesSitio.data[0].responsable_ot :"" ,
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
        break;
        case 1:
        dispatch(buscarDetallesSitio(sitioBuscar))
        break;

        default:
          // nadaa
      }
     
  
  
    return () => {
    
    };
  }, [loadingSitio,detallesSitio ]);
  

 

  const handleProceso = (e) =>{
    e.preventDefault();
    console.log("a grabar!", detallesSitioInfo)
    dispatch(actualizarOT(detallesSitioInfo))
    props.history.push('/');
  }

  function checkFulliness(info){
    console.log('info',info)
    
    // info.data[0].detallesSitio[0].forEach(element => {
    //   console.log('elemento',element)
    // });
    return true
  }

  return (<div>
     <React.Fragment>
      <CssBaseline />
      <Container width="70%">
      <form autoComplete='true' onSubmit={handleProceso}>
    <Grid container margintop='true' className={classes.root} spacing={2}>
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
        { detallesSitio  && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio && checkFulliness(detallesSitio) && <Typography  className={classes.warning} >
            Informacion Incompleta
          </Typography>}
        
                { detallesSitio && 
                <Grid item xs={12} sm={12} container>
                <Tooltip title="Guardar" aria-label="add" placement="left-start">
                <Fab color="primary" aria-label="add" className={classes.fab} type="submit">
                  <SaveIcon />
                </Fab>
                </Tooltip>
                <Grid item xs={12} sm={4}> 
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="responsable_cliente">Responsable Cliente</InputLabel>
                      <OutlinedInput id="responsable_cliente" value={detallesSitioInfo['responsable_cliente']? detallesSitioInfo['responsable_cliente']:""} 
                      disabled={true} 
                      onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['responsable_cliente']: value.target.value })}
                      label="Responsable Cliente" 
                      fullWidth={true} />
                      </FormControl>
                    </Grid>
                    {console.log("detallesSitioInfo",detallesSitioInfo)}
                    <Grid item xs={12} sm={4}> 
                    { prioridades && detallesSitioInfo && <Autocomplete
                        id="prioridad"
                        required={true}
                        onChange={(e, value)=> setDetallesSitioInfo({...detallesSitioInfo, ['prioridad']:value , ['prioridadChange']:true })}
                        options={prioridades}
                        getOptionLabel={(option) => option}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Prioridad" variant="outlined" />}
                        value={detallesSitioInfo['prioridad']} 
                      />}
                   

                    </Grid>
                    <Grid item xs={12} sm={4}> 
                    { responsablesOT && detallesSitioInfo&& <Autocomplete
                        options={responsablesOT}
                        getOptionLabel={(option) => option.responsable_ot}
                        id="responsable_ot"
                        required={true}
                        onChange={(e, value)=> setDetallesSitioInfo({...detallesSitioInfo, ['responsable_ot']:value.responsable_ot, ['email_responsable_ot']:value.email_responsable_ot,  
                         ['responsable_otChange']:true , ['email_responsable_otChange']:true })}

                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Responsable OT" variant="outlined" />}
                        value={detallesSitioInfo['responsable_ot']? "": detallesSitioInfo['responsable_ot']} 
                      />}
                    
                    </Grid>
                    <Grid item md={3}  xs={5}  sm={5}> 
                      
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                     
                      {detallesSitioInfo && detallesSitioInfo['fecha_sla'] && <KeyboardDatePicker
                        
                          margin="normal"
                          disabled={false}
                          id="fecha_sla"
                          label="Fecha SLA"
                          format="MM/dd/yyyy"
                          value={detallesSitioInfo['fecha_sla']? detallesSitioInfo['fecha_sla']:null}
                          onChange={handleDateChangefecha_sla}
                          KeyboardButtonProps={{
                            'aria-label': 'change date', 
                          }}
                        />}
                        </MuiPickersUtilsProvider>
                    </Grid>
                      <Grid item md={4}  xs={6}  sm={6}> 
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                     {detallesSitioInfo && detallesSitioInfo['fecha_requerida'] && <KeyboardDatePicker
                        margin="normal"
                        id="fecha_requerida"
                        label="Fecha Requerida"
                        format="MM/dd/yyyy"                       
                        value={detallesSitioInfo['fecha_requerida']? detallesSitioInfo['fecha_requerida']:null}
                        onChange={handleDateChangefecha_requerida}
                        disabled={userInfo.isSuper? true : false}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />}
                      </MuiPickersUtilsProvider>
                      </Grid>
                        <Paper elevation={4} className={classes.proceso}>
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
                          <Step key={label._id}>
                            <StepLabel>{label.titulo}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
          
                    </div>
                    </Paper>
                    <Grid item xs={4} sm={4} className={classes.root}> 
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel htmlFor="Requerimiento">Requerimiento</InputLabel>
                      <OutlinedInput id="Requerimiento" value={detallesSitioInfo['requerimiento']?detallesSitioInfo['requerimiento']:""} 
                      onChange={(e)=> setDetallesSitioInfo({...detallesSitioInfo, ['requerimiento']: e, ['requerimientoChange']:true})}
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
                                  value={detallesSitioInfo['detalle_requerimiento']? detallesSitioInfo['detalle_requerimiento']:""} 
                                  onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['detalle_requerimiento']:value, ['detalle_requerimientoChange']:true })}
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
                                  value={detallesSitioInfo['comentarios_responsable_ot']? detallesSitioInfo['comentarios_responsable_ot']:""} 
                                  onChange={(e)=> setDetallesSitioInfo({...detallesSitioInfo, ['comentarios_responsable_ot']:e.target.value, ['comentarios_responsable_otChange']:true })}
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
                                        <OutlinedInput id="tipo_estructura" value={detallesSitioInfo['tipo_estructura']} 
                                        // disabled={userInfo.isSuper? true : false}
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['tipo_estructura']:value.target.value, ['tipo_estructuraChange']:true })}
                                        label="Tipo de Estructura" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="area">Área Rentada</InputLabel>
                                        <OutlinedInput id="area" value={detallesSitioInfo['area_arrendada']}
                                         onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['area_arrendada']:value.target.value, ['area_arrendadaChange']:true })}
                                         label="Área Rentada" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="area_a_utilizar">Area a Utilizar</InputLabel>
                                        <OutlinedInput id="area_a_utilizar" value={detallesSitioInfo['area_a_utilizar']}
                                         onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['area_a_utilizar']:value.target.value, ['area_a_utilizarChange']:true })}
                                         label="Área a Utilizar" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="tipologia_sitio">Tipologia Sitio</InputLabel>
                                        <OutlinedInput id="tipologia_sitio" value={detallesSitioInfo['tipologia_sitio']} 
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['tipologia_sitio']:value.target.value, ['tipologia_sitioChange']:true })}
                                        label="Tipología Sitio" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="arrendatario">Arrendatario/Propietario</InputLabel>
                                        <OutlinedInput id="arrendatario" value={detallesSitioInfo['arrendatario']} 
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['arrendatario']:value.target.value, ['arrendatarioChange']:true })}
                                        label="Arrendatario/Propietario" />
                                      </FormControl>
                              </Grid>
                             
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="identificacion_arrendatario">Identificacion Arrendatario</InputLabel>
                                        <OutlinedInput id="identificacion_arrendatario" value={detallesSitioInfo['identificacion_arrendatario']} 
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['identificacion_arrendatario']:value.target.value, ['identificacion_arrendatarioChange']:true })}
                                        label="Identificacion Arrendatario" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="numero_finca">Número de Finca</InputLabel>
                                        <OutlinedInput id="numero_finca" value={detallesSitioInfo['numero_finca']}
                                         onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['numero_finca']:value.target.value, ['numero_fincaChange']:true })} 
                                         label="Número de Finca" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                              <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="direccion_sitio">Direccion de la Finca</InputLabel>
                                        <OutlinedInput id="direccion_sitio" value={detallesSitioInfo['direccion_sitio']} 
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['direccion_sitio']:value.target.value, ['direccion_sitioChange']:true })} 
                                        label="Direccion de la Finca" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="provincia">Provincia</InputLabel>
                                        <OutlinedInput id="provincia" value={detallesSitioInfo['provincia']} 
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['provincia']:value.target.value, ['provinciaChange']:true })}  
                                        label="Provincia" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="departamento">Departamento</InputLabel>
                                        <OutlinedInput id="departamento" value={detallesSitioInfo['departamento']}
                                         onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['departamento']:value.target.value, ['departamentoChange']:true })}  
                                         label="Departamento" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="latitud_validada_grados">Latitud Validada en Grados</InputLabel>
                                        <OutlinedInput id="latitud_validada_grados" value={detallesSitioInfo['latitud_validada_grados']} 
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['latitud_validada_grados']:value.target.value, ['latitud_validada_gradosChange']:true })}  
                                        label="Latitud Validada en Grados" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="longitud_validada_grados">Longitud Validada en Grados</InputLabel>
                                        <OutlinedInput id="longitud_validada_grados" value={detallesSitioInfo['longitud_validada_grados']} 
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['longitud_validada_grados']:value.target.value, ['longitud_validada_gradosChange']:true })} 
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
                                  // disabled={userInfo.isSuper? true : false}
                                  value={detallesSitioInfo['derecho_paso_sitio']} 
                                  onChange={(e)=> setDetallesSitioInfo({...detallesSitioInfo, ['derecho_paso_sitio']:e.target.value , ['derecho_paso_sitioChange']:true })}
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
                                  // disabled={userInfo.isSuper? true : false}
                                  value={detallesSitioInfo['electricidad_sitio']} 
                                  onChange={(e)=> setDetallesSitioInfo({...detallesSitioInfo, ['electricidad_sitio']:e.target.value, ['electricidad_sitioChange']:true })}
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
                                  // disabled={userInfo.isSuper? true : false}
                                  value={detallesSitioInfo['observaciones_sitio']} 
                                  onChange={(e)=> setDetallesSitioInfo({...detallesSitioInfo, ['observaciones_sitio']:e.target.value, ['observaciones_sitioChange']:true  })}
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


