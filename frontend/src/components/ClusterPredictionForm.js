import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Box,
  Slider,
  Typography,
  Grid,
  CircularProgress,
  InputAdornment,
  Paper,
  Tooltip,
  IconButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CategoryIcon from '@mui/icons-material/Category';
import TimerIcon from '@mui/icons-material/Timer';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HelpIcon from '@mui/icons-material/Help';

// Thème personnalisé pour le formulaire de clustering
const clusterFormTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
          height: '100%',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #673ab7 30%, #9c27b0 90%)',
          color: 'white',
          borderRadius: '12px 12px 0 0',
        },
        subheader: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 10px 0 rgba(0,0,0,0.12)',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#673ab7',
          height: 8,
        },
        thumb: {
          height: 22,
          width: 22,
          backgroundColor: '#fff',
          border: '2px solid currentColor',
        },
        valueLabel: {
          backgroundColor: '#673ab7',
        },
      },
    },
  },
});

// Configuration des paramètres du formulaire
const formConfig = {
  Parking_Duration: {
    label: "Durée de stationnement (h)",
    min: 0.5,
    max: 8,
    step: 0.5,
    defaultValue: 2,
    icon: <TimerIcon />,
    tooltip: "Combien de temps l'utilisateur reste généralement stationné (en heures)"
  },
  Payment_Amount: {
    label: "Montant payé (€)",
    min: 1,
    max: 40,
    step: 1,
    defaultValue: 10,
    icon: <PaymentIcon />,
    tooltip: "Combien l'utilisateur paie généralement pour le stationnement"
  },
  User_Parking_History: {
    label: "Historique d'utilisation",
    min: 0,
    max: 50,
    step: 1,
    defaultValue: 5,
    icon: <HistoryIcon />,
    tooltip: "Nombre de visites précédentes enregistrées pour cet utilisateur"
  },
  Proximity_To_Exit: {
    label: "Distance à la sortie (m)",
    min: 1,
    max: 100,
    step: 1,
    defaultValue: 30,
    icon: <LocationOnIcon />,
    tooltip: "Distance moyenne entre la place de stationnement préférée et la sortie la plus proche"
  }
};

const ClusterPredictionForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    Parking_Duration: formConfig.Parking_Duration.defaultValue,
    Payment_Amount: formConfig.Payment_Amount.defaultValue,
    User_Parking_History: formConfig.User_Parking_History.defaultValue,
    Proximity_To_Exit: formConfig.Proximity_To_Exit.defaultValue
  });
  const [activeHelpField, setActiveHelpField] = useState(null);

  // Gérer les changements de valeur dans le formulaire
  const handleSliderChange = (name) => (event, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  // Gérer les changements directs de valeur (input number)
  const handleInputChange = (name) => (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      const config = formConfig[name];
      const validValue = Math.max(config.min, Math.min(config.max, value));
      setFormData({
        ...formData,
        [name]: validValue
      });
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  // Afficher/masquer les aides
  const toggleHelpField = (field) => {
    if (activeHelpField === field) {
      setActiveHelpField(null);
    } else {
      setActiveHelpField(field);
    }
  };

  return (
    <ThemeProvider theme={clusterFormTheme}>
      <Card sx={{ height: '100%' }} className="card-hover">
        <CardHeader
          title="Analyse de Profil"
          subheader="Identifiez le profil comportemental de l'utilisateur"
          avatar={<CategoryIcon />}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {Object.entries(formConfig).map(([name, config]) => (
                <Grid item xs={12} key={name}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ mr: 1, color: 'primary.main' }}>
                        {config.icon}
                      </Box>
                      <Typography variant="subtitle1">
                        {config.label}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Tooltip title={config.tooltip}>
                        <IconButton size="small" onClick={() => toggleHelpField(name)}>
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    {activeHelpField === name && (
                      <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {config.tooltip}
                        </Typography>
                      </Box>
                    )}

                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs>
                        <Slider
                          value={formData[name]}
                          onChange={handleSliderChange(name)}
                          min={config.min}
                          max={config.max}
                          step={config.step}
                          valueLabelDisplay="auto"
                          disabled={loading}
                          marks={[
                            { value: config.min, label: `${config.min}` },
                            { value: config.max, label: `${config.max}` }
                          ]}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          value={formData[name]}
                          onChange={handleInputChange(name)}
                          InputProps={{
                            endAdornment: name === 'Payment_Amount' ? (
                              <InputAdornment position="end">€</InputAdornment>
                            ) : name === 'Proximity_To_Exit' ? (
                              <InputAdornment position="end">m</InputAdornment>
                            ) : name === 'Parking_Duration' ? (
                              <InputAdornment position="end">h</InputAdornment>
                            ) : null
                          }}
                          disabled={loading}
                          type="number"
                          inputProps={{
                            step: config.step,
                            min: config.min,
                            max: config.max
                          }}
                          sx={{ width: 100 }}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  size="large"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                  sx={{
                    py: 1.5,
                    mt: 2,
                    background: 'linear-gradient(45deg, #673ab7 30%, #9c27b0 90%)'
                  }}
                >
                  {loading ? "Analyse en cours..." : "Analyser le profil"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default ClusterPredictionForm;
