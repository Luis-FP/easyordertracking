import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { userPermiso } from "../actions/userActions";
// import { Link } from "react-router-dom";
import "w3-css/w3.css";
import Papa from "papaparse";
import fileDownload from 'js-file-download';
import { fechaActual } from '../components/fechas';
import { crearUsuarios , crearSitios, buscarSitiosCargados, crearOTNueva, usersOTs, archivosSitio} from "../actions/userActions";
import { autoLogout } from '../actions/userActions';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { ListItemText, Typography } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { secondsToMilliseconds } from "date-fns";
import { purple, red , blue , grey, green } from '@material-ui/core/colors';


const purple3 = purple[300]
// const naranja7 = orange[700]
const verdefondo = green[500]
const azulfondo = blue[900]
const azulClaro = blue[300]
const rojoFondo = red[700]
const greyfondo = grey[300]
// const greyfondo2 = grey[400]
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 40,
    fullWidth: 'true',
  },
  table: {
    minWidth: 650,
  },
  error: {
    borderRadius:8,
    maxWidth:'90%',
    backgroundColor:"red",
    color:"white",
    // width:"80%",
    fontSize:11
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontSize: 20,
    border: 'solid',
    borderColor: azulClaro,
    color:azulfondo
  },
}));

const servicios = [
  {servicio: 'Planos para Permisos', sla: 3 , checklist: ['Plano Catastral', 'Plano Topográfico']},
  {servicio: 'Modificación de Planos para Permisos', sla: 2, checklist: ['Plano Catastral', 'Plano Topográfico'] },
  {servicio: 'Planos para Construcción', sla: 4, checklist: ['Plano Catastral', 'Plano Topográfico', 'Estudio de Suelo', 'Diseño de Cimentación', 'Detalles Adicionales'] },
  {servicio: 'Modificación de Planos para Construcción', sla: 3, checklist: ['Plano Catastral', 'Plano Topográfico', 'Estudio de Suelo', 'Diseño de Cimentación', 'Detalles Adicionales'] },
  {servicio: 'Diseño de Cimentación', sla: 3 , checklist: [ 'Estudio de Suelo']},
]

const prioridades = [
  'Normal',
  'Alta',
  'Inmediata',
]

