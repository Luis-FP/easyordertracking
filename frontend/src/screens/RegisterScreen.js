import React, {useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { register, infoRegistro, autoLogout } from "../actions/userActions";

import 'w3-css/w3.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { fechaActual } from '../components/fechas';
import AutorenewIcon from '@material-ui/icons/Autorenew';

function RegisterScreen(props){
    const [rs, setRs] = React.useState(null);
    const [idEmpleado, SetIdEmpleado] = React.useState(null);
    const [nombre, setNombre] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const [oficina, setOficina] = React.useState(null);
    const [puesto, setPuesto] =  React.useState(null);
 
    const [area, setArea] = React.useState(null);
    const [departamento, setDepartamento] =React.useState(null); 
    const [grupo, setGrupo] =  React.useState(null);
    const [vista, setVista] =  React.useState(null);
    const [miembros,  setMiembros] =  React.useState([]);

    const [sup, setSuper] = React.useState(false);
    const [rh, setRH] =React.useState(false);
    const [idLider, setIdLider] =  React.useState(null);
    const [lider, setLider] =  React.useState(null);
    const [puestoLider, setPuestoLider] =  React.useState(null);
    const [areaLider, setAreaLider] = React.useState(null);
    const [departamentoLider, setDepartamentoLider] =React.useState(null); 

    
    const infoRegister = useSelector(state => state.infoRegister );
    const  {loading,infoReg} = infoRegister;
    const userRegister = useSelector(state => state.userRegister );
    const  {  errorRegistro, userRegisterInfo } = userRegister;
    const userSignin = useSelector(state => state.userSignin );
    const  { userInfo} = userSignin;
    const userEntrada = useSelector(state => state.userEntrada);
    const { userKpiEntrada } = userEntrada;
   
    const dispatch = useDispatch();
    // const redirect = props.location.search ? props.location.search.split("=")[1] : '/';
 
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
        console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy en ms", fechaActual(userKpiEntrada.data.fecha).getDate(),  new Date().getDate())
        console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy", fechaActual(new Date(userKpiEntrada.data.fecha)), new Date())
        // //console.log("Fecha incorrecta, hay que hacer logout mes ",     fechaActual(userKpiEntrada.data.fecha).getMonth(), fechaActual(Date.now()).getMonth())
        // //console.log("Fecha incorrecta, hay que hacer logout ano", fechaActual(userKpiEntrada.data.fecha).getFullYear() , fechaActual(Date.now()).getFullYear() )
        dispatch(autoLogout())
        props.history.push('/login');
      }
      if(!infoReg){
        dispatch(infoRegistro());
      }
      if(userRegisterInfo){
        document.formaRegistro.reset();
        document.getElementById('id01').style.display='block';
      }
     
      
        return () => {
           //
        }
    }, [userRegisterInfo]);

    const submitHandler = (e) => {
      e.preventDefault();
      const datosRegistroUsuario ={
        razon_social: rs,
        id_empleado: idEmpleado,
        nombre: nombre,
        email: email,
        oficina: oficina,
        puesto: puesto,
        area: area,
        departamento: departamento,
        grupo: grupo,
        vista: vista,
        isSuper: sup,
        isRH: rh,
        id_lider: idLider,
        nombre_lider:lider,
        puesto_lider: puestoLider,
        area_lider: areaLider,
        departamento_lider: departamentoLider
      }
      //console.log('datosRegistroUsuario', datosRegistroUsuario)
        
        dispatch(register(datosRegistroUsuario));
        
    }

const handlerPuesto= (e, valor) => {
  e.preventDefault()
  //console.log('valor', valor)
  setPuesto(valor);

}

const handleSeleccionLider = (e,indice, valor) =>{
e.preventDefault()
  setAreaLider(valor.area)
  setDepartamentoLider(valor.departamento)
  setPuestoLider(valor.puesto)
  setGrupo(valor.vista) // persona pertenece al grupo cuyo lider tiene vista
  setIdLider(valor.id_empleado)
  setLider(valor.nombre)

}


const handleSeleccionVista = (e,indice, valor) =>{
  e.preventDefault()
  if(valor){

    setVista(valor._id)
    setMiembros(valor.integrantes)
  }else{
    setVista(null)
    setMiembros([])
  }

}


