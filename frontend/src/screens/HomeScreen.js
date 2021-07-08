import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { buscarDetallesSitio, usersOTs } from "../actions/userActions";
import { Gauge } from '../components/ReactGauge';
import { queFecha, horaLocal, fechaActual, fechaUnica } from '../components/fechas';
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
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ButtonBase from '@material-ui/core/ButtonBase';
import Container from '@material-ui/core/Container';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const azulfondo = blue[900]
const rojoFondo = red[900]

let initialOT =[
  {id: '1', numOt: "12", ot:"Planos para Permisos", sitio: "Divala", cliente: "OFG-Panama", usuarioCliente:"Aneleys", estado:"ejec", prioridad: 'normal'},
  {id: '2', numOt: "67", ot:"Diseño de Cimentación", sitio: "Paso Canoa", cliente: "OFG-Panama", usuarioCliente:"Aneleys", estado:"plan", prioridad: 'alta'},
  {id: '3',  numOt: "3",ot:"Planos para Bomberos", sitio: "Divala", cliente: "OFG-Panama", usuarioCliente:"Aneleys", estado:"ini", prioridad: 'normal'},
  {id: '4', numOt: "222",ot:"Planos para Construcción", sitio: "Paso Canoa", cliente: "OFG-Panama", usuarioCliente:"Aneleys", estado:"entregado", prioridad: 'alta'},
  {id: '5',  numOt: "22",ot:"Planos para Permisos", sitio: "Ola Cabecera", cliente: "OFG-Panama", usuarioCliente:"Aneleys", estado:"ejec", prioridad: 'normal'},
]



const useStyles = makeStyles((theme)=>({
  root: {
    minWidth: 275,
    backgroundColor: theme.palette.primary.light,
  },

  title: {
    fontSize: 25,
    color: 'white',
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
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  chip2: {
    justifyContent: 'center',
    margin: theme.spacing(0.3),
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
    backgroundColor: azulfondo,
    
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
  
  let procesos =[
    {_id:"p1", titulo:'Solicitudes Nuevas', codigo:'ini', paso:0},
    {_id:"p2",titulo:'Programación y Asignación', codigo:'plan', paso:1},
    {_id:"p3",titulo:'En Ejecución', codigo:'ejec', paso:2},
    {_id:"p4",titulo:'Revisión de Calidad', codigo:'qa', paso:3},
    {_id:"p5",titulo:'Finalizado Entregado', codigo:'entregado', paso:4},
    {_id:"p6",titulo:'Aprobado por Cliente', codigo:'aprobado', paso:5},
    {_id:"p7",titulo:'Facturación', codigo:'facturacion', paso:6},
    {_id:"p8",titulo:'pagado', codigo:'pagado', paso:7},
  ]



  const [openModal, setOpenModal] = React.useState(false);
  const [sitio, setSitio] = React.useState([]);
  const [ot, setOt] = useState(initialOT);

  const handleOpenDetalle = (e) => {
    
    console.log(e.currentTarget.getAttribute('codigo') )
    console.log(e.currentTarget.getAttribute('nombre') )
    const sitio={
      cliente: e.currentTarget.getAttribute('cliente'),
      codigo: e.currentTarget.getAttribute('codigo')
    }
    // console.log(sitio)
    // dispatch(buscarDetallesSitio(sitio))
    props.history.push('/detalleOT');
    // setOpenModal(true);
  };

  const handleCloseModal = (e) => {
    console.log(e.target)
    setOpenModal(false);
    setSitio(sitio)
    // console.log(sitio, sitio)
  };




  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  console.log("userInfo", userInfo);



  const userOTS = useSelector(state => state.userOTS);
  const { userOTsInfo, errorOTS } = userOTS;
  
console.log(userOTsInfo)

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
    <DragDropContext onDragEnd={(result)=> {
      const {source, destination} = result;
      if(!destination){
        return;
      }
      if(source.index === destination.index
      && source.droppableId=== destination.droppableId ){
        return;
      }
      console.log('source.index, destination.index, ot[source.index], procesos[destination.index]', source.index, destination.index, ot[source.index], procesos[destination.index])
      const valorNuevo = procesos[destination.index].paso
      // const fuente = {...ot[source.index], [ot[source.index].estado] : valorNuevo}
      // setOt({...ot, fuente})
      console.log("ot", ot);
    }}>
    <React.Fragment>
    <CssBaseline />
    <Container width="60%">


    <div >
   
    <Grid container spacing={3} className={classes.grid} >
        {procesos
        .map((fase) => (
          <Droppable droppableId={fase._id} key={'grid'+fase.codigo}>
          {(droppableProvided) => (
            <Grid 
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
             item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <div className={classes.badge}>
              <Badge badgeContent={4}  style={{ color: 'white' }} >
                <SettingsIcon />
              </Badge>
            </div>
            <Typography className={classes.title}>{fase.titulo}</Typography>
               
            
            {userOTsInfo && userOTsInfo.data && userOTsInfo.data.map((ot, index)=> ot.estado === fase.codigo && (
            <Draggable key={'chip'+ot._id} draggableId={ot._id} index={index}>
            { (draggableProvided) => ( 
              <Chip
              {...draggableProvided.draggableProps}
              ref={draggableProvided.innerRef}
              {...draggableProvided.dragHandleProps}
              className="handle"
              
              className={classes.chip2}
              codigo={ot.sitio_codigo}
              id={ot.id}
              nombre={ot.sitio_nombre}
              cliente={ot.cliente}
              avatar={<Avatar style={{ backgroundColor: 'white', color: 'black'}}>{ot.ot_number}</Avatar>}
              label={ot.requerimiento +" - "+ ot.sitio_codigo +" - "+ ot.sitio_nombre + " - " +ot.proyecto}
              clickable={true}
              style={ {backgroundColor: ot.prioridad === 'alta'? 'red': 'green'} }
    
              onClick={(e)=>handleOpenDetalle(e)}
            />)}
            </Draggable>
            ))}
       
            <div className={classes.badge}>
              <Badge badgeContent={10} style={{ color: 'red' }}>
                <BeenhereIcon fontSize="large"  style={{ color: 'green' }}/>
              </Badge>
            </div>
          </Paper>
          {droppableProvided.placeholder}
        </Grid>)}
        </Droppable>
        ))}
        </Grid>
    </div>
    </Container>
    </React.Fragment>
    </DragDropContext>
  );

}
export default HomeScreen;


