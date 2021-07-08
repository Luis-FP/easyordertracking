import React, { useEffect, } from 'react';
import { useDispatch } from 'react-redux';
import { sendRecoverEmail } from "../actions/userActions";
import 'w3-css/w3.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

import { Alert, AlertTitle } from '@material-ui/lab';

import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/SendRounded';
const CAPPUBKEY = "6Le3dxIaAAAAAOOU2CjQqnNX4qXb15ZMuGuy9ZNI";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        flexDirection: "row",
        WebkitFlexWrap: 'wrap',
        WebkitJustifyContent: 'center',
        WebkitFlexDirection: "row",
        height: '100%',
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
    msgTitle: {
        fontSize: 16,
    },
    msgBody: {
        fontSize: 14,
    },
    titulo: {
        textAlign: 'center'
    },
}));




function EmailRecuperacionScreen(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [email, setEmail] = React.useState({
        email: '',
    });
    const [msg, setMsg] = React.useState({
        flag: false,
        title: "",
        message: "",
        type: ""
    });

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

        return () => {
            //
        };
    }, [msg]);




    const handleChange = (props) => (event) => {
        setEmail({ ...email, [props]: event.target.value });
    };
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const onSubmit = async (e) => {
        setMsg({
            type: "", message: "", title: "", flag: false
        })
        e.preventDefault();
        if (!email.email) {
            //console.log("Colocar un email")
            setMsg({
                type: "error", title: "Error de email", message: "Por favor Colocar un email", flag: true
            })
        }
        else if (!email.email.match(regex)) {
            //console.log("Email invalido")
            setMsg({
                type: "error", title: "Error de email", message: "Email es invalido", flag: true
            })
        }
        else {//newUser: newUser, no creo que se necesite
            let info = { email: email.email };
            //console.log("info new", info);

            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(CAPPUBKEY, { action: 'submit' }).then(async token => {
                    info.token = token;
                    const value = await dispatch(sendRecoverEmail(info));
                    setMsg({ flag: true, message: value.message, title: value.title, type: value.type, token });

                });
            });

        }
    }
    const createMessage = (type, message, title) => {
        //console.log(type, message, title)
        return <Alert onClose={() => {
            setMsg({ flag: false, message: "", title: "" })
        }} className={clsx(classes.msg, classes.w100, classes.msgBody)} severity={type} >
            <AlertTitle className={classes.msgTitle}>{title}</AlertTitle>
            {message}
        </Alert>;
    }

    return (
        <div >
            <div className="home background w3-container ">
                <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
                    <Grid container justify="center" alignItems="center" direction="row" >

                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>
                        <Grid item xs={12} sm={8} md={6} lg={4}  >
                            <h1 className={clsx(classes.titulo, classes.w100)}>Email de Recuperacion</h1>
                            {(msg.flag) && createMessage(msg.type, msg.message, msg.title)}
                            {/* {(!loading && emailRecovery) && createError(emailRecovery.message, emailRecovery.title)} */}

                            <FormControl className={clsx(classes.marginTop, classes.w100)} variant="filled">
                                <InputLabel className={classes.inputLabel} htmlFor="email">Email</InputLabel>
                                <FilledInput
                                    id="email"
                                    className={classes.textField}
                                    value={email.email}
                                    onChange={handleChange('email')}

                                />
                            </FormControl>
                        </Grid>

                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>
                        <Grid item sm={2} md={3} lg={4}  >
                        </Grid>
                        <Grid item xs={12} sm={8} md={5} lg={4}  >
                            <Button
                                fontSize="large"
                                variant="contained"
                                color="primary"
                                type="submit"
                                className={clsx(classes.marginTop, classes.button, classes.w100)}
                                endIcon={<SendIcon fontSize="large" />}
                            >
                                Enviar Email
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
export default EmailRecuperacionScreen;