const cerrarAviso = () => {
  document.getElementById('id01').style.display='none';
}
    return (<div className="w3-container w3-center" >
    <h2 className="contenido-azul-NAD w3-xlarge">Crear Usuario</h2>
    {errorRegistro && <div className="w3-border w3-round w3-red w3-text-white">{errorRegistro}</div>}
    <div id="id01" className="w3-modal">
        <div className="w3-modal-content">
          <div className="w3-container">
            <span onClick={cerrarAviso}
            className="w3-button w3-display-topright">&times;</span>
            <p>Usuario Creado Exitosamente</p>
          </div>
        </div>
      </div>
     <form name="formaRegistro" className="w3-margin-top" onSubmit={submitHandler} >
     <div className="w3-row">
   
        {loading &&  <div><AutorenewIcon className="w3-jumbo w3-text-blue w3-spin" /></div>}
        <div className="w3-col s12 m6 l6">
            <label htmlFor="name" className="contenido-verde-NAD">
                Nombre
            </label>
            <input 
            placeholder="Nombre y Apellido"
            className="w3-input  full-width90"
            type="text" name='name' 
            required={true}
            onChange={(e) => setNombre(e.target.value)}/>
        </div>
       
        <div className="w3-col s6 m6 l6 ">
            <label htmlFor="email" className="contenido-verde-NAD">
                Email
            </label>
            <input 
            placeholder="email"
            className="w3-input full-width90"
            type="email" name='email' 
            required={true}
            onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="w3-col s6 m6 l6 ">
            <label htmlFor="email" className="contenido-verde-NAD">
                Id del Empleado
            </label>
            <input 
            placeholder="Id del Empleado"
            className="w3-input full-width90"
            type="text" name='idEmpleado' 
            required={true}
            onChange={(e) => SetIdEmpleado(e.target.value)}/>
        </div>
        {infoReg && infoReg.rs &&
          <div className="w3-col s6 m6 l6 w3-margin-top w3-padding">
          <label className="contenido-verde-NAD">
                Razón Social
          </label>
        <Autocomplete
          {...{
            options: infoReg.rs.map((nombre)=> nombre ),
            getOptionLabel: (option) => option,
          }}
          id="razon_social"
          // value={lider}
          onChange= {(event, newValue) => setRs( newValue )}
          renderInput={(params) => (
            //console.log('params',params),
          <TextField {...params}  margin="normal" placeholder="Razón Social" /> 
          )}
        />
      </div>}
      {infoReg && infoReg.oficina &&
          <div className="w3-col s6 m6 l6 w3-margin-top w3-padding">
          <label className="contenido-verde-NAD">
                Oficina
          </label>
        <Autocomplete
          {...{
            options: infoReg.oficina.map((nombre)=> nombre ),
            getOptionLabel: (option) => option,
          }}
          id="oficina"
          // value={lider}
          onChange= {(event, newValue) => setOficina( newValue )}
          renderInput={(params) => (
            //console.log('params',params),
          <TextField {...params}  margin="normal" placeholder="Oficina" /> 
          )}
        />
      </div>}
      {infoReg && infoReg.lider &&
          <div className="w3-col s12 m12 l12 w3-padding">
          <label className="contenido-verde-NAD">
                Líder
            </label>

        <Autocomplete
          {...{
            options: infoReg.lider.map((nombre)=> nombre ),
            getOptionLabel: (option) => option.nombre,
          }}
          id="lider"
          // value={lider}
          onChange= {(event, newValue) => handleSeleccionLider(event, event.target.id.split('-')[2], newValue )}
          // onChange={(event, newValue) => handleSeleccionLider(oficina, area, departamento, grupo, newValue)}
          renderInput={(params) => (
            //console.log('params',params),
          <TextField {...params}  margin="normal" placeholder="Líder" /> 
          )}
        />
      </div>}
            <div className="w3-col s12 m12 l12 w3-margin-top w3-card w3-white w3-padding">
                <div className="w3-col s5 m5 l5 w3-left-align w3-text-black ">Área: </div>
                <div className="w3-rest contenido-verde-NAD w3-left-align">{areaLider}</div>
                <div className="w3-col s5 m5 l5  w3-left-align w3-text-black ">Departamento:</div>
                <div className="w3-rest contenido-verde-NAD w3-left-align">{departamentoLider}</div>
                <div className="w3-col s5 m5 l5  w3-left-align w3-text-black ">Grupo: </div>
                <div className="ww3-rest contenido-verde-NAD w3-left-align">{grupo}</div>
             </div>
        </div>
        {infoReg && infoReg.puestos &&
          <div className="w3-col s12 m12 l12 w3-margin-top w3-padding">
          <label className="contenido-verde-NAD" >
                Puesto
            </label>
            {/*console.log("area, puesto, lider, infoReq", area, puesto, lider)*/}
        <Autocomplete
          {...{
            options: infoReg.puestos,
            getOptionLabel: (option) => option,
          }}
          id="puesto"
          freeSolo
          value={puesto}
          
          onChange={(event, newValue) => handlerPuesto(event, newValue )}
          renderInput={(params) => <TextField {...params} placeholder="Puesto"  margin="normal" />}
        />
      </div>}
      {infoReg && infoReg.area &&
          <div className="w3-col s6 m6 l6 w3-margin-top w3-padding">
          <label className="contenido-verde-NAD">
                Área
            </label>

        <Autocomplete
          {...{
            options: infoReg.area.map((nombre)=> nombre ),
            getOptionLabel: (option) => option,
          }}
          id="area"
          // value={lider}
          onChange= {(event, newValue) =>setArea(newValue )}
          // onChange={(event, newValue) => handleSeleccionLider(oficina, area, departamento, grupo, newValue)}
          renderInput={(params) => (
            //console.log('params',params),
          <TextField {...params}  margin="normal" placeholder="Área" /> 
          )}
        />
      </div>}
      {infoReg && infoReg.departamento &&
          <div className="w3-col s6 m6 l6 w3-margin-top w3-padding">
          <label className="contenido-verde-NAD">
                Departamento
            </label>

        <Autocomplete
          {...{
            options: infoReg.departamento.map((nombre)=> nombre ),
            getOptionLabel: (option) => option,
          }}
          id="departamento"
          // value={lider}
          onChange= {(event, newValue) =>setDepartamento(newValue )}
          // onChange={(event, newValue) => handleSeleccionLider(oficina, area, departamento, grupo, newValue)}
          renderInput={(params) => (
            //console.log('params',params),
          <TextField {...params}  margin="normal" placeholder="Departamento" /> 
          )}
        />
      </div>}
        <div className="w3-col s6 m6 l6 w3-left">
        <input className="w3-check " type="checkbox" name="super"
          // onClick={(e)=>handleSeleccionIsSuper(e)}
          onClick={(e)=>setSuper(e.target.checked)}
        />
        <label> Lider </label>
        </div>
        <div className="w3-col s6 m6 l6 w3-right">
        <input className="w3-check" type="checkbox" name="RH"
          onClick={(e)=>setRH(e.target.checked)}
        />
        <label> Capital Humano </label>
        </div>
        {infoReg && infoReg.lider && sup &&
          <div className="w3-col s12 m12 l12 w3-margin-top w3-padding">
          {infoReg /*&& console.log('infoReg.miembros', infoReg.miembros)*/}
        <Autocomplete
          {...{
            options: infoReg.miembros.map((vista)=> vista),
            getOptionLabel: (option) => option._id,
          }}
 
          id="vista"
          // value={vista}
          onChange= {(event, newValue) => handleSeleccionVista(event,event.target.id.split('-')[2], newValue )}
          // onChange={(event, newValue) => handleSeleccionLider(oficina, area, departamento, grupo, newValue)}
          renderInput={(params) => (
            //console.log('params',params),
          <TextField {...params} label="vista" margin="normal" /> 
          )}
        />
      </div>}


        <div className="w3-col s12 m12 l12 w3-margin-top w3-card w3-white w3-padding">
        Miembros del Equipo:
        {/* {miembros} */}
            {miembros && miembros.map((integrante)=> (
              <div key={'miembros'+integrante} className="w3-col s12 m12 l12 w3-left-align contenido-azul-NAD ">
                {integrante}
             </div>
            ))}
        </div>
               

        <div className="w3-col s12 m12 l12 w3-margin-top">
        <button
         type="submit" 
         onSubmit={()=> submitHandler()}
         className="w3-button w3-round full-width90 w3-blue" >Registrar</button>
        </div>
        <div className="paddingFin"></div>
    </form>
    
</div>)
}

export default RegisterScreen;


      