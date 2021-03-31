import { Grid, makeStyles, Paper } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    paper: {
        minHeight: `min(90vh, ${theme.spacing(40)}px)`,
        minWidth: `min(90vw, ${theme.spacing(70)}px)`,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column'
    }
}))

export default function Layout({ children }) {
    const classes = useStyles()

    return (
        <Grid container className={classes.root} justify="center" alignItems="center">
            <Paper className={classes.paper}>
                {children}
            </Paper>
        </Grid>
    )
}
