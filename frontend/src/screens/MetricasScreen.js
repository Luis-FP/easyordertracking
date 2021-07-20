import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usersOTs } from "../actions/userActions";


import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import SettingsIcon from '@material-ui/icons/Settings';
// import BeenhereIcon from '@material-ui/icons/Beenhere';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

import Container from '@material-ui/core/Container';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
// import blue from '@material-ui/core/colors/blue';
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
// import DirectionsIcon from '@material-ui/icons/Directions';
// import { set } from 'js-cookie';
// import useChartConfig from 'hooks/useChartConfig'
// import Box from 'components/Box'
// import SyntaxHighlighter from 'components/SyntaxHighlighter'
// import { Chart } from 'react-charts'

const purple3 = purple[300]
const naranja7 = orange[700]
const verdefondo = green[500]
// const azulfondo = blue[900]
// const azulClaro = blue[300]
const rojoFondo = red[700]
const greyfondo = grey[300]
const greyfondo2 = grey[400]

let sourceCode



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



function MetricasScreen(props) {
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
  const { loadingOTs, userOTsInfo } = userOTS;
  
console.log(userOTsInfo)
  // const [openModal, setOpenModal] = React.useState(false);
  // const [sitio, setSitio] = React.useState([]);
  const [updated, setUpdated] = useState(false);
console.log('updated', updated)
  const handleOpenDetalle = (e) => {
    console.log(e.currentTarget.getAttribute('codigo') )
    console.log(e.currentTarget.getAttribute('nombre') )
    setUpdated(false)
    props.history.push(
      "/detalleOT/?codigo=" +
      e.currentTarget.getAttribute('codigo') +
      "&ot_number=" +
      e.currentTarget.getAttribute('ot_number')
    );

  };

  // const handleCloseModal = (e) => {
  //   console.log(e.target)
  //   setOpenModal(false);
  //   setSitio(sitio)
  //   // console.log(sitio, sitio)
  // };


  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      props.history.push('/login');
  } 
  if(!updated){
    // dispatch(usersOTs());
    setUpdated(true)
  }
    return () => {
 
    };
  }, [loadingOTs, updated]);

  const [state, setState] = React.useState({
    checkedA: false,

  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const [busquedaKey1, setBusquedaKey1] = React.useState(null);
  const [busquedaKey2, setBusquedaKey2] = React.useState(null);
  const [busquedaKey3, setBusquedaKey3] = React.useState(null);
  const busquedaNombre = (e) =>{
    const valueLowerCase = e.target.value!==null? (e.target.value).toLowerCase() :""
    setBusquedaKey1(valueLowerCase)
  }
  const busquedaFecha = (e) =>{
    const valueLowerCase = e.target.value!==null? (e.target.value).toLowerCase() :""
    setBusquedaKey2(valueLowerCase)
  }
  const busquedaProyecto = (e) =>{
    const valueLowerCase = e.target.value!==null? (e.target.value).toLowerCase() :""
    setBusquedaKey3(valueLowerCase)
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

//   const { data, randomizeData } = useChartConfig({
//     series: 8,
//     datums: 3,
//     dataType: 'ordinal'
//   })
//   const series = React.useMemo(
//     () => ({
//       type: 'bar'
//     }),
//     []
//   )
//   const axes = React.useMemo(
//     () => [
//       { primary: true, type: 'ordinal', position: 'bottom' },
//       { position: 'left', type: 'linear', stacked: false }
//     ],
//     []
//   )

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
      {/* <>
      <button onClick={randomizeData}>Randomize Data</button>
      <br />
      <br />
      <Box>
        <Chart data={data} series={series} axes={axes} tooltip />
      </Box>
      <br />
      <SyntaxHighlighter code={sourceCode} />
    </> */}
    </Container>
    </React.Fragment>
  );

}
export default MetricasScreen;