function CrearOTScreen(props) {
  const classes = useStyles();
  // const [permisoActivo, setPermisoActivo] = useState('');

  // const userEntrada = useSelector((state) => state.userEntrada);
  // const { userKpiEntrada } = userEntrada;

  // const userPermisoInfo = useSelector((state) => state.userPermisoInfo);
  // const { userKpiPermisos } = userPermisoInfo;
  const offsetSLA =[ // dependiendo del dia de la semana se suman dias para que no caiga ni sabado ni domingo
      {offset:1},
      {offset:0},
      {offset:0},
      {offset:0},
      {offset:0},
      {offset:3},
      {offset:2}
  ]
  
  const listaSitiosCargados = useSelector(state => state.listaSitiosCargados);
  const { sitiosCargados, loadingSitios } = listaSitiosCargados;

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const createSitioR = useSelector((state) => state.createSitioR)
  const { loadingSitio, createSitio, errorSitio } = createSitioR;

  const userOTSCreate = useSelector((state) => state.userOTSCreate)
  const { loadingNuevaOT, OTNuevaInfo } = userOTSCreate;

  const archivosDisponiblesSitio = useSelector((state) => state.archivosDisponiblesSitio)
  const { archivosDelSitio, loadingArchivo } = archivosDisponiblesSitio;
  console.log("archivosDelSitio", archivosDelSitio)

  const [open, setOpen] = React.useState(false);

  const [disabled, setDisabled] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const [fileCliente, setFileCliente] = useState("");
  const [indice, setIndice] = useState(0);
  const [referenciaAWS, setReferenciaAWS] = useState([]);
  const [listaArchivos, setListaArchivos] = useState([
  ]);
  const [datosSitios, setDatosSitios] = useState([]);
  // const [fileBajado, setFileBajado] = useState(false);
  // const [loadingFilesSitios, setDownloadingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [otInfo, setOtInfo] = React.useState({
    cliente: "",
    detalle_requerimiento: "",
    email_responsable_cliente: "",
    fecha_requerida: new Date(new Date().getTime() + 4 *86400000) ,
    fecha_sla: new Date(new Date().getTime() + 4 *86400000) ,
    sla: null ,
    // pais: "",
    prioridad: "",
    proyecto:  "",
    requerimiento: "",
    responsable_cliente: "",
    sitio_codigo:  "",
    sitio_nombre:  "",
  });
  // const [erroresIngreso, setErroresIngreso] = useState({
  //   sitio_codigo:"" ,
  //   requerimiento: "",
  //   detalle_requerimiento:"" ,
  //   prioridad:""
  // });
  
 

  const dispatch = useDispatch();

  useEffect(() => {
if(OTNuevaInfo){
  setOpen(true);
  
}


  }, [OTNuevaInfo]);


  useEffect(() => {

    if (!userInfo) {
      props.history.push('/login');
  } 
  dispatch(buscarSitiosCargados())
  }, []);
  ////console.log(fileList);
  const onChangeOT = (event) => {
    setUsuarios([]);//informacion de usuarios
    setLoadingFiles(true);//visual nada mas
    const fileList = event.target.files;
    //console.log("archivos a analizar:", fileList);

    let titulos = [];
    let usuarios = [];

    const usuariosId = document.getElementById("datosOTs");//visual
    const titulosId = document.getElementById("titulosOTs");//visual
    usuariosId.innerHTML = "";
    titulosId.innerHTML = "";
    let readTitle = false;//para agregar el titulo nada mas.
    let maxCol = 28+1;
    Papa.parse(fileList[0], {
      worker: true,
      step: (results) => {
        if (!(results.data.length <= 1)) {
          if (!readTitle) {
            let title = "";
            for (let i = 0; i < results.data.length; i++) {
              if (i == maxCol) break;

              title += `<th>${results.data[i]}</th>`;
              titulos.push(results.data[i]);
            }
            titulosId.innerHTML += "<tr>" + title + "</tr>";
            readTitle = true;
          } else {
            let users = "";
            let dict = {};
            for (let i = 0; i < results.data.length; i++) {
              if (i == maxCol) break;// despues de la columna maxCol no hay datos importantes
              //limitador:
              users += `<td>${results.data[i]}</td>`;

              if (titulos[i] !== "")
                dict[titulos[i]] = results.data[i];
            }

            if (usuarios.length <= 10) {//maximo 10 users mostrados en pantalla.
              usuariosId.innerHTML += "<tr>" + users + "</tr>";
            }
            usuarios.push(dict);
          }
        }
      },
      complete: () => {
        // let btnUsers= document.getElementById("crearUsuarios");
        //console.log("usuarios final", usuarios);
        setUsuarios(usuarios);
        setLoadingFiles(false);
        setDisabled(false);
        //console.log("All done!");
      },
    });
  };
  const onLoadOT = (event) => {
    event.preventDefault();
    dispatch(crearUsuarios(usuarios));
  };

  // subida de archivos a Amazon
  const uploadFileHandler = (e) => {
    setFileCliente(e.target.value)
    const file = e.target.files[0];

    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setUploading(true);
    axios.post("/api/uploads/s3", bodyFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log('response.data',response.data)
        let x = [];
        x.push(response.data)
        const y = listaArchivos.length +1
        setListaArchivos({...listaArchivos, [indice]: {'file': file.name, 'path': response.data, fileMeta:file} })
        setIndice(indice+1);
        // setReferenciaAWS({...referenciaAWS , x})
 
        setReferenciaAWS(fileCliente + "Subido Exitosamente");
        // setFileCliente("Subido Exitosamente");
        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setReferenciaAWS("Error")
        setUploading(false);
      });
  };


  
  const onChangeSitio = (event) => {
    setDatosSitios([]);//informacion de usuarios
    setLoadingFiles(true);//visual nada mas
    const fileList = event.target.files;
    //console.log("archivos a analizar:", fileList);

    let titulos = [];
    let usuarios = [];

    const usuariosId = document.getElementById("datosSitios");//visual
    const titulosId = document.getElementById("titulosSitios");//visual
    usuariosId.innerHTML = "";
    titulosId.innerHTML = "";
    let readTitle = false;//para agregar el titulo nada mas.
    let maxCol = 20+1;
    Papa.parse(fileList[0], {
      worker: true,
      step: (results) => {
        if (!(results.data.length <= 1)) {
          if (!readTitle) {
            let title = "";
            for (let i = 0; i < results.data.length; i++) {
              if (i == maxCol) break;

              title += `<th>${results.data[i]}</th>`;
              titulos.push(results.data[i]);
            }
            titulosId.innerHTML += "<tr>" + title + "</tr>";
            readTitle = true;
          } else {
            let users = "";
            let dict = {};
            for (let i = 0; i < results.data.length; i++) {
              if (i == maxCol) break;// despues de la columna maxCol no hay datos importantes
              //limitador:
              users += `<td>${results.data[i]}</td>`;

              if (titulos[i] !== "")
                dict[titulos[i]] = results.data[i];
            }

            if (datosSitios.length <= 10) {//maximo 10 users mostrados en pantalla.
              usuariosId.innerHTML += "<tr>" + users + "</tr>";
            }
            datosSitios.push(dict);
          }
        }
      },
      complete: () => {
        // let btnUsers= document.getElementById("crearUsuarios");
        //console.log("usuarios final", usuarios);
        setDatosSitios(datosSitios);
        setLoadingFiles(false);
        setDisabled(false);
        //console.log("All done!");
      },
    });
  };
  const onLoadSitio = (event) => {
    event.preventDefault();
    dispatch(crearSitios(datosSitios));
  };

