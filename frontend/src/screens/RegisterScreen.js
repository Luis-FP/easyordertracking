import React, {useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { register,  autoLogout } from "../actions/userActions";

import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { fechaActual } from '../components/fechas';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

const verdefondo = green[900]
const azulfondo = blue[900]
const rojoFondo = red[900]
const greyfondo = grey[300]

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  titulo: {
    flexGrow: 1,
    fontSize: 30,
    textAlign:'center',
    color: azulfondo
  },
}));

const listaClientes = [
  'OFG',
  'Geminatech'
]
const proyectos = [
  {nombre:'Tigo_PA', item: 0},
  {nombre:'Tigo_NI', item: 1},
  {nombre:'Tigo_SV', item: 2},
  {nombre:'Torrecom', item: 3},
  {nombre:'DT_PA', item: 4},
  {nombre:'Terasur_PA', item: 5}
]

const oficinas = [
  'Panama', 'El Salvador', 'Nicaragua'
]


function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}


function RegisterScreen(props){
    const classes = useStyles()

    const [datosRegistroUsuario, setDatosRegistroUsuario] = React.useState({
      isUser: true,
      isSuper: false,
      isHiper: false,
      isInge: false,
      nombre:"",
      email: "",
      oficina: "",
      cliente: "",
      // vista: []
    });
 
    const [checked, setChecked] = React.useState([]);
    const inicioSeleccion = proyectos.map(item=>item.item);
    console.log('inicioSeleccion', inicioSeleccion)
    const [left, setLeft] = React.useState(inicioSeleccion);
    const [right, setRight] = React.useState([]);
  
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
  
    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
    };
  
    const handleAllRight = () => {
      setRight(right.concat(left));
      setLeft([]);
    };
  
    const handleCheckedRight = () => {
      setRight(right.concat(leftChecked));
      setLeft(not(left, leftChecked));
      setChecked(not(checked, leftChecked));

    };
  
    const handleCheckedLeft = () => {
      setLeft(left.concat(rightChecked));
      setRight(not(right, rightChecked));
      setChecked(not(checked, rightChecked));
    };
  
    const handleAllLeft = () => {
      setLeft(left.concat(right));
      setRight([]);
    };

    

    const infoRegister = useSelector(state => state.infoRegister );
    const  {loading,infoReg} = infoRegister;
    const userRegister = useSelector(state => state.userRegister );
    const  {  errorRegistro, userRegisterInfo } = userRegister;
    const userSignin = useSelector(state => state.userSignin );
    const  { userInfo} = userSignin;

   
    const dispatch = useDispatch();

    useEffect(() => {
      console.log("userEffect")
      if (!userInfo) {
        props.history.push('/login');
    } 

      if(userRegisterInfo){
        document.formaRegistro.reset();
        handleClickOpen(true)
      }
     
      
        return () => {
           //
        }
    }, [userRegisterInfo]);

    const submitHandler = (e) => {
      e.preventDefault();
      console.log('right',right )
      let proyVistas = [];
      proyectos.forEach(item=> {
        if(right.includes(item.item)) {
          proyVistas.push(item.nombre);
        }
      }) 
      console.log("x",proyVistas)
      // setDatosRegistroUsuario( {...datosRegistroUsuario, ['vista']: Array.from(proyVistas, (element) =>  element )})
      console.log('grabando',  datosRegistroUsuario, proyVistas)
        dispatch(register(datosRegistroUsuario,proyVistas ));    
    }


  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const customList = (items) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items.map((value, index) => {
          const labelId = `transfer-list-item-${value}-label`;
          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={proyectos[value].nombre} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

    return (    
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xs">
        <Typography component="div" style={{ height: '3vh' }} />
    <Typography className={classes.titulo} >Crear Usuario</Typography>
    {errorRegistro && <div className="w3-border w3-round w3-red w3-text-white">{errorRegistro}</div>}
    <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Usuario Creado Exitosamente"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                El usuario ha sido creado exitosamente
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary" autoFocus>
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </div>


     <form name="formaRegistro" className={classes.root} onSubmit={submitHandler} >
     <Grid container margintop='true' className={classes.root} spacing={1}>
        {/* <Grid item xs={12}>   */}
   
        {loading && <CircularProgress/>}
        <Grid item xs={12} sm={6}> 
            <TextField
              required
              id="name"
              label="Nombre"
              placeholder="Nombre y Apellido"
              variant="outlined"
              onChange={(e) => setDatosRegistroUsuario( {...datosRegistroUsuario, ['nombre']: e.target.value})}
            />
        </Grid>
       
        <Grid item xs={6} sm={6}> 
             <TextField
              required
              id="email"
              label="Email"
              placeholder="Email"
              variant="outlined"
              onChange={(e) => setDatosRegistroUsuario( {...datosRegistroUsuario, ['email']: e.target.value})}
            />
        </Grid>

       
  
      {oficinas &&
        <Grid item xs={6} sm={6}> 

        <Autocomplete
          {...{
            options: oficinas ,
            getOptionLabel: (option) => option,
          }}
          id="oficina"
          onChange= {(event, newValue) => setDatosRegistroUsuario( {...datosRegistroUsuario, ['oficina']:newValue})}
          renderInput={(params) => (
          <TextField {...params}  margin="normal" placeholder="Oficina" variant="outlined" /> 
          )}
        />
      </Grid>}
     
           

        {listaClientes &&
          <Grid item xs={6} sm={6}> 
        <Autocomplete
          {...{
            options: listaClientes,
            getOptionLabel: (option) => option,
          }}
          id="cliente"
          value={datosRegistroUsuario['cliente']}
          onChange= {(event, newValue) => setDatosRegistroUsuario( {...datosRegistroUsuario, ['cliente']:newValue})}
          renderInput={(params) => <TextField {...params} placeholder="Cliente"  variant="outlined"  margin="normal" />}
        />
      </Grid>}
     
     
      <Grid item xs={12} sm={12}> 
      <FormGroup row style={{align:'center'}}>
      <FormControlLabel
        control={
          <Checkbox
           checked={datosRegistroUsuario['super']}
            onChange={(e) => setDatosRegistroUsuario( {...datosRegistroUsuario, ['isSuper']: e.target.checked})}
            name="isSuper"
            color="primary"
          />
        }
        label="isSuper"
      />
            <FormControlLabel
        control={
          <Checkbox
            checked={datosRegistroUsuario['hiper']}
            onChange={(e) => setDatosRegistroUsuario( {...datosRegistroUsuario, ['isHiper']: e.target.checked})}
            name="isHiper"
            color="primary"
          />
        }
        label="isHiper"
      />
            <FormControlLabel
        control={
          <Checkbox
            checked={datosRegistroUsuario['user']}
            onChange={(e) => setDatosRegistroUsuario( {...datosRegistroUsuario, ['isUser']: e.target.checked})}
            name="isUser"
            color="primary"
          />
        }
        label="isUser"
      />
         <FormControlLabel
        control={
          <Checkbox
            checked={datosRegistroUsuario['user']}
            onChange={(e) => setDatosRegistroUsuario( {...datosRegistroUsuario, ['isInge']: e.target.checked})}
            name="isInge"
            color="primary"
          />
        }
        label="isInge"
      />
      </FormGroup>
        </Grid>
        {proyectos &&
          <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      className={classes.root}
    >
    {console.log('right', right)}
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>
    </Grid>}
    <Button
      
      style={{color:'white', backgroundColor:azulfondo}}
      type={"submit"}
      fullWidth
    > Crear Usuario</Button>
    </Grid>
    </form>

    </Container>
    </React.Fragment>
)
}

export default RegisterScreen;


      