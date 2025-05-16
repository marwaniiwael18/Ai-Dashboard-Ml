import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Link, 
  Divider, 
  Grid, 
  Stack, 
  Tooltip, 
  IconButton,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import ParkingIcon from '@mui/icons-material/LocalParking';

function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        background: 'linear-gradient(90deg, rgba(25,34,67,1) 0%, rgba(33,49,89,1) 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, rgba(33,150,243,0.2) 0%, rgba(63,81,181,0.2) 100%)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <ParkingIcon sx={{ color: '#90caf9', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                  Smart Parking
                </Typography>
              </Paper>
            </Box>
            <Typography variant="body2" color="grey.400" sx={{ mb: 2, maxWidth: 350 }}>
              Système intelligent de prédiction de stationnement utilisant des modèles d'apprentissage automatique
              pour prédire la durée de stationnement et l'occupation des places de parking.
            </Typography>
            
            <Stack direction="row" spacing={1.5}>
              <Tooltip title="GitHub">
                <IconButton 
                  component="a" 
                  href="#" 
                  target="_blank" 
                  sx={{ 
                    color: 'grey.400',
                    '&:hover': { 
                      color: '#fff', 
                      background: 'rgba(255,255,255,0.1)' 
                    } 
                  }}
                >
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="LinkedIn">
                <IconButton 
                  component="a" 
                  href="#" 
                  target="_blank" 
                  sx={{ 
                    color: 'grey.400',
                    '&:hover': { 
                      color: '#fff', 
                      background: 'rgba(255,255,255,0.1)' 
                    } 
                  }}
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Twitter">
                <IconButton 
                  component="a" 
                  href="#" 
                  target="_blank" 
                  sx={{ 
                    color: 'grey.400',
                    '&:hover': { 
                      color: '#fff', 
                      background: 'rgba(255,255,255,0.1)' 
                    } 
                  }}
                >
                  <TwitterIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Email">
                <IconButton 
                  component="a" 
                  href="mailto:contact@example.com" 
                  sx={{ 
                    color: 'grey.400',
                    '&:hover': { 
                      color: '#fff', 
                      background: 'rgba(255,255,255,0.1)' 
                    } 
                  }}
                >
                  <EmailIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                fontWeight: 600, 
                color: '#90caf9',
                position: 'relative',
                display: 'inline-block',
                mb: 2.5,
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -8,
                  height: 3,
                  width: 40,
                  backgroundColor: '#90caf9'
                }
              }}
            >
              Technologies utilisées
            </Typography>
            <Box 
              component="ul" 
              sx={{ 
                listStyle: 'none', 
                pl: 0, 
                m: 0
              }}
            >
              {['Python', 'Flask', 'scikit-learn', 'React', 'Material-UI', 'Machine Learning', 'Docker'].map(tech => (
                <Box 
                  component="li" 
                  key={tech} 
                  sx={{ 
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '&:before': {
                      content: '""',
                      display: 'inline-block',
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      backgroundColor: '#90caf9',
                      mr: 1.5
                    }
                  }}
                >
                  <Typography variant="body2" color="grey.300">
                    {tech}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                fontWeight: 600, 
                color: '#90caf9',
                position: 'relative',
                display: 'inline-block',
                mb: 2.5,
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -8,
                  height: 3,
                  width: 40,
                  backgroundColor: '#90caf9'
                }
              }}
            >
              Liens rapides
            </Typography>
            <Box 
              component="ul" 
              sx={{ 
                listStyle: 'none', 
                pl: 0, 
                m: 0
              }}
            >
              {[
                { name: 'Accueil', link: '#' },
                { name: 'Documentation API', link: '#' },
                { name: 'À propos du modèle', link: '#' },
                { name: 'Contact', link: '#' }
              ].map(item => (
                <Box 
                  component="li" 
                  key={item.name} 
                  sx={{ 
                    mb: 1.5,
                  }}
                >
                  <Link 
                    href={item.link}
                    sx={{ 
                      color: 'grey.300',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: '#fff',
                        textDecoration: 'none'
                      }
                    }}
                  >
                    {item.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} Smart Parking Prediction - Tous droits réservés
          </Typography>
          {!isMobile && (
            <Typography variant="body2" color="grey.600">
              Conçu et développé par Aymen Jallouli
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
