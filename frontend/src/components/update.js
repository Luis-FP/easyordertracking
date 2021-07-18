import React from 'react';
// import PropTypes from 'prop-types';
import { makeStyles, createMuiTheme, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
// import Backdrop from '@material-ui/core/Backdrop';
// import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import Button from '@material-ui/core/Button';
import GetApp from '@material-ui/icons/GetApp';
import { green } from '@material-ui/core/colors';
import ClearCache from 'react-clear-cache';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}));



export default function UpdateModal() {

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    // const handleOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = () => {
    //     setOpen(false);
    // };
    const ColorButton = withStyles((theme) => ({
        root: {
            color: green[50],
            backgroundColor: green[400],
            '&:hover': {
                backgroundColor: green[400],
            },
        },
    }))(Button);
    return (<div>

        <div style={{ display: "flex", direction: "row" }}>


            <ClearCache>
                {({ isLatestVersion, emptyCacheStorage }) => (
                    < div >
                        {!isLatestVersion && (
                            <Modal
                                open={open}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                                style={{ justifyContent: "center", alignItems: "center", display: "flex", direction: "row" }}
                            >

                                <div style={{ justifyContent: "center", alignItems: "center", display: 'flex' }} className={classes.paper}>

                                    <ColorButton
                                        variant="contained"
                                        color="primary"
                                        startIcon={<GetApp />}
                                        onClick={async e => {
                                            e.preventDefault();
                                            console.log(emptyCacheStorage)
                                            emptyCacheStorage();
                                            // handleClose();
                                        }}
                                    >
                                        Actualizar Version
                                </ColorButton>
                                </div>
                            </Modal>
                        )}</div>
                )}
            </ClearCache>
        </div>
    </div >
    );
}
