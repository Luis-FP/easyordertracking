import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { userPermiso } from "../actions/userActions";
// import { Link } from "react-router-dom";
import "w3-css/w3.css";
import Papa from "papaparse";
import { fechaActual } from '../components/fechas';
import { crearUsuarios , crearSitios, buscarSitiosCargados, crearOTNueva} from "../actions/userActions";
import { autoLogout } from '../actions/userActions';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Typography } from "@material-ui/core";

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
}));

const servicios = [
  {servicio: 'Planos para Permisos', sla: 3 },
  {servicio: 'Modificación de Planos para Permisos', sla: 2 },
  {servicio: 'Planos para Construcción', sla: 4 },
  {servicio: 'Modificación de Planos para Construcción', sla: 3 },
  {servicio: 'Diseño de Cimentación', sla: 3 },
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
  const offsetSLA =[
      {offset:1},
      {offset:1},
      {offset:1},
      {offset:1},
      {offset:1},
      {offset:3},
      {offset:2}
  ]
  
  const listaSitiosCargados = useSelector(state => state.listaSitiosCargados);
  const { sitiosCargados, loadingSitios } = listaSitiosCargados;

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const { loadingSitio, createSitio, errorSitio } = useSelector((state) => state.createSitioR)

  const { loadingOT, createUser, errorOT } = useSelector((state) => state.userCreateInfo)
  // const [incapacidad, setIncapacidad] = useState(0);
  // const [permiso, setPermiso] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [fileCliente, setFileCliente] = useState("");
  const [referenciaAWS, setReferenciaAWS] = useState("");
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
  // const [disabled, setDisabled] = useState(true);
  const [datosSitios, setDatosSitios] = useState([]);
  const [loadingFilesSitios, setLoadingFilesSitios] = useState(false);

  const dispatch = useDispatch();

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
        setReferenciaAWS("Subido Exitosamente")
        // setFileCliente(fileCliente + "Subido Exitosamente");
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
  setOtInfo({...otInfo, 
    ['proyecto']: value.proyecto, 
    ['sitio_codigo']: value.sitio_codigo, 
    ['sitio_nombre']: value.sitio_nombre,
    ['pais']: value.pais
  })
}

const crearOT = (e) => {
  e.preventDefault()
  console.log('despacho crear OT')
  dispatch(crearOTNueva(otInfo))
}

  return (
    <div className="w3-row w3-center  w3-margin-bottom">

<div className="w3-row w3-center  w3-margin-bottom">
      <h1 className="w3-xxlarge w3-text-dark-grey">1- Subir Datos de Sitios</h1>
      <form className="w3-col s12 w3-padding w3-section">
        <div className="w3-row">
          <div className="w3-col m3 l4 w3-container"></div>
          <input
            className="w3-col s12 m6 l4 w3-padding"
            type="file"
            id="file-selector"
            onChange={(e) => {
              onChangeSitio(e);
            }}
            multiple
          />
          <div className="w3-col m3 l4 w3-container"></div>
        </div>

        {loadingFiles || loadingSitio ? <CircularProgress />: <div></div>}
        {createSitio ? <div className="w3-section w3-center w3-green w3-round">{createSitio.message}</div> : <div></div>}
        {errorSitio ? <div className="w3-section w3-center w3-red w3-round">{errorSitio.message}</div> : <div></div>}

        <div className="w3-col s12 w3-section">
          <div className="w3-col m3 l4 w3-container"></div>
          <button
            id="crearUsuarios"
            disabled={disabled || loadingSitio}
            className="w3-col s12 m6 l4 w3-btn w3-button w3-hover-blue w3-blue w3-round"
            onClick={(e) => {
              onLoadSitio(e);
            }}
          >
            Crear Sitio
          </button>
          <div className="w3-col m3 l4 w3-container"></div>
        </div>
      </form>
      <div className="w3-row w3-margin-bottom">
        <div className="w3-col m2 l1 w3-container"></div>
        <table className="w3-col s12 m8 l10 w3-responsive w3-table-all w3-hoverable w3-centered w3-round w3-border w3-margin-bottom">
          <thead id="titulosSitios"></thead>
          <tbody id="datosSitios"></tbody>
        </table>
        <div className="w3-col m2 l1 w3-container"></div>
      </div>
    </div>

      <h1 className="w3-xxlarge w3-text-dark-grey">2- Crear OT</h1>
      <form className="w3-col s12 w3-padding w3-section" onSubmit={crearOT}>
      <Grid item xs={12} sm={12} container>
      {console.log('otInfo', otInfo)} 
      { sitiosCargados && sitiosCargados.data && <Grid item md={4}  xs={12}  sm={6}> 
                <Autocomplete
                id="listaSitiosCargados"
                onChange={handleSitio}
                options={sitiosCargados.data}
                getOptionLabel={(option) => option.sitio_nombre}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Sitio" variant="outlined" />}
              />
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
                    </Grid>

                  </Grid>
                  <Button variant="contained" color="primary" fullWidth={true} type='submit' >
                    Crear OT
                  </Button>
        {/* <div className="w3-row">
          <div className="w3-col m3 l4 w3-container"></div>
          <input
            className="w3-col s12 m6 l4 w3-padding"
            type="file"
            id="file-selector"
            onChange={(e) => {
              onChangeOT(e);
            }}
            multiple
          />
          <div className="w3-col m3 l4 w3-container"></div>
        </div>

        {loadingFiles || loadingOT ? <CircularProgress /> : <div></div>}
        {createUser ? <div className="w3-section w3-center w3-green w3-round">{createUser.message}</div> : <div></div>}
        {errorOT ? <div className="w3-section w3-center w3-red w3-round">{errorOT.message}</div> : <div></div>}

        <div className="w3-col s12 w3-section">
          <div className="w3-col m3 l4 w3-container"></div>
          <button
            id="crearUsuarios"
            disabled={disabled || loadingOT}
            className="w3-col s12 m6 l4 w3-btn w3-button w3-hover-blue w3-blue w3-round"
            onClick={(e) => {
              onLoadOT(e);
            }}
          >
            Crear OTs
          </button>
          <div className="w3-col m3 l4 w3-container"></div>
        </div> */}
      </form>
      <div className="w3-row w3-margin-bottom">
        <div className="w3-col m2 l1 w3-container"></div>
        <table className="w3-col s12 m8 l10 w3-responsive w3-table-all w3-hoverable w3-centered w3-round w3-border w3-margin-bottom">
          <thead id="titulosOTs"></thead>
          <tbody id="datosOTs"></tbody>
        </table>
        <div className="w3-col m2 l1 w3-container"></div>
      </div>
      <div className={classes.root}>
      <h1 className="w3-xxlarge w3-text-dark-grey">3- Subir Documentos Relacionados</h1>
            <div>{fileCliente}</div>
            <div>{referenciaAWS}</div>
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
    </div>
    </div>

  );
}
export default CrearOTScreen;
