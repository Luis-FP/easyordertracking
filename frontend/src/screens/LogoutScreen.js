import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { autoLogout, logout } from "../actions/userActions";
import 'w3-css/w3.css';
import { fechaActual } from '../components/fechas';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

function LogoutScreen(props) {

  const [feelingPM, setFeelingPM] = useState('');
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo, errorLogin, salida } = userSignin;

  const userEntrada = useSelector(state => state.userEntrada);
  const { horaEntrada, userKpiEntrada } = userEntrada;

  // const userSalida = useSelector(state => state.userSalida );
  // const  {logoutSuccess} = userSalida;
  const [open, setOpen] = React.useState(false);

  const [salidaAutorizada, setSalidaAutorizada] = React.useState({
    salidaAutorizada: false,
  });

  const handleChange = (event) => {
    setSalidaAutorizada({ ...salidaAutorizada, [event.target.name]: event.target.checked });
  };


  const handleClickOpen = (e) => {
    e.preventDefault()
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSalir = () => {
    setOpen(false);

    const crd = null;
    const info = {
      feelingPM: feelingPM,
      crd: crd,
      salidaAutorizada: salidaAutorizada
    }
console.log('info', info)
    dispatch(logout(info)).then(
      (data) => {
        if (data && data.error === false) {
          props.history.push('/login');
          alert("Ha salido exitosamente!")
        } else {
          console.log("error", data)
          alert("Hubo un error de conexion al salir. Porfavor intentar en otra conexion.")

        }

      }
    );
    //console.log('salida',info )
    // navigator.geolocation.getCurrentPosition(successLogout, errorg, options);
    // document.getElementById('id01').style.display='block'; // no da tiempo de mostarlo

  };


  const dispatch = useDispatch();


  useEffect(() => {
    console.log("userEffect")
    // console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy en ms", fechaActual(userKpiEntrada.data.fecha).getDate(),  new Date().getDate())
    // console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy", userKpiEntrada.data.fecha,fechaActual(userKpiEntrada.data.fecha).getDate() , new Date().getDate() )
    if (!userInfo) {
      props.history.push('/login');
    // } else if(userKpiEntrada && (new Date(userKpiEntrada.data.fecha).getUTCDate()!==fechaActual(Date.now()).getDate() ||  
  } else if(userKpiEntrada && (fechaActual(userKpiEntrada.data.fecha).getDate()!==new Date().getDate() ||  
    fechaActual(userKpiEntrada.data.fecha).getMonth()!==new Date().getMonth() || 
    fechaActual(userKpiEntrada.data.fecha).getFullYear() !== new Date().getFullYear())) {
      // console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy en ms", fechaActual(userKpiEntrada.data.fecha).getDate(),  new Date().getDate())
      // console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy", fechaActual(new Date(userKpiEntrada.data.fecha)), new Date())
      // //console.log("Fecha incorrecta, hay que hacer logout mes ",     fechaActual(userKpiEntrada.data.fecha).getMonth(), fechaActual(Date.now()).getMonth())
      // //console.log("Fecha incorrecta, hay que hacer logout ano", fechaActual(userKpiEntrada.data.fecha).getFullYear() , fechaActual(Date.now()).getFullYear() )
      dispatch(autoLogout())
      props.history.push('/login');
    }
    return () => {
      //
    };
  }, [salida]);
  // }, []);


  // const logoutHandler = (e) => {
  //   e.preventDefault()
  //   const crd = null;
  //   const info = {
  //     feelingPM: feelingPM,
  //     crd: crd
  //   }


  //   dispatch(logout(info));
  //   //console.log('salida',info )
  //   // navigator.geolocation.getCurrentPosition(successLogout, errorg, options);
  //   alert("Ha salido exitosamente!")
  //   // document.getElementById('id01').style.display='block'; // no da tiempo de mostarlo

  // };



  const cerrarAviso = () => {
    document.getElementById('id01').style.display = 'none';
  }

  return (<div className=" w3-center">
    <div id="id01" className="w3-modal">
      <div className="w3-modal-content">
        <div className="w3-container">
          <span onClick={cerrarAviso}
            className="w3-button w3-display-topright">&times;</span>
          <p>Ha salido exitosamente!</p>
        </div>
      </div>
    </div>

    <div className="container-login  w3-padding">
      {userInfo && <div>
        <h1 className="contenido-verde-NAD w3-xxlarge">Hola!</h1>
        <h2 className="contenido-azul-NAD w3-xlarge">{userInfo.nombre}</h2>
      </div>
      }
      <h2 className="contenido-verde-NAD w3-xlarge">Control de Acceso</h2>
      {horaEntrada}
      {errorLogin && <div className="w3-border w3-round w3-red w3-text-white">{errorLogin.message}</div>}
      <form className="w3-margin-top" onSubmit={handleClickOpen}>
        <div className="w3-row">


          {userInfo && <div>

            <div className="w3-col s12 m12 l12 feeling">
              Cómo te sientes antes de salir?</div>
            <div className="w3-col s12 m12 l12 feeling">
              <label><SentimentVerySatisfiedIcon className="w3-xxlarge contenido-verde-NAD w3-margin-right w3-margin-left" /></label>
              <label><SentimentSatisfiedAltIcon className="w3-xxlarge contenido-verde-NAD w3-margin-right w3-margin-left" /></label>
              <label><SentimentDissatisfiedIcon className="w3-xxlarge contenido-verde-NAD w3-margin-right w3-margin-left" /></label>
              <label><SentimentVeryDissatisfiedIcon className="w3-xxlarge contenido-verde-NAD w3-margin-right w3-margin-left" /></label>
            </div>
            <div className="w3-col s12 m12 l12 feeling">
              <input className="w3-radio w3-margin-right w3-margin-left" type="radio" name="feelingPM" onChange={() => setFeelingPM('4')} />
              <input className="w3-radio w3-margin-right w3-margin-left" type="radio" name="feelingPM" onChange={() => setFeelingPM('3')} />
              <input className="w3-radio w3-margin-right w3-margin-left" type="radio" name="feelingPM" onChange={() => setFeelingPM('2')} />
              <input className="w3-radio w3-margin-right w3-margin-left" type="radio" name="feelingPM" onChange={() => setFeelingPM('1')} />
            </div> </div>}

          {/* {feelingPM && userInfo &&  */}
          <div className="w3-col s12 m12 l12 w3-margin-top">
          <FormControlLabel
              control={
                <Checkbox
                  checked={salidaAutorizada.salidaAutorizada}
                  onChange={handleChange}
                  name="salidaAutorizada"
                  color="primary"
                />
              }
              label="Salida Anticipada Autorizada"
            />
            <Button className="w3-xxlarge full-width100 fondo-azul-NAD w3-text-white"
              disabled={(feelingPM && userInfo) ? false : true}
              type="submit"
            // onClick={logoutHandler}
            >Salir
            </Button>
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
                  Usted esta terminando su Jornada Laboral. Solo se puede hacer una vez al dia.
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
          <div className="w3-col s12 m12 l12 feeling"> Al presionar <span className="contenido-verde-NAD">Salir </span>usted esta terminando su Jornada Laboral</div>

        </div>

      </form>
    </div>

  </div>)
}
export default LogoutScreen;


