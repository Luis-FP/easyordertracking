import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userPendientesList, actualizarPendiente, userKpiList, horaVistaHoy } from "../actions/kpiActions";
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
import TextField from '@material-ui/core/TextField';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

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
    fontSize: 32,
    color: 'green',
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
  },
  table: {
    // minWidth: 650,
  },
  multitexto: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
     
    },
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

let fasesActivas =[
  {titulo:'Preparación', codigo:'prep', orden:0, activa: false, terminada: true },
  {titulo:'Busqueda',orden:1,codigo:'busq', activa: false , terminada: true},
  {titulo:'Validación Técnica',codigo:'valTec', orden:2, activa: false , terminada: true},
  {titulo:'Negociación',codigo:'nego',orden:3, activa: false , terminada: true},
  {titulo:'Validación Legal',codigo:'valLegal',orden:4, activa: true , terminada: true},
  {titulo:'Consulta Ciudadana', codigo:'consulta',orden:5, activa: true , terminada: true},
  {titulo:'Inmisiones',codigo:'inmi',orden:6, activa: false , terminada: true},
  {titulo:'topografía',codigo:'topo',orden:7, activa: false , terminada: true},
  {titulo:'ASEP',codigo:'asep',orden:8, activa: false , terminada: true},
  {titulo:'Tommy Guardia',codigo:'tomGua', orden:9, activa: false , terminada: true},
  {titulo:'Aeronautica Civil',codigo:'aac',orden:10, activa: false , terminada: true},
  {titulo:'Anteproyecto Bomberos',codigo:'antBom',orden:11, activa: false , terminada: false},
  {titulo:'Estudio Suelos',codigo:'ssd',orden:12, activa: false , terminada: false},
  {titulo:'Ingenieria',codigo:'ing',orden:13, activa: false , terminada: false},
  {titulo:'Bomberos',codigo:'planos',orden:14, activa: false , terminada: false},
  {titulo:'Municipio',codigo:'permConst',orden:15, activa: false , terminada: false},
  {titulo:'Listo Construcción',codigo:'sitewalk',orden:16, activa: false , terminada: false},
  {titulo:'Construcción',codigo:'constr',orden:17, activa: false , terminada: false},
  {titulo:'Aprobación Cliente',codigo:'acepTigo',orden:18, activa: false , terminada: false},
]
const columns = [
  { col:0,     titulo: "", proceso: 'listo', width: 50, icon: true },
  {
    col:1,
    titulo: "Proceso", 
    proceso: 'proceso',
    width: 200,
  },
  {
    col:2,
    titulo: "Fecha Inicial",
    proceso: 'fechainicio',
    width: 150,
  },
  {
    col:3,
    titulo: "Fecha Final",
    proceso: 'fechafin',
    width: 150,
  }
];


let rows = [
  {id:0, step:0, proceso: 'Preparación', fechainicio: '2/13/2021', fechafin: '2/20/2021'  , listo: false},
  {id:1, step:1, proceso: 'Busqueda', fechainicio: '2/15/2021', fechafin: '3/01/2021'  , listo: false },
  {id:2, step:2, proceso: 'Validación Técnica',fechainicio: '3/10/2021', fechafin: '3/20/2021'  , listo: false },
  {id:3, step:3, proceso: 'Negociación',fechainicio: '3/13/2021', fechafin: '6/20/2021'  , listo: false },
  {id:4, step:4, proceso: 'Validación Legal',fechainicio: '4/13/2021', fechafin: '5/20/2021'  , listo: false },
  {id:5, step:5, proceso: 'Negociación',fechainicio: '5/13/2021', fechafin: '6/20/2021'  , listo: false },
]



