
import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {  logout , reporteOTs} from "../actions/userActions";

import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TimelineIcon from '@material-ui/icons/Timeline';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LabelIcon from '@material-ui/icons/Label';
import PrintIcon from '@material-ui/icons/Print';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme)=>({
  root: {
    flexGrow: 1,
    color:'#01579b',
  },
  root2: {
    flexGrow: 1,
    
  },
  menuButton: {
    marginRight: theme.spacing(2),
    fontSize: 15
  },
  barra:{
    background: 'white',
    border: 0,
    borderRadius: 3,
    boxShadow: 'blue',
    // color: '#01579b',
  },
  title: {
    flexGrow: 1,
    color: '#01579b',
    fontSize: 15
  },
  texto:{
    background: 'white',
    border: 0,
    borderRadius: 3,
    color: '#01579b',
  }
}));


function NavBarStore(props){


  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const userSignin = useSelector(state => state.userSignin );
  const  { userInfo, salida } = userSignin;
  const userDetallesSitio = useSelector(state => state.userDetallesSitio);
  const { detallesSitio } = userDetallesSitio;
  const dispatch = useDispatch();
  const history = useHistory();
console.log(props)

  useEffect(() => {
    console.log("userEffect")
  
    if (!userInfo ) {
      history.push("/login");
  } 
    return () => {
      //
    };
  }, [salida, detallesSitio]);

      
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (e) => {
      e.preventDefault()
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleSalir = () => {
      setOpen(false);
      dispatch(logout()).then(
        (data) => {
          if ( data && data.error === false) {
            history.push("/login");
            alert("Ha salido exitosamente!")
          } else {
            console.log("error", data)
            alert("Hubo un error de conexion al salir. Porfavor intentar en otra conexion.")
  
          }
  
        }
      );
    };

    const handleReporte = async () =>{
      console.log('ir a reporte')

      let values = await dispatch(reporteOTs());
      if (values && !values.error) {
        // handleOpen()
      }
    }
     
    return (  <div><div className={classes.root2}>
      <AppBar position="static" className={classes.barra}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton}  aria-label="menu">
          <img  src="geminatech.png" />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {userInfo && userInfo.nombre}
          </Typography>
          { userInfo && 
          <IconButton color="secondary" aria-label="salir" onClick={handleClickOpen}>
            <ExitToAppIcon fontSize="large" />
          </IconButton>}
        </Toolbar>
      </AppBar>
      </div>
      <BottomNavigation
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
                console.log('newValue', newValue)
              }}
              showLabels
              className={classes.root}
            >      
              <BottomNavigationAction label="Estatus OTs" icon={<LabelIcon fontSize="large"/>} href={'/'} />
              {userInfo && (userInfo.isHiper || userInfo.isSuper || userInfo.isUser) && 
              <BottomNavigationAction label="Crear Sitios/OTs" icon={<RoomServiceIcon fontSize="large"/>} href={'/crearOT'}/>}
              {userInfo && (userInfo.isHiper ) &&
              <BottomNavigationAction label="Usuarios" icon={<PersonAddIcon fontSize="large" />} href={'/register'}/>}
              {userInfo && (userInfo.isHiper || userInfo.isSuper) &&
              <BottomNavigationAction label="Métricas" icon={<TimelineIcon fontSize="large"   />}  href={'/metricas'} />}
              {userInfo && (userInfo.isHiper || userInfo.isSuper) &&
              <BottomNavigationAction label="Reporte" icon={<PrintIcon fontSize="large"   />}  onClick={handleReporte} />}
          </BottomNavigation>
          <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title" className="contenido-azul-NAD" >{"Seguro quiere Salir"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description" className="contenido-verde-NAD">
                  Usted esta saliendo del sistema
          </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  No Salir
          </Button>
                <Button onClick={handleSalir} color="primary">
                  Salir
                </Button>
              </DialogActions>
            </Dialog>
    </div>
    );
 
}
export default NavBarStore;