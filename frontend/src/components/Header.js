import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Chip, 
  Tooltip, 
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Badge,
  Avatar
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import ErrorIcon from '@mui/icons-material/Error';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GitHubIcon from '@mui/icons-material/GitHub';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ParkingIcon from '@mui/icons-material/LocalParking';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';

function Header({ apiStatus }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  
  const handleHelpClick = (event) => {
    setHelpAnchorEl(event.currentTarget);
  };

  const handleHelpClose = () => {
    setHelpAnchorEl(null);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const helpOpen = Boolean(helpAnchorEl);
  const notificationsOpen = Boolean(notificationsAnchorEl);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  const getStatusIndicator = () => {
    switch (apiStatus) {
      case 'connected':
        return (
          <Tooltip title="L'API est connectée et prête à recevoir des requêtes">
            <Chip
              icon={<WifiIcon />}
              label="API Connectée"
              color="success"
              size="small"
              sx={{ 
                borderWidth: 2, 
                fontWeight: 'medium',
                background: 'rgba(76, 175, 80, 0.1)',
                '& .MuiChip-icon': {
                  color: '#4caf50'
                }
              }}
            />
          </Tooltip>
        );
      case 'disconnected':
        return (
          <Tooltip title="Impossible de se connecter à l'API. Vérifiez que le serveur Flask est en cours d'exécution.">
            <Chip
              icon={<WifiOffIcon />}
              label="API Déconnectée"
              color="error"
              size="small"
              sx={{ 
                borderWidth: 2, 
                fontWeight: 'medium',
                background: 'rgba(244, 67, 54, 0.1)',
                '& .MuiChip-icon': {
                  color: '#f44336'
                }
              }}
            />
          </Tooltip>
        );
      case 'error':
        return (
          <Tooltip title="L'API est en cours d'exécution mais les modèles ne sont pas correctement chargés.">
            <Chip
              icon={<ErrorIcon />}
              label="Erreur API"
              color="warning"
              size="small"
              sx={{ 
                borderWidth: 2, 
                fontWeight: 'medium',
                background: 'rgba(255, 152, 0, 0.1)',
                '& .MuiChip-icon': {
                  color: '#ff9800'
                }
              }}
            />
          </Tooltip>
        );
      default:
        return (
          <Tooltip title="Vérification de la connexion à l'API...">
            <Chip
              icon={<WifiOffIcon />}
              label="Vérification..."
              color="default"
              size="small"
              sx={{ 
                borderWidth: 2, 
                fontWeight: 'medium',
                background: 'rgba(158, 158, 158, 0.1)',
                '& .MuiChip-icon': {
                  color: '#9e9e9e'
                }
              }}
            />
          </Tooltip>
        );
    }
  };

  const mobileDrawerContent = (
    <Box sx={{ width: 270, pt: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon color="primary" sx={{ mr: 1.5, fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Smart Parking</Typography>
        </Box>
        <IconButton onClick={toggleMobileDrawer} sx={{ borderRadius: 2 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          {getStatusIndicator()}
        </Box>
      </Box>
      <Divider />
      <List>
        <ListItem button component="a" href="#" sx={{ borderRadius: 1, my: 0.5, mx: 1 }}>
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        
        <ListItem button component="a" href="#" sx={{ borderRadius: 1, my: 0.5, mx: 1 }}>
          <ListItemIcon>
            <ParkingIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Occupation" />
        </ListItem>
        
        <ListItem button component="a" href="#" sx={{ borderRadius: 1, my: 0.5, mx: 1 }}>
          <ListItemIcon>
            <AccessTimeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Durée" />
        </ListItem>
        
        <ListItem button component="a" href="#" sx={{ borderRadius: 1, my: 0.5, mx: 1 }}>
          <ListItemIcon>
            <CategoryIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Profils" />
        </ListItem>

        <Divider sx={{ my: 2 }} />
        
        <ListItem button component="a" href="#" sx={{ borderRadius: 1, my: 0.5, mx: 1 }}>
          <ListItemIcon>
            <InfoIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="À propos" />
        </ListItem>
        
        <ListItem button component="a" href="https://github.com/aymen-jallouli/smart-parking" target="_blank" sx={{ borderRadius: 1, my: 0.5, mx: 1 }}>
          <ListItemIcon>
            <GitHubIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="GitHub" />
        </ListItem>

        <ListItem button component="a" href="#" sx={{ borderRadius: 1, my: 0.5, mx: 1 }}>
          <ListItemIcon>
            <SettingsIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Divider sx={{ mb: 1.5 }} />
        <Button 
          variant="outlined" 
          color="error" 
          fullWidth 
          startIcon={<LogoutIcon />}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Déconnexion
        </Button>
      </Box>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(90deg, rgba(63,81,181,1) 0%, rgba(33,150,243,1) 100%)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton 
              color="inherit" 
              edge="start" 
              onClick={toggleMobileDrawer} 
              sx={{ mr: 1.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              background: 'rgba(255,255,255,0.1)',
              px: 1.5,
              py: 0.8,
              borderRadius: 2
            }}
          >
            <DirectionsCarIcon sx={{ mr: 1.5, fontSize: isMobile ? 24 : 28 }} />
            <Typography 
              variant={isMobile ? "h6" : "h5"}
              component="div" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: 0.5,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Smart Parking
            </Typography>
          </Box>
        </Box>
        
        {/* Navigation du milieu - visible uniquement sur desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <Box
              sx={{
                display: 'flex',
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 3,
                p: 0.5,
              }}
            >
              <Button 
                color="inherit" 
                startIcon={<DashboardIcon />} 
                sx={{ 
                  px: 2, 
                  mx: 0.5,
                  fontWeight: 500,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)'
                  }
                }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                startIcon={<ParkingIcon />} 
                sx={{ 
                  px: 2, 
                  mx: 0.5,
                  fontWeight: 500,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)'
                  }
                }}
              >
                Occupation
              </Button>
              <Button 
                color="inherit" 
                startIcon={<AccessTimeIcon />} 
                sx={{ 
                  px: 2, 
                  mx: 0.5,
                  fontWeight: 500,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)'
                  }
                }}
              >
                Durée
              </Button>
            </Box>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile && getStatusIndicator()}
          
          {/* Icône de notifications avec badge */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit"
              onClick={handleNotificationsClick}
              sx={{ 
                ml: 1.5,
                background: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Menu des notifications */}
          <Menu
            anchorEl={notificationsAnchorEl}
            open={notificationsOpen}
            onClose={handleNotificationsClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 320,
                maxHeight: 380,
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                borderRadius: 2
              }
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Notifications</Typography>
              <Button size="small" color="primary">Tout marquer comme lu</Button>
            </Box>
            <Divider />
            
            <MenuItem sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <DirectionsCarIcon fontSize="small" />
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary="Taux d'occupation élevé" 
                secondary="Le parking A atteint 90% d'occupation"
                primaryTypographyProps={{ fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.85rem' }}
              />
            </MenuItem>
            
            <MenuItem sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <SchoolIcon fontSize="small" />
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary="Nouveau modèle disponible" 
                secondary="Modèle de clustering mis à jour"
                primaryTypographyProps={{ fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.85rem' }}
              />
            </MenuItem>
            
            <MenuItem sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <WifiOffIcon fontSize="small" />
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary="Déconnexion API brève" 
                secondary="L'API a subi une brève déconnexion"
                primaryTypographyProps={{ fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.85rem' }}
              />
            </MenuItem>
            
            <Divider />
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
              <Button size="small" color="primary">Voir toutes les notifications</Button>
            </Box>
          </Menu>
          
          {/* Aide et documentation */}
          <Tooltip title="Aide et documentation">
            <IconButton 
              aria-label="Aide" 
              color="inherit"
              onClick={handleHelpClick}
              size="medium"
              sx={{ 
                ml: 1.5,
                background: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={helpAnchorEl}
            open={helpOpen}
            onClose={handleHelpClose}
            TransitionComponent={Fade}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 220,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                borderRadius: 2
              }
            }}
          >
            <MenuItem onClick={handleHelpClose} sx={{ py: 1.2 }}>
              <ListItemIcon>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Documentation" />
            </MenuItem>
            <MenuItem onClick={handleHelpClose} sx={{ py: 1.2 }}>
              <ListItemIcon>
                <CodeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="API Reference" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleHelpClose} sx={{ py: 1.2 }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Paramètres" />
            </MenuItem>
          </Menu>

          {/* Menu utilisateur */}
          <Tooltip title="Profil utilisateur">
            <IconButton
              onClick={handleUserMenuClick}
              sx={{
                ml: 1.5,
                p: 0.3,
                border: '2px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  border: '2px solid rgba(255,255,255,0.6)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.dark',
                  width: 34, 
                  height: 34,
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                AJ
              </Avatar>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={userMenuAnchorEl}
            open={userMenuOpen}
            onClose={handleUserMenuClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 220,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                borderRadius: 2
              }
            }}
          >
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto',
                  mb: 1,
                  bgcolor: 'primary.dark',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                AJ
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Aymen Jallouli</Typography>
              <Typography variant="body2" color="text.secondary">Administrateur</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.2 }}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Mon profil" />
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.2 }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Paramètres" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.2 }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
        PaperProps={{
          sx: {
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          }
        }}
      >
        {mobileDrawerContent}
      </Drawer>
    </AppBar>
  );
}

export default Header;
