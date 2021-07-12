import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import GroupIcon from '@material-ui/icons/Group';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TimelineIcon from '@material-ui/icons/Timeline';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import LabelIcon from '@material-ui/icons/Label';
import { proyectoVisualizado } from "../actions/userActions";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    color:'#01579b',
  },
});

const useStyles2 = makeStyles((theme) => ({
  root: {
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

  // const proyectoVisualizado = useSelector(state => state.proyectoVisualizado);
  // const {  } = proyectoVisualizado;

  const classes = useStyles();
  const classes2 = useStyles2();
  const [value, setValue] = React.useState(0);
  const [proyecto, setProyecto] = React.useState(null);
  const userSignin = useSelector(state => state.userSignin );
  const  { userInfo} = userSignin;
   
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();

const handleChoose = (e) => {
   setProyecto( e.target.getAttribute("info_menu"))
   setAnchorEl(null);
  //  dispatch(proyectoVisualizado( {cliente: e.target.getAttribute("info_menu")}))
}


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

    useEffect(() => {
      // dispatch(proyectoVisualizado( {cliente:'tigo_panama'}))
          console.log('proyecto', proyecto)
    }, []);

    
    return (  <div><div className={classes2.root}>
      <AppBar position="static" className={classes2.barra}>
        <Toolbar>
          <IconButton edge="start" className={classes2.menuButton}  aria-label="menu">
          <img  src="logo2.png" />
          </IconButton>
          <Typography variant="h6" className={classes2.title}>
            {userInfo && userInfo.nombre}
          </Typography>
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
              {userInfo && (userInfo.isHiper || userInfo.isSuper) && 
              <BottomNavigationAction label="Crear Sitios/OTs" icon={<RoomServiceIcon fontSize="large"/>} href={'/crearOT'}/>}
              {userInfo && (userInfo.isHiper || userInfo.isSuper)}
              <BottomNavigationAction label="Métricas" icon={<TimelineIcon fontSize="large"/>} />
             
          </BottomNavigation>
    </div>
    );
    
//     <div >
    
//     <div className="w3-hide-medium w3-hide-large w3-display-topleft" >
//       <img  src="logo.png" className="logo w3-left"/>
//     </div>
//     <div className="w3-bar w3-top menuSuperior  w3-card-4 w3-white w3-hide-small">
//         <img  src="logo.png" className="logo w3-left"/>
//       <div className="containerSuperior">
//           {/* <Link to={"/"} className="w3-bar-item"><i className="material-icons letraMenuSuperior">home</i></Link> */}
//           <Link to={"/"} className="w3-bar-item"> <HomeWorkIcon className="contenido-azul-NAD letraMenuSuperior"/></Link>
//           <Link to={"/calendar"} className="w3-bar-item "><CalendarTodayIcon className="letraMenuSuperior"/></Link>
//           <Link to={"/acceso"} className="w3-bar-item "><FingerprintIcon className="w3-text-pink  letraMenuSuperior"/></Link>
//           {userInfo&& userInfo.isSuper &&
//           <Link to={"/grupo"} className="w3-bar-item "><GroupIcon className="w3-text-orange letraMenuSuperior"/></Link>
//           }
//           <Link to={"/logout"} className="w3-bar-item "><DirectionsRunIcon className="letraMenuSuperior"/></Link>
//           <Link to={"#"} className="w3-bar-item "
//           onClick={openMenu}
//           >
//           <MenuIcon className="letraMenuSuperior"/>
//           </Link>
//         </div>
//     </div>
//   <div onMouseLeave={closeMenu}>
    
   
//      <div id="barraLateral" className=" w3-mobile w3-sidebar w3-bar-block  w3-border-right" 
//           style={{display:"none"}}
 
//           // onClick={closeMenu}
//            >

//         {/* <Link className="w3-bar-item w3-button w3-text-large" to={'/pendientes'}
//         onClick={closeMenu}
//         >Pendientes</Link>
//         <Link className="w3-bar-item w3-button" to={'/grupo'}
//         onClick={closeMenu}
//         >Grupo</Link> */}
//         <Link to={'/misevaluaciones'} className="w3-bar-item w3-button" 
//         onClick={closeMenu}
//         >Mis Evaluaciones</Link>
//          <Link to={'/evaluacion'} className="w3-bar-item w3-button" 
//         onClick={closeMenu}
//         >Evaluación al Líder</Link>
//         <Link to={'/quejas'} className="w3-bar-item w3-button" 
//         onClick={closeMenu}
//         >Reclamos</Link>
//         <Link to={'/incapayvacaciones'} className="w3-bar-item w3-button" 
//         onClick={closeMenu}
//         >Ausencias</Link>
//         {userInfo && userInfo.isSuper && <div> 
//         <Link to={'/revisionquejas'} className="w3-bar-item w3-button" 
//         onClick={closeMenu}
//         >Revisión Reclamos Recibidos</Link> 
//         </div>}
//         {userInfo && userInfo.isRH && <div> 
//          {/* <Link className="w3-bar-item w3-button" to={'/rhm'}
//         onClick={closeMenu}
//         >Recursos Humanos Vista Mes</Link> */}
//         <Link to={'/rhs'} className="w3-bar-item w3-button" 
//         onClick={closeMenu}
//         >Capital Humano Vista Semanal</Link>
//          <Link to={'/crearUsuarios'} className="w3-bar-item w3-button" 
//         onClick={closeMenu}
//         >Crear Usurios Nuevos - Lote</Link>
//          <Link className="w3-bar-item w3-button" to={'/actualizar'}
//         onClick={closeMenu}
//         >Actualización Usuario</Link> 
//         </div>}
//         {/* <Link className="w3-bar-item w3-button" to={'/satisfaccioncliente'}
//         onClick={closeMenu}
//         >Satisfacción del Cliente</Link> */}
//         <Link to={'/pregfreq'} className="w3-bar-item w3-button" 
//         onClick={closeMenu}
//         >Preguntas Frecuentes</Link> 
//          <Link to={'#!'} className="w3-bar-item w3-button" 
//         // onClick={closeMenu}
//         onClick={()=>NewTab()}
//         >Soporte Técnico</Link> 
//       </div>

//     <div className="w3-mobile w3-white w3-center w3-bottom w3-hide-large w3-hide-medium" >
//       <Link to={"/"} className="w3-bar-item w3-button"><HomeWorkIcon className="contenido-azul-NAD letraMenu"/></Link>
//       <Link to={"/calendar"} className="w3-bar-item w3-button"><CalendarTodayIcon className="letraMenu"/></Link>
//       <Link to={"/acceso"} className="w3-bar-item w3-button"><FingerprintIcon className="w3-text-pink letraMenu"/></Link>
//       {userInfo&& userInfo.isSuper &&
//       <Link to={"/grupo"} className="w3-bar-item w3-button"><GroupIcon className="w3-text-orange letraMenu"/></Link>
//       }
//       <Link to={"/logout"} className="w3-bar-item w3-button"><DirectionsRunIcon className="letraMenu"/></Link>
//       <Link to={"#"} className="w3-bar-item w3-button"
//       onClick={openMenu}
//       >
//       <MenuIcon className="letraMenu" />
//       </Link>
//     </div>


//   </div>



// </div>)
}
export default NavBarStore;