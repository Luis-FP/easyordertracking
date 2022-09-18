import React, { useEffect, useState } from 'react';
// import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import fileDownload from 'js-file-download';
import { actualizarOT, buscarDetallesSitio, archivosSitio , ingenieriaSitio} from "../actions/userActions";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
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
// import { withStyles, useTheme } from '@material-ui/core/styles';
// import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import MenuItem from '@material-ui/core/MenuItem';

import Select from '@material-ui/core/Select';

import { Tooltip } from '@material-ui/core';

import { purple, red , blue , grey, green , orange} from '@material-ui/core/colors';
import { fechaUnica, queFecha } from '../components/fechas';


const purple3 = purple[300]
// const naranja7 = orange[700]
const verdefondo = green[500]
const azulfondo = blue[900]
const azulClaro = blue[300]
const rojoFondo = red[700]
const greyfondo = grey[300]
const naranja4 = orange[400]

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
    // minWidth: 220,
    // fullWidth: 'true',
  },
  formControl2: {
    margin: theme.spacing(1),
    justifyContent: "space-between",

  },
  formControl3: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  table: {
    fullWidth: true,
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
  warning2: {
    width:"100%",
    textAlign:"center",
    border: "black",
    borderRadius:6,
    fontSize: 15,
    color:"white",
    backgroundColor:naranja4
  },
  warning3: {
    width:"100%",
    textAlign:"center",
    border: "black",
    borderRadius:6,
    fontSize: 15,
    color:"white",
    backgroundColor:verdefondo
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontSize: 20,
    border: 'solid',
    borderColor: azulClaro,
    color:azulfondo
  },
  fab: {
    position: 'absolute',
    bottom: '1%',
    right: '2%',
  },
  zona2: {
    width: '100%',
    marginTop: 20,
  },
  input: {
    display: 'none',
  },
  grupoInge:{

    // display: 'flex',
    justifyContent: 'space-evenly',
    margin: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    // width: 50%;
    border: '1px solid green',
    // padding: '20px',
  },
  botonInge:{

    marginTop: 'auto',
    marginBottom: 'auto',
    // paddingTop: '10px',
  }
}));



function getSteps() {
  return [
  {_id:"p1", titulo:'Solicitudes Nuevas', codigo:'ini', paso:0},
  {_id:"p2",titulo:'Revision con Cliente y Programación', codigo:'rev', paso:1},
  {_id:"p3",titulo:'En Ejecución', codigo:'ejec', paso:2},
  {_id:"p4",titulo:'Revisión de Calidad', codigo:'qa', paso:3},
  {_id:"p5",titulo:'Finalizado Entregado', codigo:'entregado', paso:4},
  {_id:"p6",titulo:'Aprobado por Cliente', codigo:'aprobado', paso:5},
  {_id:"p7",titulo:'Cerrado', codigo:'cerrado', paso:6},
  // {_id:"p8",titulo:'pagado', codigo:'pagado', paso:7},
]}

