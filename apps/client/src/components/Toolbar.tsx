import { AppBar, Toolbar, Typography } from "@suid/material";

export default function OutletToolbar() {
    return <AppBar position="static" color="default">
        <Toolbar>
            <Typography variant="h6">Toolbar goes here</Typography>
        </Toolbar>
    </AppBar>
}