const handleSitio = (e, value) => {
  if(value){
    setOtInfo({...otInfo, 
      ['proyecto']: value.proyecto, 
      ['sitio_codigo']: value.sitio_codigo, 
      ['sitio_nombre']: value.sitio_nombre,
      ['pais']: value.pais
    })
    dispatch(archivosSitio(value))
  }

}

const crearOT = (e) => {
  e.preventDefault()
  let erroresIngreso = [];
  const error1 = document.getElementById("error1")
  const error2 = document.getElementById("error2")
  const error3 = document.getElementById("error3")
  const error4 = document.getElementById("error4")
 // revisar calidad de las entradas
 console.log("otInfo crearOT", otInfo);
if( otInfo['sitio_codigo']==="" ||
    otInfo['requerimiento']==="" || 
    otInfo['detalle_requerimiento']==="" ||
    otInfo['prioridad']===""
){
  
  if(otInfo['sitio_codigo']===""){
    error1.innerHTML="Escoja un sitio, si no esta en la lista debe subirlo en el paso anterior";
    erroresIngreso.push('error')
    // console.log('aqui!!!!!!!!!!!!!!!!!!!!!!!!!!!', erroresIngreso)
  }
  if(otInfo['requerimiento']===""){
    error2.innerHTML="Debe seleccionar su requerimiento";
    erroresIngreso.push('error')
  }
 
  if(otInfo['prioridad']===""){
    error3.innerHTML="Debe seleccionar el nivel de prioridad que tiene su trabajo";
    erroresIngreso.push('error')
  }
  if(otInfo['detalle_requerimiento']===""){
    error4.innerHTML="Debe seleccionar el nivel de prioridad que tiene su trabajo";
    erroresIngreso.push('error')
  }
}
console.log("errorCampo",erroresIngreso);
  if(erroresIngreso.length>0){
    // document.querySelector('#errorCampoSitio').innerHTML=erroresIngreso['sitio_codigo'];
    // console.log('error')
  }else{
    // console.log('despacho crear OT', otInfo,  listaArchivos)
    dispatch(crearOTNueva(otInfo, listaArchivos))

  }


}