const responsablesOT = [
  {_id:"r0", responsable_ot: '', email_responsable_ot: ''},
  {_id:"r1", responsable_ot: 'Bayardo Domingo', email_responsable_ot: 'bayardodomingo@hotmail.com'},
  {_id:"r2", responsable_ot: 'Roger Ruiz', email_responsable_ot: 'estructuras@atmotechnologies.com'},
  {_id:"r3", responsable_ot: 'Roberto Domingo', email_responsable_ot: 'coordinge@atmotechnologies.com'},
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

const botonVisible = {
  isHiper:[1,2,3,4,5,6,7,8],
  isSuper:[1,2,3,4,5,6,7,8],
  isInge: [1,2,3,4,5,6,7,8],
  isUser: [],
}

const entradasActivas = {
  isHiper:[1,2,3,4,5,6,7,8],
  isSuper:[1,2,3,4,5,6,7,8],
  isInge: [1,2,3,4,5,6,7,8],
  isUser: [],
}


function DetalleOTScreen(props) {

  // const defaultProps = {
  //   options: detallesSitio.responsablesOT,
  //   getOptionLabel: (option) => option.responsable_ot,
  // };

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const archivosDisponiblesSitio = useSelector((state) => state.archivosDisponiblesSitio)
  const { archivosDelSitio, loadingArchivo } = archivosDisponiblesSitio;

  const userDetallesSitio = useSelector((state) => state.userDetallesSitio);
  const { loadingSitio, detallesSitio } = userDetallesSitio;

  const ingeSitio = useSelector((state) => state.ingeSitio);
  const { loadingInge, ingesDelSitio } = ingeSitio;
  

  
  const [downloading, setDownloading] = React.useState(false);
  const [uploadingInge, setUploadingInge] = React.useState(false);
  const [fileInge, setFileInge] = React.useState("");
  const [indiceInge, setIndiceInge] = React.useState(0);
  const [referenciaAWS, setReferenciaAWS] = React.useState([]);
  const [listaInge, setListaInge] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
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
    responsable_ot: detallesSitio? detallesSitio.data[0].responsable_ot: null,
    comentarios_responsable_ot: detallesSitio? detallesSitio.data[0].comentarios_responsable_ot: "",
  }]);

  const dispatch = useDispatch();

  const classes = useStyles();

  const split = props.location.search.split("&");
  const [sitioBuscar, setSitioBuscar] = React.useState({
    codigo: props.location.search ? split[0].substring(+ 8) : 1,
    ot_number: props.location.search ? split[1].substring(+ 10) : 1
  });
  const [updatedCodigo, setUpdatedCodigo] = React.useState(false);
  const [ingeSubida, setIngeSubida] = React.useState(false);
  const steps = getSteps();
 
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setDetallesSitioInfo( {
      ...detallesSitioInfo,
      ['estado']: getStepContent(activeStep+1).codigo,
      ['estadoChange']: true,
  })
  // console.log('detallesSitioInfo', detallesSitioInfo['estado'],'getStep', getStepContent(activeStep+1).codigo)
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



  const handleDateChangefecha_requerida = (date) => {
    setDetallesSitioInfo({...detallesSitioInfo, ['fecha_requerida']: new Date(date), ['fecha_requeridaChange']:true})
  };

  const handleDateChangefecha_sla = (date) => {
    setDetallesSitioInfo({...detallesSitioInfo, ['fecha_sla']: new Date(date), ['fecha_slaChange']:true})
  };

  
    // const [detallesSitioInfo, setDetallesSitioInfo] = React.useState([]);
    const [activeStep, setActiveStep] = React.useState(0);



  const handleChange = (event) => {
    // console.log('filtro resp', responsablesOT.filter(resp => resp.responsable_ot === event.target.value && resp.email_responsable_ot))
    setDetallesSitioInfo({
      ...detallesSitioInfo,
      ['responsable_ot']: event.target.value, 
      ['email_responsable_ot']: detallesSitio.responsables_ot.filter(resp => resp.responsable_ot === event.target.value )[0].email_responsable_ot,  
      ['responsable_otChange']:true , 
      ['email_responsable_otChange']:true 
    });
  };
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
      
    if (!userInfo ) {
      props.history.push('/login');

    }
    if( detallesSitio){
     setDetallesSitioInfo({
          _id: detallesSitio.data[0]['_id'],
          cliente: detallesSitio.data[0].cliente,
          detalle_requerimiento: detallesSitio.data[0].detalle_requerimiento,
          detallesSitio: detallesSitio.data[0].detallesSitio,
          email_responsable_cliente: detallesSitio.data[0].email_responsable_cliente,
          estado: detallesSitio.data[0].estado,
          fecha_requerida: detallesSitio.data[0].fecha_requerida,
          ot_number: detallesSitio.data[0].ot_number,
          // pais: detallesSitio.data[0].pais,
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
          municipio: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].municipio: "",
          // proyecto: detallesSitio && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio[0] ? detallesSitio.data[0].detallesSitio[0].proyecto: "",
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
          estadoChange:  false,
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
          municipioChange: false,
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
 
      if( !detallesSitio || !updatedCodigo ){
        dispatch(buscarDetallesSitio(sitioBuscar))
        // dispatch(archivosSitio({sitio_codigo:sitioBuscar.codigo, proyecto: userInfo.vista}))
        setUpdatedCodigo(true)
      }
      if(detallesSitio && detallesSitio.data && !loadingArchivo && !loadingInge){
        dispatch(archivosSitio({sitio_codigo:sitioBuscar.codigo, proyecto: detallesSitio.data[0].proyecto}))
      }
     
  
    return () => {
    
    };
  }, [loadingSitio, detallesSitio, updatedCodigo, uploadingInge, ingesDelSitio ]);
  

  const handleProceso = (e) =>{
    e.preventDefault();
    console.log("a grabar!", detallesSitioInfo)
    dispatch(actualizarOT(detallesSitioInfo)).then(response =>{
      
        props.history.push('/');
      
    })
    
  }

  function checkFulliness(info){
    console.log('info',info, Object.values(info.data[0].detallesSitio[0]))
    let count = 0
    let porcentaje = 0
    let color ="";
    Object.values(info.data[0].detallesSitio[0]).forEach((element, index) => {
      // console.log('elemento checkfullines',element)
      if( !element || element==="" ) count++;
      porcentaje = ((index-count)/index) * 100
    });
    // if(porcentaje<50 ){
    //   color = 'warning'
    // }else if(porcentaje>51 && porcentaje<80){
    //   color = 'warning2'
    // }else {
    //   color = 'warning3'
    // }
    
    return porcentaje.toFixed(0)
  }

  function controlAccesoProceso(userInfo, index){
    if(userInfo.isInge || userInfo.isHiper || userInfo.isSuper ){
      return true
    }else if(userInfo.isUser && index<6 ){
      return true
    }else if(userInfo.isUser && index>= 6){
     return false
  }
}

