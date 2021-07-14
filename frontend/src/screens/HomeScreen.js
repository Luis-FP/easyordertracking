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
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import Tooltip from '@material-ui/core/Tooltip';
import { fechaUnica } from '../components/fechas';



const verdefondo = green[900]
const azulfondo = blue[900]
const rojoFondo = red[900]
const greyfondo = grey[300]





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
}));



function HomeScreen(props) {
  const classes = useStyles();
  
  let procesos = [
    {_id:"p1", titulo:'Solicitudes Nuevas', codigo:'ini', paso:0},
    {_id:"p2",titulo:'Programación y Asignación', codigo:'plan', paso:1},
    {_id:"p3",titulo:'Revision con Cliente', codigo:'rev', paso:2},
    {_id:"p4",titulo:'En Ejecución', codigo:'ejec', paso:3},
    {_id:"p5",titulo:'Revisión de Calidad', codigo:'qa', paso:4},
    {_id:"p6",titulo:'Finalizado Entregado', codigo:'entregado', paso:5},
    {_id:"p7",titulo:'Aprobado por Cliente', codigo:'aprobado', paso:6},
    {_id:"p8",titulo:'Facturación', codigo:'facturacion', paso:7},
    {_id:"p9",titulo:'pagado', codigo:'pagado', paso:8},
  ]

  let today = new Date().getTime();
  let fechasVisibles = [
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
  const { userOTsInfo, errorOTS } = userOTS;
  
console.log(userOTsInfo)
  const [openModal, setOpenModal] = React.useState(false);
  const [sitio, setSitio] = React.useState([]);
  const [ot, setOt] = useState();

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
      dispatch(usersOTs());
    return () => {
 
    };
  }, []);
 

  return (

    <React.Fragment>
    <CssBaseline />
    <Container width="60%">
    <div>
    <Grid container spacing={3} className={classes.grid} >
        {procesos
        .map((fase) => (

            <Grid 
            key={'grid'+fase.codigo}
           
             item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <div className={classes.badge}>
              <Badge badgeContent={4}  style={{ color: 'black' }} >
                <SettingsIcon />
              </Badge>
            </div>
            <Typography className={classes.title}>{fase.titulo}</Typography>
               
            {userOTsInfo && userOTsInfo.data && userOTsInfo.data.map((ot, index)=> ot.estado === fase.codigo && (

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
              style={ {backgroundColor: ot.prioridad === 'Alta'? 'red': 'green'} }
    
              onClick={(e)=>handleOpenDetalle(e)}
            /></Tooltip>)
       
            )}
       
            <div className={classes.badge}>
              <Badge badgeContent={10} style={{ color: 'red' }}>
                <BeenhereIcon fontSize="large"  style={{ color: 'green' }}/>
              </Badge>
            </div>
          </Paper>

        </Grid>))}
        </Grid>
    </div>
    </Container>
    </React.Fragment>
  );

}
export default HomeScreen;


