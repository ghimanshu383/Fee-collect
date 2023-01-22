import {createTheme} from "@mui/material"

export const theme = createTheme({
    palette:{
        primary:{
            main:"#171717",
            light:"#343a40",
            
        },
        secondary:{
            main:"#8D8D8D",
            light:"#e9ecef",
            contrastText:"#FF4444",
            "A100":"#f4c5c5",
            "100":"#D4EEE8",
            "200":"#4c4cf8"
        },
    },
    typography:{
        allVariants:{
            fontFamily:"sans-serif",
        }
    }
})
