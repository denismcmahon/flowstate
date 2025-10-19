import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth } from '../auth/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    return (
        <AppBar position="fixed" color="transparent" elevation={0}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>FlowState</Typography>
                {user && <Button onClick={logout} color="inherit">Logout</Button>}
            </Toolbar>
        </AppBar>
    );
}