function DetalleOTScreen(props) {
  
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const userDetallesSitio = useSelector(state => state.userDetallesSitio);
  const { detallesSitio } = userDetallesSitio;

  const userProyecto = useSelector(state => state.userProyecto);
  const { userVista, errorVista } = userProyecto;

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
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const [selectedDate, setSelectedDate] = React.useState(rows);

  const [detalleSitioInfo, setDetalleSitioInfo] = React.useState({
    alturavalidada: detallesSitio? detallesSitio.data.altura_validada : "",
    estatus:detallesSitio? detallesSitio.data.estatus : "", 
    resistenciaviento:detallesSitio? detallesSitio.data.resistencia_viento : "", 
    latitudValidada: detallesSitio? detallesSitio.data.latitud_validada : "", 
    longitudValidada: detallesSitio? detallesSitio.data.longitud_validad : "", 
    tx: detallesSitio? detallesSitio.data.tx : "", 

  });
  



  const handleChange = (event) => {
    const name = event.target.name;
    setDetalleSitioInfo({
      ...detalleSitioInfo,
      [name]: event.target.value,
    });
  };

 
  const preventDefault = (event) => {
    event.preventDefault();
    console.log(event);
    window.open("https://earth.google.com/web/@"+ detallesSitio.data.latitud_validada + "," + detallesSitio.data.longitud_validad + ', 40000d, 1y, 60t (mylocation)'  , "_blank");
  };

  


  useEffect(() => {

    
    if (!userInfo) {
      props.history.push('/login');

  } else if (!userVista) {
    props.history.push('/');

} 
  if(detallesSitio){
    setDetalleSitioInfo({
      alturavalidada: detallesSitio.data.altura_validada ,
      estatus: detallesSitio.data.estatus, 
      resistenciaviento: detallesSitio.data.resistencia_viento , 
      latitudValidada: detallesSitio.data.latitud_validada , 
      longitudValidada: detallesSitio.data.longitud_validad, 
      tx:  detallesSitio.data.tx
    });
  }
      // dispatch(userKpiList());
    return () => {
 
    };
  }, [userVista, detallesSitio]);
  
  return (<div>
     <React.Fragment>
      <CssBaseline />
      <Container width="70%">
      {userVista && userVista.data.length>0 && 
      <Typography  className={classes.title} >
        {userVista.data[0].cliente.split('_')[0] + ' '+userVista.data[0].cliente.split('_')[1]  }
      </Typography>}
         
    <Grid container marginTop className={classes.root} spacing={2}>
        <Grid item xs={12}>  

          <Paper elevation={5} className={classes.title2} >
          {detallesSitio && detallesSitio.data.codigo +"-"+ detallesSitio.data.nombre_sitio}
          </Paper>
        </Grid>


  { detallesSitio &&  <Grid item xs={12} sm={12} container>
  {/* <Paper className={classes.paperGridModal}> */}
                            <Grid container spacing={3}>
                              <Grid item xs={12} container>
                              <Grid item xs={6} sm={2}>   
                                <FormControl variant="outlined" className={classes.formControl}>
                                      <InputLabel htmlFor="outlined-age-native-simple">Estatus</InputLabel>
                                      <Select
                                        native
                                        value={detalleSitioInfo['estatus']}
                                        onChange={handleChange}
                                        label="Estatus"
                                        inputProps={{
                                          name: 'Estatus',
                                          id: 'outlined-age-native-simple',
                                        }}
                                      >
                                        <option aria-label="None" value="" />
                                        <option value={'Activo'}>Activo</option>
                                        <option value={'Suspendido'}>Suspendido</option>
                     
                                      </Select>
                                    </FormControl>
                                    </Grid>
                                <Grid item xs={3} sm={1}>                       
                                Provincia:
                                <Typography className={classes.subtitle} >
                                {detallesSitio.data.provincia}
                                </Typography>
                                </Grid>
                                <Grid item xs={3} sm={1}>   
                                Proyecto:
                                <Typography  className={classes.subtitle}>
                                {detallesSitio.data.proyecto}
                                </Typography>
                                </Grid>
                                <Grid item xs={3} sm={1}>   
                                Tipo Sitio:
                                <Typography  className={classes.subtitle}>
                                {detallesSitio.data.tipo_sitio}
                                </Typography>
                                </Grid>
                                    <Grid item xs={6} sm={3}>  
                                    <FormControl variant="outlined" className={classes.formControl}>
                                      <InputLabel htmlFor="alturavalidada">Altura Validada</InputLabel>
                                      <OutlinedInput id="alturavalidada" value={detalleSitioInfo['alturavalidada']} onChange={handleChange} label="Altura Validad" />
                                    </FormControl>
                                    </Grid>
                                      <Grid item xs={6} sm={3}>  
                                      <FormControl variant="outlined" className={classes.formControl} >
                                        <InputLabel htmlFor="resistenciaviento"> Resistencia Viento</InputLabel>
                                        <OutlinedInput id="resistenciaviento" value={detalleSitioInfo['resistenciaviento']} onChange={handleChange} label="Resistencia Viento" />
                                      </FormControl>
                                      </Grid>
                                      <Grid item xs={6} sm={3}>  
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="tx">Tipo Transmisión</InputLabel>
                                        <OutlinedInput id="tx" value={detalleSitioInfo['tx']} onChange={handleChange} label="Tipo Transmisión" />
                                      </FormControl>
                                      </Grid>
                                      <Grid item xs={6} sm={3}>  
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="Opción">Latitud Validada</InputLabel>
                                        <OutlinedInput id="latitudValidada" value={detalleSitioInfo['latitudValidada']} onChange={handleChange} label="Opción" />
                                      </FormControl>
                                      </Grid>
                                      <Grid item xs={6} sm={3}>  
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="latitudValidada">Latitud Validada</InputLabel>
                                        <OutlinedInput id="latitudValidada" value={detalleSitioInfo['latitudValidada']} onChange={handleChange} label="Latitud Validada" />
                                      </FormControl>
                                      </Grid>
                                      <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="longitudValidada"> Longitud Validada</InputLabel>
                                        <OutlinedInput id="longitudValidada" value={detalleSitioInfo['longitudValidada']} onChange={handleChange} label="Longitud Validada" />
                                      </FormControl>
                                      </Grid>
                                      <Grid item xs={12} sm={6}> 
                                      <Link href="#" onClick={preventDefault} styles={{textAlign:"center"}}>
                                        Google Earth: {detallesSitio.data.latitud_validada} {' '} {detallesSitio.data.longitud_validad} 
                                      </Link>
                                      </Grid>
                                  </Grid>
                                 
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
                                        <InputLabel htmlFor="opcion">Opción</InputLabel>
                                        <OutlinedInput id="opcion" value={detalleSitioInfo['opcion']} onChange={handleChange} label="Opción" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="area">Área Rentada</InputLabel>
                                        <OutlinedInput id="area" value={detalleSitioInfo['area']} onChange={handleChange} label="Área Rentada" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="largo">Largo</InputLabel>
                                        <OutlinedInput id="largo" value={detalleSitioInfo['largo']} onChange={handleChange} label="Largo" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="ancho">Ancho</InputLabel>
                                        <OutlinedInput id="ancho" value={detalleSitioInfo['ancho']} onChange={handleChange} label="Ancho" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="renta"> Renta</InputLabel>
                                        <OutlinedInput id="renta" value={detalleSitioInfo['renta']} onChange={handleChange} label="Renta" />
                                      </FormControl>
                              </Grid>
                             
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="propietario">Propietario</InputLabel>
                                        <OutlinedInput id="propietario" value={detalleSitioInfo['propietario']} onChange={handleChange} label="Propietario" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="identificacion">Identificación</InputLabel>
                                        <OutlinedInput id="identificacion" value={detalleSitioInfo['identificacion']} onChange={handleChange} label="Identificación" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="contacto">Datos de Contacto</InputLabel>
                                        <OutlinedInput id="contacto" value={detalleSitioInfo['contacto']} onChange={handleChange} label="Datos de Contacto" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="datosFinca">Datos de la Finca</InputLabel>
                                        <OutlinedInput id="datosFinca" value={detalleSitioInfo['datosFinca']} onChange={handleChange} label="Datos de la Finca" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="direccionFinca">Direccion de la Finca</InputLabel>
                                        <OutlinedInput id="direccionFinca" value={detalleSitioInfo['direccionFinca']} onChange={handleChange} label="Direccion de la Finca" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={6} sm={3}> 
                                      <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="renta">Renta</InputLabel>
                                        <OutlinedInput id="renta" value={detalleSitioInfo['renta']} onChange={handleChange} label="Renta" />
                                      </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={12} className={classes.multitexto}> 
                       
                              <TextField
                                  id="derechoPaso"
                                  label="Información Derecho de Paso"
                                  multiline
                                  rows={4}
                                  defaultValue="describa el Derecho de paso..."
                                  variant="outlined"
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} className={classes.multitexto}> 

                              <TextField
                                  id="electricidad"
                                  label="Información Energia Eléctrica"
                                  multiline
                                  rows={4}
                                  defaultValue="Datos de la electricidad del sitio..."
                                  variant="outlined"
                                  fullWidth
                                  
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} className={classes.multitexto}> 

                              <TextField
                                  id="observaciones"
                                  label="Observaciones del Sitio"
                                  multiline
                                  rows={4}
                                  defaultValue="Observaciones del sitio..."
                                  variant="outlined"
                                  fullWidth
                                  
                                />
                              </Grid>
                              </Grid>}
                            </Grid>
                            </Grid>
                            <Grid  container>

                           
                            <Grid item xs={12} sm={12} >
                             <FormControlLabel
                                control={
                                  <Switch
                                    checked={state.checkedProcesos}
                                    onChange={handleChangeSwitch}
                                    name="checkedProcesos"
                                    color="primary"
                                  />
                                }
                                label="Detalle Procesos"
                              />
                            </Grid>
                            
                            </Grid>
                            <Grid item xs={12} sm={12}  >
                           
                            {state.checkedProcesos &&<Grid item xs={12} sm={12}>

                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table">
                                  <TableHead>
                                    <TableRow >
                                      {columns.map((col) => 
                                          <TableCell key={col.field} width={col.width} component="th" scope="row">
                                          {col.icon &&  <EditAttributesIcon fontSize='large' style={{color: edit?'green': 'blue'}} onClick={()=>setEdit(!edit)}/>} {col.titulo}
                                          </TableCell>)}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {rows.map((row) => (
                                          <TableRow key={row.id}>
                                          {columns.map((col) => (
                                              <TableCell width={col.width}>   
                                              <Grid container alignItems="left">
                                             
                                                {edit && (col.col!==0 || col.col!==1) ? <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                          <Grid container justify="space-around" >
                                                            <KeyboardDatePicker
                                                              margin="normal"
                                                              id={"input"+row.id+col.col}
                                                              label={row[col.titulo]}
                                                              format="MM/dd/yyyy"
                                                              value={(selectedDate[col.proceso])} 
                                                              // onChange={handleDateChange}
                                                              onChange={(date)=> setSelectedDate({
                                                                            ...setSelectedDate,
                                                                            [col.proceso]: date,
                                                                          })}
                                                              KeyboardButtonProps={{
                                                                'aria-label': 'change date',
                                                              }}
                                                            />
                                                          </Grid>
                                                        </MuiPickersUtilsProvider> 
                                                :   (col.col===0 ?   
                                                  <Grid item xs={4} sm={4}  >
                                                <FormControlLabel
                                                  control={<GreenCheckbox checked={row.listo} onChange={handleChange} name="checkedG" />}
                                                  label="Listo" 
                                                /> </Grid> :"" )  }
                                                </Grid>
                                                <Grid item xs={8} sm={8}  >
                                              {row[col.proceso]}
                                              </Grid>
                                              </TableCell> ))}
                                          </TableRow>))}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Grid>}
                            </Grid>
                  
                          </Container>
    </React.Fragment>
  </div>
    )

}
export default DetalleOTScreen;