const handleClose = () => {
  setOpen(false);
  props.history.push('/');
};


  return (
     <React.Fragment>
      <CssBaseline />
      <Container width="60%">
<Typography  align="center" className={classes.instructions} >1- Subir Datos de Sitios</Typography>
      
      <form className={classes.root}>
      <input
        accept="*"
        className={classes.input}
        id="contained-button-file2"
        multiple
        // hidden
        type="file"
        // value={fileCliente}
        // onChange={(e) => setFileCliente(e.target.value)}
        onChange={(e) => {
              onChangeSitio(e);
        }}
      />
      <label htmlFor="contained-button-file2">       
        {loadingSitio ? <CircularProgress /> :  <Button variant="contained" color="primary"  fullWidth component="span">Subir Sitios</Button> }
        {createSitio &&  <Button variant="contained" style={{backgroundColor: verdefondo, width: '60%' }} fullWidth component="span">{createSitio.message}</Button>}
        {errorSitio &&  <Button variant="contained"  style={{backgroundColor: rojoFondo }} fullWidth component="span">{errorSitio.message}</Button>}       
      </label>

      <Button 
      id="crearUsuarios"
      variant="contained" 
      // style={{backgroundColor:rojoFondo}}
        color="secondary"
      fullWidth={true} 
      type='submit' 
      disabled={disabled || loadingSitio}
      onClick={(e) => {
              onLoadSitio(e);
            }}
      >
      Crear Sitios
      </Button>

        {/* {loadingFiles || loadingSitio ? <CircularProgress />: <div></div>}
        {createSitio ? <div className="w3-section w3-center w3-green w3-round">{createSitio.message}</div> : <div></div>}
        {errorSitio ? <div className="w3-section w3-center w3-red w3-round">{errorSitio.message}</div> : <div></div>} */}

      
      </form>
      <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead id="titulosSitios">
             
            </TableHead>
            <TableBody  id="datosSitios">
           
            </TableBody>
          </Table>
        </TableContainer>
      {/* <div className="w3-row w3-margin-bottom"> */}
        {/* <div className="w3-col m2 l1 w3-container"></div> */}
        {/* <table className="w3-col s12 m8 l10 w3-responsive w3-table-all w3-hoverable w3-centered w3-round w3-border w3-margin-bottom">
          <thead id="titulosSitios"></thead>
          <tbody id="datosSitios"></tbody>
        </table>
        <div className="w3-col m2 l1 w3-container"></div>
      </div> */}


      <Typography  align="center" className={classes.instructions} >2- Crear OT</Typography>
      {/* <h1 className="w3-xxlarge w3-text-dark-grey">2- Crear OT</h1> */}
      <form className="w3-col s12 w3-padding w3-section" id="formaCreaOT" onSubmit={crearOT}>
      <Grid item xs={12} sm={12} container>
      {console.log('otInfo, erroresIngreso', otInfo)} 
      { sitiosCargados && sitiosCargados.data && <Grid item md={4}  xs={12}  sm={6}> 
                <Autocomplete
                id="listaSitiosCargados"
                required
                onChange={handleSitio}
                options={sitiosCargados.data}
                getOptionLabel={(option) => option.sitio_nombre}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Sitio" variant="outlined" />}
              />
               <div className={classes.error} align="center" id="error1"></div>
              {/* {erroresIngreso && erroresIngreso['sitio_codigo'] && <div style={{ color: 'red', height:15}}>{erroresIngreso['sitio_codigo']}</div>} */}
              </Grid>}
              
              <Grid item md={4}  xs={12}  sm={6}> 
              {console.log('offsetSLA[new Date().getDay()]', offsetSLA[new Date().getDay()])}
              <Autocomplete
                id="servicios"
                onChange={(e,value)=> setOtInfo({...otInfo, 
                ['requerimiento']: value.servicio,  
                ['sla']:value.sla ,  
                ['fecha_sla']: new Date(new Date().getTime() + ( value.sla + offsetSLA[new Date().getDay()].offset) *86400000),
                ['fecha_requerida']: new Date(new Date().getTime() + ( value.sla + offsetSLA[new Date().getDay()].offset) *86400000),

                })}
                options={servicios}
                getOptionLabel={(option) => option.servicio}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Servicios" variant="outlined" />}
              />
                <div className={classes.error} align="center" id="error2"></div>
                    </Grid>
            
                    <Grid item md={4}  xs={12}  sm={6}> 
                    <Autocomplete
                        id="prioridad"
                        required={true}
                        onChange={(e, value)=> setOtInfo({...otInfo, ['prioridad']: value})}
                        options={prioridades}
                        getOptionLabel={(option) => option}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Prioridad" variant="outlined" />}
                      />
                  <div className={classes.error} align="center" id="error3"></div>
                    </Grid>
                    <Grid item md={4}  xs={6}  sm={6}>
                    </Grid>
                    <Grid item md={1}  xs={1}  sm={1}>
                    {otInfo.sla? <Typography style={{fontSize:18, marginTop: 20}} >{otInfo.sla} dias</Typography> : "" } 
                    </Grid>
                      <Grid item md={3}  xs={5}  sm={5}> 
                      
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                     
                        <KeyboardDatePicker
                        
                          margin="normal"
                          disabled={true}
                          id="fecha_sla"
                          label="Fecha SLA"
                          format="MM/dd/yyyy"
                          value={otInfo.fecha_sla}
                          // onChange={handleDateChange}
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
                        onChange={(date)=> setOtInfo({...otInfo, ['fecha_requerida']: new Date(date)})}
                        value={otInfo.fecha_requerida}
                        // onChange={handleDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                      </MuiPickersUtilsProvider>
                      </Grid>
                 
                    <Grid item xs={12} sm={12}> 
                    <TextField
                                  id="detalle_requerimiento"
                                  label="Detalle Requerimiento"
                                  onChange={(e)=> setOtInfo({...otInfo, ['detalle_requerimiento']: e.target.value})}
                                  multiline
                                  rows={4}
                                  // defaultValue="describa el Derecho de paso..."
                                  variant="outlined"
                                  fullWidth
                                  required={true}
                                  // value={detalleSitioInfo['detalle_requerimiento']} 
                                />
                               <div className={classes.error} align="center" id="error4"></div>
                    </Grid>

                  </Grid>
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
                  {item.file}
                  </TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>}

    </div>
    <div className={classes.root}>
      <Typography align="center" className={classes.instructions} >3- Check List</Typography> 
      <Typography>Debe subir todos los documentos indicados en el Chechlist para ejecutar su Orden</Typography>
      <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Check</TableCell>
                <TableCell align="center">Documento Requerido</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            { servicios &&  otInfo && otInfo['requerimiento'] && servicios.filter(serv => serv.servicio===otInfo['requerimiento'])[0].checklist.map((item, index) => (
                <TableRow key={index}>  
                <TableCell padding="checkbox">
                  <Checkbox
                    // indeterminate={numSelected > 0 && numSelected < rowCount}
                    // checked={rowCount > 0 && numSelected === rowCount}
                    // onChange={onSelectAllClick}
                    required
                    inputProps={{ 'aria-label': 'select all desserts' }}
                  />
                </TableCell>
                  <TableCell component="th" scope="row">
                  {item} 
                  </TableCell>
                  <TableCell component="th" scope="row">
                  {/* <input
                    accept="*"
                    className={classes.input}
                    id={"doc"+item}
                    multiple
                    type="file"
                    value={fileCliente}
                    // onChange={(e) => setFileCliente(e.target.value)}
                    onChange={uploadFileHandler}
                  />
                  <label htmlFor={"doc"+item}>       
                    {uploading? <CircularProgress /> :  <Button variant="contained" color="primary" component="span">Subir</Button> }         
                  </label> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

    </div>
      <div className={classes.root}>
      <Typography align="center" className={classes.instructions} >4- Subir Otros Documentos Relacionados</Typography> 
      <input
        accept="*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        value={fileCliente}
        // onChange={(e) => setFileCliente(e.target.value)}
        onChange={uploadFileHandler}
      />
      <label htmlFor="contained-button-file">       
        {uploading? <CircularProgress /> :  <Button variant="contained" color="primary" component="span">Subir Documentos</Button> }         
      </label>
     
      {console.log("Array.from(listaArchivos)", listaArchivos, "Object.keys(listaArchivos).length>0",Object.keys(listaArchivos).length>0)}
      <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Nombre Archivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            { Object.keys(listaArchivos).length>0 && Object.values(listaArchivos).map((item, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                  {item.file} 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

    </div>
                  <Button variant="contained" color="primary" fullWidth={true} type='submit' >
                    Crear OT
                  </Button>
       
      </form>
          
    <div>
    {console.log("OTNuevaInfo", OTNuevaInfo)}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"OT Creada Exitosamente"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                La OT #{OTNuevaInfo? OTNuevaInfo.ot_number:""} ha sido creada exitosamente
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary" autoFocus>
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    {/* </div> */}
  </Container>
  </React.Fragment>
  );
}
export default CrearOTScreen;
