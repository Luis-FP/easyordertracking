import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { buscarDetallesSitio, usersOTs } from "../actions/userActions";


import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import SettingsIcon from '@material-ui/icons/Settings';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

import Container from '@material-ui/core/Container';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import Tooltip from '@material-ui/core/Tooltip';
import { fechaUnica } from '../components/fechas';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { orange } from '@material-ui/core/colors';


import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import { set } from 'js-cookie';


const purple3 = purple[300]
const naranja7 = orange[700]
const verdefondo = green[500]
const azulfondo = blue[900]
const azulClaro = blue[300]
const rojoFondo = red[700]
const greyfondo = grey[300]
const greyfondo2 = grey[400]





const useStyles = makeStyles((theme)=>({
  root: {
    minWidth: 275,
    backgroundColor: theme.palette.primary.light,
  },

  title: {
    fontSize: 25,
    color: 'black',
    textTransform: 'capitalize',
    textAlign:'center'
  },
  title2: {
    fontSize: 35,
    color: 'green',
    textTransform: 'capitalize',
    textAlign:'center'
  },
  chip: {
    // display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
      padding: 0.5,
    },
  },
  chip2: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    
    '& > *': {
      margin: theme.spacing(0.5),
      
    },
  },
  badge: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  grid: {
    flexGrow: 1,
    color: 'blue',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: 'white',
    backgroundColor: greyfondo,
    
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperModal: {
    width:700,
    height:500,
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #cfd8dc',
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  rootModal: {
    flexGrow: 1,
  },
  paperGridModal: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  root2: {

    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 500,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));



function HomeScreen(props) {
  const classes = useStyles();
  
  let procesos = [
    {_id:"p1", titulo:'Solicitudes Nuevas', codigo:'ini', paso:0},
    {_id:"p2",titulo:'Revision con Cliente y Programación', codigo:'rev', paso:1},
    {_id:"p3",titulo:'En Ejecución', codigo:'ejec', paso:2},
    {_id:"p4",titulo:'Revisión de Calidad', codigo:'qa', paso:3},
    {_id:"p5",titulo:'Finalizado Entregado', codigo:'entregado', paso:4},
    {_id:"p6",titulo:'Aprobado por Cliente', codigo:'aprobado', paso:5},
    {_id:"p7",titulo:'Facturación', codigo:'facturacion', paso:6},
    {_id:"p8",titulo:'pagado', codigo:'pagado', paso:7},
  ]

  let today = new Date().getTime();
  let tiempos = [
    {_id:"f1", titulo: fechaUnica(today - 5 * 86400000  ), codigo: new Date(today - 5 * 86400000), paso:0},
    {_id:"f2", titulo: fechaUnica(today - 4 * 86400000  ), codigo: new Date(today - 4 * 86400000), paso:1},
    {_id:"f3",titulo: fechaUnica(today - 3 * 86400000  ), codigo: new Date(today - 3 * 86400000), paso:2},
    {_id:"f4",titulo: fechaUnica(today - 2 * 86400000  ), codigo: new Date(today - 2 * 86400000), paso:3},
    {_id:"f5",titulo: fechaUnica(today - 1 * 86400000  ), codigo: new Date(today - 1 * 86400000), paso:4},
    {_id:"f6",titulo: fechaUnica(today - 0 * 86400000  ), codigo: new Date(today - 0 * 86400000), paso:5},
    {_id:"f7",titulo: fechaUnica(today+ 1 * 86400000  ), codigo: new Date(today + 1 * 86400000), paso:6},
    {_id:"f8",titulo: fechaUnica(today+ 2 * 86400000  ), codigo: new Date(today + 2 * 86400000), paso:7},
    {_id:"f9",titulo: fechaUnica(today+ 3 * 86400000  ), codigo: new Date(today + 3 * 86400000), paso:8},
    {_id:"f10",titulo: fechaUnica(today+ 4 * 86400000  ), codigo: new Date(today + 4 * 86400000), paso:9},
    {_id:"f11",titulo: fechaUnica(today+ 5 * 86400000  ), codigo: new Date(today + 5 * 86400000), paso:10},

  ]

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  console.log("userInfo", userInfo);



  const userOTS = useSelector(state => state.userOTS);
  const { loadingOTs, userOTsInfo, errorOTS } = userOTS;
  
console.log(userOTsInfo)
  const [openModal, setOpenModal] = React.useState(false);
  const [sitio, setSitio] = React.useState([]);
  const [updated, setUpdated] = useState(false);

  const handleOpenDetalle = (e) => {
    
    console.log(e.currentTarget.getAttribute('codigo') )
    console.log(e.currentTarget.getAttribute('nombre') )
    const sitioBuscar={
      cliente: e.currentTarget.getAttribute('cliente'),
      codigo: e.currentTarget.getAttribute('codigo'),
      ot_number: e.currentTarget.getAttribute('ot_number')
    }
    console.log("Sitio a Buscar",sitioBuscar)
    // dispatch(buscarDetallesSitio(sitioBuscar))
    props.history.push(
      "/detalleOT/?codigo=" +
      e.currentTarget.getAttribute('codigo') +
      "&ot_number=" +
      e.currentTarget.getAttribute('ot_number')
    );

  };

  const handleCloseModal = (e) => {
    console.log(e.target)
    setOpenModal(false);
    setSitio(sitio)
    // console.log(sitio, sitio)
  };


  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      props.history.push('/login');
  } 
  if(!updated){
    dispatch(usersOTs());
    setUpdated(true)
  }
    return () => {
 
    };
  }, [loadingOTs]);

  const [state, setState] = React.useState({
    checkedA: false,

  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const [busquedaKey1, setBusquedaKey1] = React.useState(null);
  const [busquedaKey2, setBusquedaKey2] = React.useState(null);
  const busquedaNombre = (e) =>{
    const valueLowerCase = e.target.value!==null? (e.target.value).toLowerCase() :""
    setBusquedaKey1(valueLowerCase)
  }
  const busquedaFecha = (e) =>{
    const valueLowerCase = e.target.value!==null? (e.target.value).toLowerCase() :""
    setBusquedaKey2(valueLowerCase)
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

  return (

    <React.Fragment>
    <CssBaseline />
    <Container width="60%" style={{alignItems:'center'}}>
    <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
        <Grid>Procesos</Grid>
          <Grid item>
    <FormControlLabel
        control={<Switch checked={state.checkedA} onChange={handleChange}  color="primary" name="checkedA" />}
      />
      </Grid>
      <Grid item >Tiempos</Grid>
      <Paper component="form" className={classes.root2}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Coloque Nombre"
        inputProps={{ 'aria-label': 'Buscar' }}
        onChange={busquedaNombre}
      />
       <InputBase
        className={classes.input}
        placeholder="Coloque Fecha"
        inputProps={{ 'aria-label': 'Buscar' }}
        onChange={busquedaFecha}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />

    </Paper>
      </Grid>
      </Typography>
    <div>
    <Grid container spacing={3} className={classes.grid} >
        {!state['checkedA'] && procesos
        .map((fase) => (

            <Grid 
            key={'grid'+fase.codigo}
           
             item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <div className={classes.badge}>
              <Badge badgeContent={
                 userOTsInfo && userOTsInfo.data && userOTsInfo.data.filter((ot, index)=> ot.estado === fase.codigo).length 
              }  style={{ color: rojoFondo }} >
                <SettingsIcon />
              </Badge>
            </div>
            <Typography className={classes.title}>{fase.titulo}</Typography>
             
            {userOTsInfo && userOTsInfo.data && userOTsInfo.data.map((ot, index)=> ot.estado === fase.codigo &&
            // criterio busqueda
            !(busquedaKey1 !== null && !ot.sitio_nombre.toLowerCase().includes(busquedaKey1)) &&
            !(busquedaKey2 !== null && !ot.fecha_requerida.toLowerCase().includes(busquedaKey2)) &&
             (
              <Tooltip key={'chip'+ot._id} title={ot.sitio_nombre + " " + fechaUnica(ot.fecha_requerida)}  arrow>
              
              <Chip
              
              className="handle"
              // fontSize="large"
              className={classes.chip}
              codigo={ot.sitio_codigo}
              id={ot.id}
              nombre={ot.sitio_nombre}
              cliente={ot.cliente}
              ot_number={ot.ot_number}
              avatar={<Avatar style={{ backgroundColor: 'white', color: 'black'}}>{ot.ot_number}</Avatar>}
              label={ot.requerimiento +" - " +ot.proyecto}
              clickable={true}
              style={ {backgroundColor: colorAlerta(ot.prioridad)} }
    
              onClick={(e)=>handleOpenDetalle(e)}
            /></Tooltip>)
       
            )}
       
            {/* <div className={classes.badge}>
              <Badge badgeContent={10} style={{ color: 'red' }}>
                <BeenhereIcon fontSize="large"  style={{ color: 'green' }}/>
              </Badge>
            </div> */}
          </Paper>

        </Grid>))}

        {state['checkedA'] && tiempos
        .map((fase) => userOTsInfo && userOTsInfo.data && userOTsInfo.data.filter((ot, index)=> fechaUnica(ot.fecha_requerida) === fechaUnica(fase.codigo)).length > 0 &&( 

            <Grid 
            key={'grid'+fase.codigo}
           
             item xs={12} sm={12}>
          <Paper className={classes.paper} style={{ backgroundColor: fechaUnica(fase.titulo) === fechaUnica(new Date()) ? greyfondo2 :greyfondo}}>
            <div className={classes.badge}>
  
              <Badge badgeContent={
                userOTsInfo && userOTsInfo.data && userOTsInfo.data.filter((ot, index)=> fechaUnica(ot.fecha_requerida) === fechaUnica(fase.codigo)).length 
              }  style={{ color:  naranja7 }} >
                <SettingsIcon />
              </Badge>
            </div>
            <Typography className={classes.title}  >{fase.titulo}</Typography>
               
            {userOTsInfo && userOTsInfo.data && userOTsInfo.data.map((ot, index)=> fechaUnica(ot.fecha_requerida) === fechaUnica(fase.codigo) && 
              !(busquedaKey1 !== null && !ot.sitio_nombre.toLowerCase().includes(busquedaKey1)) &&
              !(busquedaKey2 !== null && !ot.fecha_requerida.toLowerCase().includes(busquedaKey2)) &&
             (
              <Tooltip key={'chip'+ot._id} title={ot.sitio_nombre + " " + fechaUnica(ot.fecha_requerida)}  arrow>
              <Chip
              
              className="handle"
              // fontSize="large"
              className={classes.chip}
              codigo={ot.sitio_codigo}
              id={ot.id}
              nombre={ot.sitio_nombre}
              cliente={ot.cliente}
              ot_number={ot.ot_number}
              avatar={<Avatar style={{ backgroundColor: 'white', color: 'black'}}>{ot.ot_number}</Avatar>}
              label={ot.requerimiento +" - " +ot.proyecto}
              clickable={true}
              // style={ {backgroundColor: ot.prioridad === 'Alta'? rojoFondo : verdefondo} }
              style={ {backgroundColor: colorAlerta(ot.prioridad)} }
    
              onClick={(e)=>handleOpenDetalle(e)}
            /></Tooltip>)
       
            )}
       
            {/* <div className={classes.badge}>
              <Badge badgeContent={10} style={{ color: 'red' }}>
                <BeenhereIcon fontSize="large"  style={{ color: 'green' }}/>
              </Badge>
            </div> */}
          </Paper>

        </Grid>))}

        </Grid>
    </div>
    </Container>
    </React.Fragment>
  );

}
export default HomeScreen;


