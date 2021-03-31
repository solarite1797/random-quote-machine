import { createMuiTheme } from '@material-ui/core/styles'

export const palette = {
    primary: {
        main: '#2a84eb'
    }
}

export function createTheme(type) {
    return createMuiTheme({
        palette: {
            type,
            ...palette
        }
    })
}