function controlBotonProceso(userInfo, activeStep){
  if (!userInfo.isHiper && !userInfo.isSuper  && !userInfo.isInge && activeStep===5){
    return true
  }else {
   return false
  }
}

function EntradasUsuario(userInfo, activeStep){
  if (
    (userInfo &&  userInfo.isUser && entradasActivas.isUser.includes(activeStep)) 
    ){
    return false
  }else {
   return true
  }
}

function EntradasAgente(userInfo, activeStep){
  if (
    (userInfo && userInfo.isHiper && entradasActivas.isHiper.includes(activeStep)) ||
    (userInfo && userInfo.isSuper  && entradasActivas.isSuper.includes(activeStep)) ||
    (userInfo && userInfo.isInge && entradasActivas.isInge.includes(activeStep))

    ){
    return false
  }else {
   return true
  }
}
  function colorAlerta(nivel) {
    let color = null;
    if(nivel==='Alta'){
      color = rojoFondo;
    }else if(nivel==='Inmediata'){
      color = purple3;
    }else if(nivel==='Normal'){
      color = verdefondo;
    }
    return color;
  }

// bajar archivo de AWS S3 protegido
  const downloadFileHandler = (e) => {

    const key = {key: e}
    setDownloading(true);
    axios.post("/api/uploads/s3download", key, {

    })
      .then((response) => {
        if (!response.error && response.data && response.data.data) {
          fileDownload(Buffer.from(response.data.data.Body.data), response.data.nombre.key);
          setDownloading(false);
          return response.data.data.Body.data;
        }
        else {
          setDownloading(false);
          setReferenciaAWS("Error", response.error)
          return response.error;
        }

      })
      .catch((err) => {
        console.log(err);
        setReferenciaAWS("Error: "+ err)

      });
  };

 // subida de archivos a Amazon
 const uploadFileIngeHandler = (e) => {
  
  setFileInge(e.target.value)
  const file = e.target.files[0];
console.log("e.target.value", e.target.value, "fileInge", fileInge)
  const bodyFormData = new FormData();
  bodyFormData.append("image", file);
  setUploadingInge(true);
  axios.post("/api/uploads/s3", bodyFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => {
      console.log('response.data',response.data)
      // let x = [];
      // x.push(response.data)
      // const y = listaInge.length + 1
      setListaInge({...listaInge, [indiceInge]: {'file': file.name, 'path': response.data, fileMeta:file} })
      setIndiceInge(indiceInge+1);
      // setReferenciaAWS({...referenciaAWS , x})
      const value = {
        ot_number:detallesSitioInfo.ot_number,
        proyecto:detallesSitioInfo.proyecto,  
        ingenieria: {key:file.name, tipo:detallesSitioInfo.requerimiento, fecha:new Date()}
      }

      dispatch(ingenieriaSitio(value));
      setReferenciaAWS(fileInge+ "Subido Exitosamente");
      // setFileCliente("Subido Exitosamente");
      setUploadingInge(false);
    })
    .catch((err) => {
      console.log(err);
      setReferenciaAWS("Error: ", err)
      setUploadingInge(false);
    });
};

