import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { signin, encryptPublic, secureLogin, logout, marcarTCLeido, registroEntrada, autoLogout } from "../actions/userActions";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const CAPPUBKEY = "6LfaKTIdAAAAACORIO_DBSfV_JM5WLHUs6j-3zLi";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const azulFondo = blue[900]
const rojoFondo = red[900]

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

function LoginScreen(props) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [infoRegistroEntrada, setInfoRegistroEntrada] = useState('');
  // const [feelingPM, setFeelingPM] = useState('');
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo, errorLogin } = userSignin;

  // const userEntrada = useSelector(state => state.userEntrada);
  // const { horaEntrada } = userEntrada;

  const dispatch = useDispatch();

  const [abrirTYC, setAbrirTYC] = React.useState(false);

  const handleClickOpen = () => {
    setAbrirTYC(true);

  };

  const handleCloseNo = () => {

    setAbrirTYC(false);
    dispatch(autoLogout());
    props.history.push('/login');

  };

  const handleCloseSi = () => {

    setAbrirTYC(false);
    const registroInfo = { ...userInfo}
    dispatch(marcarTCLeido(true));
    dispatch(registroEntrada(registroInfo)).then(() => {
      props.history.push('/');
    });

  };

  useEffect(() => {
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    }

    // load the script by passing the URL
    loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${CAPPUBKEY}`, () => {
      //console.log("Script loaded!");
    });

    if (userInfo && !userInfo.terms_cond_acepted) {
      handleClickOpen(true);

    } else if (userInfo && userInfo.terms_cond_acepted) {
      const registroInfo = { ...userInfo}
      console.log("entraria...");
      props.history.push('/');
      // dispatch(registroEntrada(registroInfo)).then(() => {
      //   props.history.push('/');
      // });
    }


    return () => {
      //
    };
  }, [userInfo]);


  const submitHandler = (e) => {
    e.preventDefault();

    //validations:
    // //console.log('e', e);
    // setLoading(true);

    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(CAPPUBKEY, { action: 'submit' }).then(async val => {
        let token = val;
        let info = { password };
        secureLogin(email).then(({ keyInfo }) => {
          if (keyInfo) {
            let result = JSON.stringify(info);
            let values = encryptPublic(result, keyInfo);

            dispatch(signin({ values, token, email }))
          }
          else {

          }
        });
      });
    });

  };

  const NewTab = () => {
    window.open("https://smooth-ts.firebaseapp.com/", "_blank");
  };





  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Dialog
        open={abrirTYC}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseNo}
        // disableBackdropClick={true}
        disableEscapeKeyDown={true}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Términos y Condiciones del GENN App NAD"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Por medio de los presentes términos se le avisa a usted como usuario que sus datos se encuentran seguros y protegidos para el buen uso, dichos datos únicamente serán utilizados para efectos de la aplicación y resguardo de la base de datos. Esta aplicación trata los datos personales por encargo de la empresa conocida comercialmente como Geminatech, y no se entiende que se hayan transferido, si no que derivado de la relación contractual que se tiene con dicha empresa los datos son tratados única y exclusivamente para aquellos fines que se encuentran autorizados ya sea expresa o tácitamente y en general en el sistema de protección de datos personales de Geminatech.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNo} color="primary">
            No acepto
          </Button>
          <Button onClick={handleCloseSi} color="primary">
            Entendido y Acepto Condiciones
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Entrar
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitHandler}>
        {errorLogin && <div style={{color:'red'}}>{errorLogin.message}</div>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item >
              <Link to={"/emailRecuperacion"} variant="body2" id="btnSubmitEntrar" onClick={() => NewTab()}> 
                Olvide mi clave
              </Link>
            </Grid>
           
          </Grid>
        </form>
      </div>
      <Box mt={8}>
    
      </Box>
    </Container>
  );
}
export default LoginScreen;


