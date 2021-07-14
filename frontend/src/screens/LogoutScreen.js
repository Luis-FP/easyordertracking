import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { autoLogout, logout } from "../actions/userActions";

import { fechaActual } from '../components/fechas';


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    alignContent: 'center',
    '& > *': {
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

function LogoutScreen(props) {
  const classes = useStyles();

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo, errorLogin, salida } = userSignin;

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
        if (data && data.error === false) {
          props.history.push('/login');
          alert("Ha salido exitosamente!")
        } else {
          console.log("error", data)
          alert("Hubo un error de conexion al salir. Porfavor intentar en otra conexion.")

        }

      }
    );
  };
    const dispatch = useDispatch();



  useEffect(() => {
    console.log("userEffect")
  
    if (!userInfo) {
      props.history.push('/login');
 
  } 
    return () => {
      //
    };
  }, [salida]);


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

    <Grid container className={classes.root}>
      {userInfo && 
        <Typography >{userInfo.nombre}</Typography>

      }
     
      <form className="w3-margin-top" onSubmit={handleClickOpen}>


            <Button variant="contained" color="primary" fullWidth={true} type='submit' >
                    Salir
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

      </form>
    </Grid>

  </div>)
}
export default LogoutScreen;


