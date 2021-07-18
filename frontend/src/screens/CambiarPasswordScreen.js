import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { chgPasswordNew, chgPasswordUser, securePassword, encryptPublic, securePassword2 } from "../actions/userActions";
import 'w3-css/w3.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Grid from '@material-ui/core/Grid';

import { Alert, AlertTitle } from '@material-ui/lab';

import Button from '@material-ui/core/Button'; 
import SaveIcon from '@material-ui/icons/Save';

const CAPPUBKEY = "6Le3dxIaAAAAAOOU2CjQqnNX4qXb15ZMuGuy9ZNI";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        flexDirection: "row",
        WebkitFlexWrap: 'wrap',
        WebkitJustifyContent: 'center',
        WebkitFlexDirection: "row",
        height: '100%',
        flexGrow: 1,
    },
    w100: {
        width: '100%',
    },
    marginTop: {
        marginTop: theme.spacing(3),
    },
    button: {
        fontSize: 16,
    },
    textField: {
        fontSize: 16,
    },
    inputLabel: {
        fontSize: 16,
    },
    errorTitle: {
        fontSize: 16,
    },
    errorMsg: {
        fontSize: 14,
    },
    titulo: {
        textAlign: 'center'
    },
}));

function CambiarPasswordScreen(props) {
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const dispatch = useDispatch();
    const [newUser, setNewUser] = React.useState({
        value: true
    })
    useEffect(() => {
        if (userInfo) {
            // newUser = false;
            setNewUser(false)
            // props.history.push('/login');
        }
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

        return () => {
            //
        };
    }, [userInfo]);
    const classes = useStyles();
    const [password, setPassword] = React.useState({
        password: '',
        password2: '',
        showPassword: false,
        showPassword2: false,
    });
    const [error, setError] = React.useState({
        mensaje: null
    });
    const handleChange = (prop) => (event) => {
        setPassword({ ...password, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setPassword({ ...password, showPassword: !password.showPassword });
    };

    const handleClickShowPassword2 = () => {
        setPassword({ ...password, showPassword2: !password.showPassword2 });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const onSubmit = (e) => {
        setError({
            mensaje: "", flag: false
        })
        e.preventDefault();
        if (!password.password || !password.password2) {
            //console.log("Colocar un password")
            setError({
                mensaje: "Por favor Colocar un password", flag: true
            })
        }
        else if (password.password !== password.password2) {
            //console.log("son diferentes")
            setError({
                mensaje: "Passwords no coiciden", flag: true
            })
        }
        else {//newUser: newUser, no creo que se necesite
            let info = { password: password.password, password2: password.password2 };
            let hash;
            if (newUser && props) {
                hash = props.match.params.vh
                if (hash === undefined || hash === "") {
                    setError({
                        mensaje: "Link incorrecto o Viejo", flag: true
                    })
                }
                else {
                    //console.log("info new", info);
                    window.grecaptcha.ready(() => {
                        window.grecaptcha.execute(CAPPUBKEY, { action: 'submit' }).then(async token => {

                            securePassword(hash).then(({ keyInfo }) => {
                                let values = encryptPublic(JSON.stringify(info), keyInfo);
                                dispatch(chgPasswordNew({ values, token, hash })).then((success) => {
                                    if (success)
                                        props.history.push('/login');
                                    else setError({
                                        mensaje: "Link incorrecto o Viejo", flag: true
                                    })
                                })
                            })
                        });
                    });



                }
            }
            else if (!props && newUser) {
                setError({
                    mensaje: "Error", flag: true
                })
            }
            else {
                info.ut_id = userInfo.ut_id;
                let ut_id = userInfo.ut_id;
                //console.log("info new", info);
                window.grecaptcha.ready(() => {
                    window.grecaptcha.execute(CAPPUBKEY, { action: 'submit' }).then(async val => {
                        let token = val;
                        securePassword2(ut_id).then(({ keyInfo }) => {
                            let values = encryptPublic(JSON.stringify(info), keyInfo);
                            dispatch(chgPasswordUser({ values, token, ut_id })).then((success) => {
                                if (success)
                                    props.history.push('/');
                            });
                        });
                    });
                });


            }
        }
    }

    return (
        <div >
            <div className="home background w3-container ">
                <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
                    <Grid container justify="center" alignItems="center" direction="row" >

                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>
                        <Grid item xs={12} sm={8} md={6} lg={4}  >

                            <h1 className={clsx(classes.titulo, classes.w100)}>Cambio de Clave</h1>
                            {error.flag && (<Alert onClose={() => {
                                setError({ flag: false, message: "" })
                            }} className={clsx(classes.error, classes.w100, classes.errorMsg)} severity="error" >
                                <AlertTitle className={classes.errorTitle} >Error</AlertTitle>
                                {error.mensaje}
                            </Alert>)}
                        </Grid>

                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>
                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>

                        <Grid item xs={12} sm={8} md={6} lg={4}    >
                            <FormControl className={clsx(classes.marginTop, classes.w100)} variant="filled">
                                <InputLabel className={classes.inputLabel} htmlFor="password">Clave Nueva</InputLabel>
                                <FilledInput
                                    id="password"
                                    className={classes.textField}
                                    type={password.showPassword ? 'text' : 'password'}
                                    value={password.password}
                                    onChange={handleChange('password')}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {password.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>
                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>
                        <Grid item xs={12} sm={8} md={6} lg={4}    >
                            <FormControl className={clsx(classes.marginTop, classes.w100)} variant="filled">
                                <InputLabel className={classes.inputLabel} htmlFor="password2">Repetir Clave Nueva</InputLabel>
                                <FilledInput
                                    id="password2"
                                    className={classes.textField}
                                    type={password.showPassword2 ? 'text' : 'password'}
                                    value={password.password2}
                                    onChange={handleChange('password2')}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="habilita la visibilidad de la clave"
                                                onClick={handleClickShowPassword2}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {password.showPassword2 ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>
                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>
                        <Grid item xs={12} sm={8} md={6} lg={4}    >
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                type="submit"
                                className={clsx(classes.marginTop, classes.button, classes.w100)}
                                startIcon={<SaveIcon />}
                            >
                                Guardar
                            </Button>
                        </Grid>
                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>
                    </Grid>

                </form>
            </div>
        </div >
    )
}
export default CambiarPasswordScreen;


