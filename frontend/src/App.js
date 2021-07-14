import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import NavBarStore from './screens/NavBarStore';
import LoginScreen from './screens/LoginScreen';
import LogoutScreen from './screens/LogoutScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen'
import DetalleOTScreen from './screens/DetalleOTScreen'
import ActualizarScreen from './screens/ActualizarScreen';
import CrearOTScreen from './screens/CrearOTScreen';
import CrearSitioScreen from './screens/CrearSitioScreen';
import CambiarPasswordScreen from './screens/CambiarPasswordScreen';
import emailRecuperacionScreen from './screens/EmailRecuperacionScreen';
import UpdateModal from "./components/update"



function App() {
    return (
        <BrowserRouter>

            <div style={{ paddingBottom: "20px" }}>
                <UpdateModal></UpdateModal> 

                <NavBarStore />

                <main className="main">

                    <div className="content">

                        <Switch>
                            <Route path="/" exact={true} component={HomeScreen} />
                            <Route path="/login" component={LoginScreen} />
                            {/* <Route path="/logout" component={LogoutScreen} /> */}
                            <Route path="/detalleOT" component={DetalleOTScreen} />
                            <Route path="/register" component={RegisterScreen} />
                            <Route path="/actualizar" component={ActualizarScreen} />
                            <Route path="/crearOT" component={CrearOTScreen} />
                            <Route path="/crearSitio" component={CrearSitioScreen} />
                            <Route path="/cambiarClave/:vh" component={CambiarPasswordScreen} />
                            <Route path="/cambiarClave" component={CambiarPasswordScreen} />
                            <Route path="/emailRecuperacion" component={emailRecuperacionScreen} />
                            {/* <Route path="/pregfreq" component={PregFrecScreen} /> */}
                        </Switch>
                    </div>

                </main>

                <footer className="footer">

                </footer>
            </div>

        </BrowserRouter>
    );
}

export default App;