function ordenarIngenierias(arreglo) {
  arreglo.sort(function(b, a){return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()});
  return arreglo
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
        { detallesSitio  && detallesSitio.data[0] && detallesSitio.data[0].detallesSitio  && 
        <Typography  style={{}}  className={
          checkFulliness(detallesSitio)<50?  classes.warning :
          checkFulliness(detallesSitio)>51 && checkFulliness(detallesSitio)<80? classes.warning2 :
          classes.warning3
          } >
            Informacion {checkFulliness(detallesSitio)}% completa
          </Typography>}
        
                { detallesSitio && 
                <Grid item xs={12} sm={12} container >
              
                <Grid item xs={12} sm={4}> 
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="responsable_cliente">Responsable Cliente</InputLabel>
                      <OutlinedInput id="responsable_cliente" value={detallesSitioInfo['responsable_cliente']? detallesSitioInfo['responsable_cliente']:""} 
                      disabled={true} 
                      onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['responsable_cliente']: value.target.value })}
                      label="Responsable Cliente" 
                      style={{color:"black" }}
                      fullWidth={true} />
                      </FormControl>
                    </Grid>
                    {/* {console.log("detallesSitioInfo",detallesSitioInfo)} */}
                    <Grid item xs={12} sm={4}> 
                    { prioridades && detallesSitioInfo && detallesSitioInfo['prioridad'] && <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="prioridad">Prioridad</InputLabel>
                      <OutlinedInput 
                      id="prioridad" 
                      value={detallesSitioInfo['prioridad']} 
                 
                      disabled={true} 
                      style={{borderStyle: "solid", borderColor: colorAlerta(detallesSitioInfo['prioridad']), color: colorAlerta(detallesSitioInfo['prioridad']) }}
                      label="Prioridad" 
                      fullWidth={true} />
                      </FormControl>}
                    </Grid>
                    <Grid item xs={12} sm={4}>

        <FormControl className={classes.formControl3}>
          <InputLabel id="demo-controlled-open-select-label">Responsable OT</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            disabled={userInfo && (userInfo.isHiper || userInfo.isSuper)? false : true}
            value={detallesSitioInfo.responsable_ot? detallesSitioInfo.responsable_ot : ""}  //detallesSitioInfo['responsable_ot']
            onChange={handleChange}
            variant="outlined"
          >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {detallesSitio&& detallesSitio.responsables_ot.map(opcion=> <MenuItem key={opcion._id} value={opcion.responsable_ot}>{opcion.responsable_ot}</MenuItem>)}
        </Select>
      </FormControl>
                    
                    </Grid>
                    <Grid item md={3}  xs={5}  sm={5}> 
                      
                    {detallesSitioInfo && detallesSitioInfo['fecha_sla'] && <MuiPickersUtilsProvider utils={DateFnsUtils}>
                     
                       <KeyboardDatePicker
                        
                          margin="normal"
                          disabled={false}
                          id="fecha_sla"
                          label="Fecha SLA"
                          format="MM/dd/yyyy"
                          value={detallesSitioInfo['fecha_sla']}
                          onChange={handleDateChangefecha_sla}
                          KeyboardButtonProps={{
                            'aria-label': 'change date', 
                          }}
                        />
                        </MuiPickersUtilsProvider>}
                    </Grid>
                      <Grid item md={4}  xs={6}  sm={6}> 
                      {detallesSitioInfo && detallesSitioInfo['fecha_requerida'] && userInfo &&<MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="fecha_requerida"
                        label="Fecha Requerida"
                        format="MM/dd/yyyy"                       
                        value={detallesSitioInfo['fecha_requerida']}
                        onChange={handleDateChangefecha_requerida}
                        disabled={userInfo && userInfo.isSuper? true : false}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                      </MuiPickersUtilsProvider>}
                      </Grid>
                        <Paper elevation={4} className={classes.proceso}>
                      {activeStep === steps.length ? (
                          <div>
                            <Typography className={classes.instructions}>Proceso Terminado</Typography>
                            <Button onClick={handleReset}>Reset</Button>
                          </div>
                        ) : (
                          <div style={{width:'100%', alignItems:'center'}}>
                          {/* {console.log("userInfo", userInfo.isUser)} */}
                          <Grid item md={12} xs={12} sm={12} container>
                          <Grid item md={12} xs={3} sm={3}> 
                             {userInfo && <Button
                                disabled={activeStep === 0 && (!userInfo.isHiper && !userInfo.isSuper  && !userInfo.isInge ) }
                                onClick={handleBack}
                                className={classes.backButton}
                              >
                                Atras
                              </Button>}
                             
                            </Grid>
                            <Grid item md={12} xs={6} sm={6} > 
                            <div>Proceso Actual:</div>
                            <Button className={classes.instructions}> {getStepContent(activeStep).titulo}</Button>
                            </Grid>
                            <Grid item xs={3} sm={3}> 
                            {userInfo && <Button variant="contained" color="primary" className={classes.nextButton} 
                            disabled={ controlBotonProceso(userInfo, activeStep) }
                            onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Próximo'}
                              </Button>}
                              </Grid>
                            </Grid>
                          </div>
                        )}
                       
                <div className={classes.root}>
                {userInfo && <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) =>  controlAccesoProceso(userInfo, index)  &&
                         (
                          <Step key={label._id}>
                            <StepLabel>{label.titulo}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>}
          
                    </div>
                    </Paper>
                    <Grid container className={classes.zona2}> 
                    <Grid item md={12} xs={12} sm={12}  style={{margin:1}} > 
                    <TextField
                      id="Requerimiento" 
                      variant="outlined"
                      fullWidth
                      // rows={1}
                      value={detallesSitioInfo['requerimiento']?detallesSitioInfo['requerimiento']:""} 
                      onChange={(e)=> setDetallesSitioInfo({...detallesSitioInfo, ['requerimiento']: e, ['requerimientoChange']:true})}
                      disabled={userInfo && userInfo.isUser? false : true }
                      label="Requerimiento" />

                    </Grid>
                    <Grid item md={12} xs={12} sm={12} className={classes.formControl}> 
                    <TextField
                                  id="Detalle"
                                  label="Detalle del Requerimiento"                               
                                  multiline
                                  minRows={4}
                                  variant="outlined"
                                  fullWidth
                                  disabled={userInfo && userInfo.isUser? false : true }
                                  value={detallesSitioInfo['detalle_requerimiento']? detallesSitioInfo['detalle_requerimiento']:""} 
                                  onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['detalle_requerimiento']:value, ['detalle_requerimientoChange']:true })}
                                />
                    </Grid>
                    <Grid item md={12} xs={12} sm={12} className={classes.formControl}> 
                    <TextField
                                  id="comentarios_responsable_ot"
                                  label="Comentarios de Ingeniería"
                                  disabled={userInfo && (userInfo.isSuper || userInfo.isInge || userInfo.isHiper)? false : true}
                                  multiline
                                  minRows={4}
                                  placeholder="Comente cualquier observación sobre esta Orden de Trabajo..."
                                  variant="outlined"
                                  fullWidth
                                  value={detallesSitioInfo['comentarios_responsable_ot']? detallesSitioInfo['comentarios_responsable_ot']:""} 
                                  onChange={(e)=> setDetallesSitioInfo({...detallesSitioInfo, ['comentarios_responsable_ot']:e.target.value, ['comentarios_responsable_otChange']:true })}
                                />
                    </Grid>

                    <div className={classes.grupoInge} >
                    {/* <Button> */}
                    <Button align="center" className={classes.title} >Ingeniería Terminada</Button> 
                      
                        <input
                          accept="*"
                          className={classes.input}
                          id="boton-ingenieria-lista"
                          multiple
                          type="file"
                          disabled={!EntradasAgente(userInfo, activeStep)}
                          value={fileInge}
                          // onChange={(e) => setFileInge(e.target.value)}
                          onChange={uploadFileIngeHandler}
                        />


                        {/* // disabled={EntradasAgente(userInfo, activeStep)} */}

                         <label htmlFor="boton-ingenieria-lista" className={classes.botonInge}>     
                          {uploadingInge? <CircularProgress /> :
                            <Button variant="contained" color="primary" 
                            disabled={!EntradasAgente(userInfo, activeStep)}
                            
                            component="span">Subir Ingeniería </Button> }         
                        </label>
                        {/* </Button> */}
                        {/* <TableContainer component={Paper} >
                        <Table className={classes.table} aria-label="simple table" >
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Nombre Archivo</TableCell>
                              <TableCell align="center">Tipo Ingeniería</TableCell>
                              <TableCell align="center">Fecha Creación</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                        
                          { detallesSitio.data[0].ingenieria && detallesSitio.data[0].ingenieria.length>0 && Object.values(detallesSitio.data[0].ingenieria[0]).length>0 && Object.values(detallesSitio.data[0].ingenieria).map((item, index) => (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row"  >
                               <Button   
                               style={{color:verdefondo}}
                               onClick={()=>downloadFileHandler(item.key)}>{item.key}
                               </Button>
                           
                                </TableCell>
                                <TableCell component="th" scope="row"  >
                               <Button   >{item.tipo}</Button>
                           
                                </TableCell>
                                <TableCell component="th" scope="row"  >
                               <Button  >{queFecha(item.fecha) }</Button>
                           
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer> */}
                        </div>
   
                    <div className={classes.root}>
                    <Typography  align="center" className={classes.instructions} >
                      Documentos Relacionados a la OT
                      </Typography>
          { detallesSitio && detallesSitio.data[0].archivos && <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nombre Archivo</TableCell>
                              <TableCell>{referenciaAWS}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                        
                          { detallesSitio.data[0].archivos && detallesSitio.data[0].archivos.length>0 && Object.values(detallesSitio.data[0].archivos[0]).length>0 && Object.values(detallesSitio.data[0].archivos[0]).map((item, index) => (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row"  >
                               <Button   onClick={()=>downloadFileHandler(item.file)}>{item.file}</Button>
                           
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>}
                      </div>
                      <div className={classes.root}>
                          <Typography align="center" className={classes.instructions}>Documentos ya disponibles del Sitio</Typography> 
                              
                        
                          { archivosDelSitio && archivosDelSitio.data && archivosDelSitio.data.length>0 && <TableContainer component={Paper}>
                              <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">Nombre Archivo</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                { Object.keys(archivosDelSitio.data).length>0 && Object.values(archivosDelSitio.data).map((item, index) => (
                                  <TableRow key={index}>
                                      <TableCell component="th" scope="row"> 
                                      <Button   onClick={()=>downloadFileHandler(item.file)}>{item.file}</Button>
                                       
                          
                                      </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableContainer>}
                            <Typography align="center" className={classes.title}>Ingenierías</Typography> 
                            { archivosDelSitio && archivosDelSitio.inge && archivosDelSitio.inge.length>0 && <TableContainer component={Paper} >
                        <Table className={classes.table} aria-label="simple table" >
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Nombre Archivo</TableCell>
                              <TableCell align="center">Tipo Ingeniería</TableCell>
                              <TableCell align="center">Fecha Creación</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                        
                          {/* { archivosDelSitio.inge.length>0 && Object.values(archivosDelSitio.inge).length>0 && Object.values(archivosDelSitio.inge).map((item, index) => ( */}
                            { archivosDelSitio.inge.length>0 && Object.values(archivosDelSitio.inge).length>0 && ordenarIngenierias(archivosDelSitio.inge).map((item, index) => (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row"  >
                               <Button   
                               style={{color:verdefondo}}
                              //  onClick={()=>downloadFileHandler(item.key)}
                               >{item.key}
                               </Button>
                           
                                </TableCell>
                                <TableCell component="th" scope="row"  >
                               <Button   >{item.tipo}</Button>
                           
                                </TableCell>
                                <TableCell component="th" scope="row"  >
                               <Button  >{queFecha(item.fecha) }</Button>
                           
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>}
                            {downloading && <CircularProgress/>}
                        </div>
                    </Grid>
                    <div className={classes.root}>
                    <Typography  align="center" className={classes.instructions} >
           Detalle del Sitio
          </Typography>
                            {<Grid  container className={classes.zona2}>
   
                            <Grid item xs={6} sm={3}> 
                             
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="altura_validada">Altura Validada</InputLabel>
                                        <OutlinedInput id="altura_validada" 
                                        value={detallesSitioInfo['altura_validada'] ? detallesSitioInfo['altura_validada'] :""} 
                                        disabled={userInfo && userInfo.isUser? false : true }
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['altura_validada']:value.target.value, ['altura_validadaChange']:true })}
                                        label="Altura Validada" 
                                        />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined"  className={classes.formControl}  >
                                        <InputLabel htmlFor="altura_pararrayos">Altura Pararayos</InputLabel>
                                        <OutlinedInput id="altura_pararrayos" 
                                        value={detallesSitioInfo['altura_pararrayos']?detallesSitioInfo['altura_pararrayos']:""}
                                        disabled={userInfo && userInfo.isUser? false : true }
                                         onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['altura_pararrayos']:value.target.value, ['altura_pararrayosChange']:true })}
                                         label="Altura Pararayos" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                             
                                      <FormControl variant="outlined"  className={classes.formControl}>
                                        <InputLabel htmlFor="resistencia_viento">Resistencia Viento</InputLabel>
                                        <OutlinedInput id="resistencia_viento" 
                                        value={detallesSitioInfo['resistencia_viento'] ? detallesSitioInfo['resistencia_viento'] :""} 
                                        disabled={userInfo && userInfo.isUser? false : true }
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['resistencia_viento']:value.target.value, ['resistencia_vientoChange']:true })}
                                        label="Resistencia Viento" 
                                        />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined"  className={classes.formControl}  >
                                        <InputLabel htmlFor="tx">Tipo de Transmisión</InputLabel>
                                        <OutlinedInput id="tx" 
                                        value={detallesSitioInfo['tx']?detallesSitioInfo['tx']:""}
                                        disabled={userInfo && userInfo.isUser? false : true }
                                         onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['tx']:value.target.value, ['txChange']:true })}
                                         label="Tipo de Transmisión" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                             
                                      <FormControl variant="outlined"  className={classes.formControl}>
                                        <InputLabel htmlFor="tipo_estructura">Tipo de Estructura</InputLabel>
                                        <OutlinedInput id="tipo_estructura" 
                                        value={detallesSitioInfo['tipo_estructura'] ? detallesSitioInfo['tipo_estructura'] :""} 
                                        disabled={userInfo && userInfo.isUser? false : true }
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['tipo_estructura']:value.target.value, ['tipo_estructuraChange']:true })}
                                        label="Tipo de Estructura" 
                                        />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined"   className={classes.formControl} >
                                        <InputLabel htmlFor="area">Área Rentada</InputLabel>
                                        <OutlinedInput id="area" 
                                        value={detallesSitioInfo['area_arrendada']?detallesSitioInfo['area_arrendada']:""}
                                        disabled={userInfo && userInfo.isUser? false : true }
                                         onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['area_arrendada']:value.target.value, ['area_arrendadaChange']:true })}
                                         label="Área Rentada" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="area_a_utilizar">Area a Utilizar</InputLabel>
                                        <OutlinedInput id="area_a_utilizar" 
                                        value={detallesSitioInfo['area_a_utilizar']?detallesSitioInfo['area_a_utilizar']:""}
                                        disabled={userInfo && userInfo.isUser? false : true }
                                         onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['area_a_utilizar']:value.target.value, ['area_a_utilizarChange']:true })}
                                         label="Área a Utilizar" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="tipologia_sitio">Tipologia Sitio</InputLabel>
                                        <OutlinedInput id="tipologia_sitio" 
                                        value={detallesSitioInfo['tipologia_sitio']?detallesSitioInfo['tipologia_sitio']:""} 
                                        disabled={userInfo && userInfo.isUser? false : true }
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['tipologia_sitio']:value.target.value, ['tipologia_sitioChange']:true })}
                                        label="Tipología Sitio" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={8} sm={8} > 
                              <TextField
                                className={classes.formControl2}
                                  id="arrendatario" 
                                  onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['arrendatario']:value.target.value, ['arrendatarioChange']:true })}
                                  disabled={userInfo && userInfo.isUser? false : true }
                                  label="Arrendatario/Propietario" 
                                  variant="outlined"
                                  // color="secondary"
                                  fullWidth
                                  value={detallesSitioInfo['arrendatario']?detallesSitioInfo['arrendatario']:""} 
                                /> 
                              </Grid>
                             
                              <Grid item xs={4} sm={4}> 
                                  <TextField
                                      className={classes.formControl2}
                                      id="identificacion_arrendatario" 
                                      onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['identificacion_arrendatario']:value.target.value, ['identificacion_arrendatarioChange']:true })}
                                      disabled={userInfo && userInfo.isUser? false : true }
                                      label="Identificacion Arrendatario"
                                      variant="outlined"
                                      // color="secondary"
                                      fullWidth
                                      value={detallesSitioInfo['identificacion_arrendatario']?detallesSitioInfo['identificacion_arrendatario']:""} 
                                    /> 

                              </Grid>
                              <Grid item xs={8} sm={8}> 
                                  <TextField
                                      id="direccion_sitio" 
                                      className={classes.formControl2}
                                      value={detallesSitioInfo['direccion_sitio']?detallesSitioInfo['direccion_sitio']:""} 
                                      disabled={userInfo && userInfo.isUser? false : true }
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['direccion_sitio']:value.target.value, ['direccion_sitioChange']:true })} 
                                        label="Direccion de la Finca" 
                                        variant="outlined"
                                      fullWidth
                                    /> 
                              </Grid>
                              <Grid item xs={4} sm={4}> 
                              <TextField
                                      id="numero_finca" 
                                      className={classes.formControl2}
                                      value={detallesSitioInfo['numero_finca']?detallesSitioInfo['numero_finca']:""}
                                      disabled={userInfo && userInfo.isUser? false : true }
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['numero_finca']:value.target.value, ['numero_fincaChange']:true })} 
                                        label="Número de Finca" 
                                        variant="outlined"
                                      fullWidth
                                    /> 

                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="departamento">Provincia/Departamento</InputLabel>
                                        <OutlinedInput id="departamento" 
                                        disabled={userInfo && userInfo.isUser? false : true }
                                        value={detallesSitioInfo['departamento']?detallesSitioInfo['departamento']:""} 
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['departamento']:value.target.value, ['departamentoChange']:true })}  
                                        label="Provincia/Departamento" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="municipio">Municipio</InputLabel>
                                        <OutlinedInput id="municipio" 
                                        value={detallesSitioInfo['municipio']?detallesSitioInfo['municipio']:""}
                                        disabled={userInfo && userInfo.isUser? false : true }
                                         onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['municipio']:value.target.value, ['municipioChange']:true })}  
                                         label="Municipio" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="latitud_validada_grados">Latitud Validada en Grados</InputLabel>
                                        <OutlinedInput id="latitud_validada_grados" 
                                        value={detallesSitioInfo['latitud_validada_grados']?detallesSitioInfo['latitud_validada_grados']:""} 
                                        disabled={userInfo && userInfo.isUser? false : true }
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['latitud_validada_grados']:value.target.value, ['latitud_validada_gradosChange']:true })}  
                                        label="Latitud Validada en Grados" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="longitud_validada_grados">Longitud Validada en Grados</InputLabel>
                                        <OutlinedInput id="longitud_validada_grados" 
                                        value={detallesSitioInfo['longitud_validada_grados']?detallesSitioInfo['longitud_validada_grados']:""} 
                                        disabled={userInfo && userInfo.isUser? false : true }
                                        onChange={(value)=> setDetallesSitioInfo({...detallesSitioInfo, ['longitud_validada_grados']:value.target.value, ['longitud_validada_gradosChange']:true })} 
                                        label="Longitud Validada en Grados" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={12} className={classes.multitexto}> 
                       
                              <TextField
                                  id="derecho_paso_sitio"
                                  label="Información Derecho de Paso"
                                  multiline
                                  minRows={4}
                                  placeholder="describa el Derecho de paso..."
                                  variant="outlined"
                                  fullWidth
                                  disabled={userInfo && userInfo.isUser? false : true }
                                  value={detallesSitioInfo['derecho_paso_sitio']? detallesSitioInfo['derecho_paso_sitio']:""} 
                                  onChange={(e)=> setDetallesSitioInfo({...detallesSitioInfo, ['derecho_paso_sitio']:e.target.value , ['derecho_paso_sitioChange']:true })}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} className={classes.multitexto}> 

                              <TextField
                                  id="electricidad_sitio"
                                  label="Información Energia Eléctrica"
                                  multiline
                                  minRows={4}
                                  placeholder="Datos de la electricidad del sitio..."
                                  variant="outlined"
                                  fullWidth
                                  disabled={userInfo && userInfo.isUser? false : true }
                                  value={detallesSitioInfo['electricidad_sitio'] ? detallesSitioInfo['electricidad_sitio']: ""} 
                                  onChange={(e)=> setDetallesSitioInfo({...detallesSitioInfo, ['electricidad_sitio']:e.target.value, ['electricidad_sitioChange']:true })}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} className={classes.multitexto}> 

                              <TextField
                                  id="observaciones_sitio"
                                  label="Observaciones del Sitio"
                                  multiline
                                  minRows={4}
                                  placeholder="Observaciones del sitio..."
                                  variant="outlined"
                                  fullWidth
                                  disabled={userInfo && userInfo.isUser? false : true }
                                  value={detallesSitioInfo['observaciones_sitio']?detallesSitioInfo['observaciones_sitio']:""} 
                                  onChange={(e)=> setDetallesSitioInfo({...detallesSitioInfo, ['observaciones_sitio']:e.target.value, ['observaciones_sitioChange']:true  })}
                                />
                              </Grid>
                              <Tooltip title="Guardar" aria-label="add" placement="left-start" >
                              <Fab color="primary" aria-label="add" className={classes.fab} type="submit">
                                <SaveIcon />
                              </Fab>
                              </Tooltip>     
                              </Grid>}
                              </div>
                              </Grid>}
                            </Grid>
                            </form>
                          </Container>
    </React.Fragment>
  </div>
    )

}
export default DetalleOTScreen;


