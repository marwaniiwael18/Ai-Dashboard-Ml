import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  TextField, 
  Button, 
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Tooltip,
  IconButton,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  FormHelperText,
  Paper,
  Stack,
  Chip,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import TimerIcon from '@mui/icons-material/Timer';
import HelpIcon from '@mui/icons-material/Help';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EuroIcon from '@mui/icons-material/Euro';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import WeekendIcon from '@mui/icons-material/Weekend';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import LooksOneIcon from '@mui/icons-material/LooksOne';

// Thème personnalisé pour les formulaires
const formTheme = createTheme({
  components: {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#2196f3',
          height: 8,
        },
        track: {
          height: 8,
          borderRadius: 4,
        },
        rail: {
          height: 8,
          borderRadius: 4,
          opacity: 0.5,
        },
        thumb: {
          height: 22,
          width: 22,
          backgroundColor: '#fff',
          border: '2px solid currentColor',
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: '0px 0px 0px 8px rgba(33, 150, 243, 0.16)',
          },
        },
        valueLabel: {
          backgroundColor: '#2196f3',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #2196f3 30%, #03a9f4 90%)',
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
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            backgroundColor: 'rgba(33, 150, 243, 0.12)',
            color: '#1976d2',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.2)',
            }
          },
        },
      },
    },
  },
});

// Styled components pour les options visuelles
const StyledFrequencyButton = styled(ToggleButton)(({ theme, value }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '90px',
  width: '100%',
  padding: theme.spacing(1),
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    backgroundColor: 'rgba(33, 150, 243, 0.12)',
    borderColor: theme.palette.primary.main
  }
}));

const FrequencyIcon = styled('div')(({ theme, value }) => {
  const getColor = () => {
    if (value === 'rare') return '#ff9800';
    if (value === 'occasional') return '#8bc34a';
    if (value === 'regular') return '#03a9f4';
    if (value === 'frequent') return '#673ab7';
    return theme.palette.text.primary;
  };

  return {
    color: getColor(),
    fontSize: '2rem',
    marginBottom: theme.spacing(0.5)
  };
});

const StyledDurationButton = styled(ToggleButton)(({ theme, value }) => {
  const getBgColor = () => {
    switch (value) {
      case 'short': return 'rgba(76, 175, 80, 0.1)';
      case 'medium': return 'rgba(255, 152, 0, 0.1)';
      case 'long': return 'rgba(244, 67, 54, 0.1)';
      case 'verylong': return 'rgba(156, 39, 176, 0.1)';
      default: return 'transparent';
    }
  };

  const getBorderColor = () => {
    switch (value) {
      case 'short': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'long': return '#f44336';
      case 'verylong': return '#9c27b0';
      default: return theme.palette.divider;
    }
  };

  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100px',
    width: '100%',
    padding: theme.spacing(1),
    backgroundColor: getBgColor(),
    borderRadius: '8px',
    borderColor: theme.palette.divider,
    '&.Mui-selected': {
      backgroundColor: getBgColor(),
      borderColor: getBorderColor(),
      borderWidth: '2px',
      '&:hover': {
        backgroundColor: getBgColor(),
        opacity: 0.9
      }
    },
    '&:hover': {
      backgroundColor: getBgColor(),
      opacity: 0.75
    }
  };
});

// Descriptions des champs et valeurs recommandées pour la prédiction de durée
const featureDescriptions = {
  'Hour': {
    description: 'Heure d\'arrivée',
    type: 'select',
    options: Array.from({ length: 24 }, (_, i) => ({ 
      value: i, 
      label: `${i}:00` 
    })),
    defaultValue: 12,
    icon: <AccessTimeIcon color="primary" />,
    detailedDesc: 'L\'heure d\'arrivée au parking influence directement la durée probable de stationnement. Les heures de bureau (8h-18h) et les heures de repas ont des comportements distincts.'
  },
  'Weekday': {
    description: 'Jour de la semaine',
    type: 'day-selector',
    options: [
      { value: 0, label: 'Lun', fullLabel: 'Lundi' },
      { value: 1, label: 'Mar', fullLabel: 'Mardi' },
      { value: 2, label: 'Mer', fullLabel: 'Mercredi' },
      { value: 3, label: 'Jeu', fullLabel: 'Jeudi' },
      { value: 4, label: 'Ven', fullLabel: 'Vendredi' },
      { value: 5, label: 'Sam', fullLabel: 'Samedi' },
      { value: 6, label: 'Dim', fullLabel: 'Dimanche' }
    ],
    defaultValue: 3,
    icon: <CalendarMonthIcon color="primary" />,
    detailedDesc: 'Les comportements de stationnement varient considérablement selon le jour de la semaine. Les jours ouvrés ont tendance à avoir des durées plus prévisibles liées au travail.'
  },
  'Is_Weekend': {
    description: 'Jour de weekend',
    type: 'boolean',
    options: [
      { value: 0, label: 'Jour de semaine' },
      { value: 1, label: 'Weekend' }
    ],
    defaultValue: 0,
    icon: <WeekendIcon color="primary" />,
    detailedDesc: 'Les weekends ont généralement des durées de stationnement différentes, souvent plus longues et moins prévisibles que les jours de semaine.'
  },
  'Electric_Vehicle': {
    description: 'Véhicule électrique',
    type: 'boolean',
    options: [
      { value: 0, label: 'Non' },
      { value: 1, label: 'Oui' }
    ],
    defaultValue: 0,
    icon: <ElectricCarIcon color="primary" />,
    detailedDesc: 'Les véhicules électriques restent souvent stationnés plus longtemps pour permettre une recharge complète.'
  },
  'Reserved_Status': {
    description: 'Place réservée',
    type: 'boolean',
    options: [
      { value: 0, label: 'Non ' },
      { value: 1, label: 'Oui' }
    ],
    defaultValue: 0,
    icon: <BookmarkIcon color="primary" />,
    detailedDesc: 'Les places réservées ont souvent des durées de stationnement plus longues et plus régulières.'
  },
  'User_Parking_History': {
    description: 'Fréquence d\'utilisation',
    type: 'frequency-selector',
    options: [
      { value: 1, label: 'Rare', description: '1-2 visites' },
      { value: 5, label: 'Occasionnel', description: '3-7 visites' },
      { value: 15, label: 'Régulier', description: '8-20 visites' },
      { value: 30, label: 'Fréquent', description: '20+ visites'}
    ],
    defaultValue: 5,
    icon: <AccountCircleIcon color="primary" />,
    detailedDesc: 'Le nombre de visites précédentes de cet utilisateur. Les utilisateurs réguliers ont souvent des habitudes de stationnement plus prévisibles.'
  },
  'Parking_Duration': {
    description: 'Durée prévue du stationnement',
    type: 'duration-selector',
    options: [
      { value: 1, label: 'Courte', description: 'Environ 1h', range: '< 2h' },
      { value: 3, label: 'Moyenne', description: 'Environ 3h', range: '2-4h' },
      { value: 5, label: 'Longue', description: 'Environ 5h', range: '4-6h' },
      { value: 8, label: 'Très longue', description: 'Environ 8h', range: '> 6h' }
    ],
    defaultValue: 3,
    icon: <TimerIcon color="primary" />,
    detailedDesc: 'Estimation de la durée de stationnement prévue. Ce paramètre influence directement la probabilité d\'occupation d\'une place à un moment donné.'
  },
  'Payment_Amount': {
    description: 'Montant du paiement',
    range: [0, 50],
    step: 0.5,
    type: 'number',
    unit: '€',
    defaultValue: 10,
    icon: <EuroIcon color="primary" />,
    detailedDesc: 'Le montant payé est généralement proportionnel à la durée prévue du stationnement.'
  },
  'Proximity_To_Exit': {
    description: 'Distance à la sortie',
    range: [1, 100],
    step: 1,
    type: 'number',
    unit: 'm',
    defaultValue: 25,
    icon: <LocationOnIcon color="primary" />,
    detailedDesc: 'La distance de la place à la sortie la plus proche. Les places plus éloignées sont souvent utilisées pour des stationnements plus longs.'
  },
  'Weather_Temperature': {
    description: 'Température extérieure',
    range: [-10, 40],
    step: 1,
    type: 'slider',
    unit: '°C',
    defaultValue: 22,
    icon: <WbSunnyIcon color="primary" />,
    detailedDesc: 'La température peut influencer la durée du stationnement, notamment par temps extrême (très chaud ou très froid).'
  },
  'Weather_Precipitation': {
    description: 'Niveau de précipitation',
    type: 'select',
    options: [
      { value: 0, label: 'Aucune' },
      { value: 1, label: 'Légère' },
      { value: 2, label: 'Modérée' },
      { value: 3, label: 'Forte' }
    ],
    defaultValue: 0,
    icon: <ThunderstormIcon color="primary" />,
    detailedDesc: 'En cas de fortes précipitations, les durées de stationnement peuvent être prolongées car les gens évitent de se déplacer sous la pluie.'
  }
};

function ParkingDurationForm({ onSubmit, loading, features }) {
  const [formData, setFormData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [expandedHelp, setExpandedHelp] = useState(false);
  const [activeHelpField, setActiveHelpField] = useState(null);

  useEffect(() => {
    // Initialiser le formData avec des valeurs par défaut
    if (features && features.length > 0) {
      const initialData = {};
      
      // Ajouter toutes les caractéristiques demandées par l'API
      features.forEach(feature => {
        const featureInfo = featureDescriptions[feature] || {};
        // Si c'est une des caractéristiques avec valeur par défaut
        if (featureInfo.defaultValue !== undefined) {
          initialData[feature] = featureInfo.defaultValue;
        } else {
          initialData[feature] = '';
        }
      });
      
      setFormData(initialData);
    }
  }, [features]);

  // Vérifier si tous les champs requis sont remplis
  useEffect(() => {
    if (features && features.length > 0) {
      const allFieldsFilled = features.every(feature => 
        formData[feature] !== undefined && formData[feature] !== ''
      );
      setIsFormValid(allFieldsFilled);
    }
  }, [formData, features]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value)
    });
  };

  const handleSliderChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBooleanChange = (name, event) => {
    setFormData({
      ...formData,
      [name]: event.target.checked ? 1 : 0
    });
  };

  const handleFrequencyChange = (name, newValue) => {
    // Ne pas mettre à jour si null (aucune valeur sélectionnée)
    if (newValue !== null) {
      setFormData({
        ...formData,
        [name]: Number(newValue)
      });
    }
  };

  const handleDayChange = (name, newValue) => {
    if (newValue !== null) {
      setFormData({
        ...formData,
        [name]: Number(newValue)
      });
      
      // Mettre à jour Is_Weekend automatiquement si présent dans les features
      if (features.includes('Is_Weekend')) {
        const isWeekend = newValue === 5 || newValue === 6;
        setFormData(prevData => ({
          ...prevData,
          [name]: Number(newValue),
          'Is_Weekend': isWeekend ? 1 : 0
        }));
      }
    }
  };

  const handleDurationChange = (name, newValue) => {
    if (newValue !== null) {
      const selectedOption = featureDescriptions[name].options.find(opt => opt.label.toLowerCase() === newValue);
      if (selectedOption) {
        setFormData({
          ...formData,
          [name]: selectedOption.value
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  // Générer une description conviviale pour les noms de caractéristiques
  const getFeatureLabel = (featureName) => {
    return featureName
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleHelpField = (fieldName) => {
    if (activeHelpField === fieldName) {
      setActiveHelpField(null);
    } else {
      setActiveHelpField(fieldName);
    }
  };

  const renderInputField = (feature) => {
    const featureInfo = featureDescriptions[feature] || { type: 'number' };
    const label = getFeatureLabel(feature);

    const fieldContainer = (children) => (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)'
          } 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {featureInfo.icon || <TimerIcon color="primary" />}
          <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 500 }}>
            {label}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Plus d'informations">
            <IconButton size="small" onClick={() => toggleHelpField(feature)}>
              <HelpIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
        </Box>
        
        {activeHelpField === feature && (
          <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {featureInfo.detailedDesc || featureInfo.description}
            </Typography>
          </Box>
        )}
        
        {children}
      </Paper>
    );

    switch (featureInfo.type) {
      case 'slider':
        return fieldContainer(
          <Box sx={{ width: '100%', px: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Slider
                  name={feature}
                  value={formData[feature] || featureInfo.range[0]}
                  onChange={(_, value) => handleSliderChange(feature, value)}
                  min={featureInfo.range[0]}
                  max={featureInfo.range[1]}
                  step={featureInfo.step || 1}
                  marks={[
                    { value: featureInfo.range[0], label: `${featureInfo.range[0]} ${featureInfo.unit || ''}` },
                    { value: featureInfo.range[1], label: `${featureInfo.range[1]} ${featureInfo.unit || ''}` }
                  ]}
                  valueLabelDisplay="auto"
                  disabled={loading}
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={`${formData[feature]} ${featureInfo.unit || ''}`} 
                  color="primary" 
                  variant="outlined" 
                />
              </Grid>
            </Grid>
            <FormHelperText>{featureInfo.description}</FormHelperText>
          </Box>
        );

      case 'boolean':
        return fieldContainer(
          <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>{featureInfo.options[0].label}</Typography>
              <Switch
                checked={formData[feature] === 1}
                onChange={(e) => handleBooleanChange(feature, e)}
                name={feature}
                disabled={loading}
                color="primary"
              />
              <Typography>{featureInfo.options[1].label}</Typography>
            </Stack>
            <FormHelperText>{featureInfo.description}</FormHelperText>
          </FormControl>
        );

      case 'day-selector':
        return fieldContainer(
          <Box sx={{ width: '100%', mt: 1 }}>
            <ToggleButtonGroup
              value={formData[feature] !== undefined ? formData[feature].toString() : ''}
              exclusive
              onChange={(e, newValue) => handleDayChange(feature, newValue)}
              aria-label="jour de la semaine"
              fullWidth
              disabled={loading}
              sx={{ flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              {featureInfo.options.map(option => (
                <ToggleButton 
                  key={option.value} 
                  value={option.value.toString()}
                  sx={{ 
                    borderRadius: 1, 
                    m: 0.2,
                    minWidth: 0,
                    flex: '1 0 12%',
                    py: 0.75,
                    border: 1,
                    borderColor: 'divider',
                    '&.Mui-selected': {
                      bgcolor: option.value === 5 || option.value === 6 ? 'rgba(255, 152, 0, 0.12)' : 'rgba(33, 150, 243, 0.12)',
                      color: option.value === 5 || option.value === 6 ? '#ff9800' : '#1976d2',
                    }
                  }}
                >
                  <Tooltip title={option.fullLabel}>
                    <span>{option.label}</span>
                  </Tooltip>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <FormHelperText sx={{ mt: 1 }}>
              {formData[feature] !== undefined && formData[feature] !== '' ? 
                `Sélectionné: ${featureInfo.options.find(o => o.value === formData[feature])?.fullLabel}` : 
                'Sélectionnez un jour de la semaine'}
            </FormHelperText>
          </Box>
        );

      case 'frequency-selector':
  return fieldContainer(
    <Box
      sx={{
        width: '100%',
        maxWidth: 1000, // élargir jusqu'à 1000px max
        mt: 2,
        mx: 'auto',     // centré horizontalement
        px: 2           // padding horizontal
      }}
    >
      <Grid container spacing={10} justifyContent="space-between">
        {featureInfo.options.map(option => (
          <Grid item xs={15} sm={6} md={3} key={option.value}>
            <StyledFrequencyButton 
              value={option.value.toString()}
              selected={formData[feature] === option.value}
              onClick={() => handleFrequencyChange(feature, option.value)}
              disabled={loading}
              fullWidth
            >
              <FrequencyIcon value={option.label.toLowerCase()}>
                {option.icon}
              </FrequencyIcon>
              <Typography variant="caption" gutterBottom>
                {option.label}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.7rem' }}
              >
                {option.description}
              </Typography>
            </StyledFrequencyButton>
          </Grid>
        ))}
      </Grid>
      <FormHelperText sx={{ mt: 2 }}>
        {formData[feature] !== undefined
          ? `Fréquence: ${featureInfo.options.find(o => o.value === formData[feature])?.label}`
          : "Sélectionnez la fréquence d'utilisation"}
      </FormHelperText>
    </Box>
  );


      case 'duration-selector':
        return fieldContainer(
          <Box sx={{ width: '100%', mt: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={6} sm={3}>
                <StyledDurationButton 
                  value="short"
                  selected={formData[feature] === 1}
                  onClick={() => handleDurationChange(feature, "courte")}
                  disabled={loading}
                  fullWidth
                >
                  <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    1h
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Courte
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {'< 2h'}
                  </Typography>
                </StyledDurationButton>
              </Grid>
              <Grid item xs={6} sm={3}>
                <StyledDurationButton 
                  value="medium"
                  selected={formData[feature] === 3}
                  onClick={() => handleDurationChange(feature, "moyenne")}
                  disabled={loading}
                  fullWidth
                >
                  <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600 }}>
                    3h
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Moyenne
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {'2-4h'}
                  </Typography>
                </StyledDurationButton>
              </Grid>
              <Grid item xs={6} sm={3}>
                <StyledDurationButton 
                  value="long"
                  selected={formData[feature] === 5}
                  onClick={() => handleDurationChange(feature, "longue")}
                  disabled={loading}
                  fullWidth
                >
                  <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 600 }}>
                    5h
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Longue
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {'4-6h'}
                  </Typography>
                </StyledDurationButton>
              </Grid>
              <Grid item xs={6} sm={3}>
                <StyledDurationButton 
                  value="verylong"
                  selected={formData[feature] === 8}
                  onClick={() => handleDurationChange(feature, "très longue")}
                  disabled={loading}
                  fullWidth
                >
                  <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                    8h
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Très longue
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {'> 6h'}
                  </Typography>
                </StyledDurationButton>
              </Grid>
            </Grid>
            <FormHelperText sx={{ mt: 1 }}>
              {formData[feature] !== undefined ? 
                `Durée sélectionnée: ${formData[feature]} heures` : 
                'Sélectionnez la durée prévue'}
            </FormHelperText>
          </Box>
        );

      case 'select':
        return fieldContainer(
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id={`${feature}-label`}>{featureInfo.description}</InputLabel>
            <Select
              labelId={`${feature}-label`}
              name={feature}
              value={formData[feature] || ''}
              onChange={handleChange}
              disabled={loading}
              label={featureInfo.description}
            >
              {featureInfo.options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{featureInfo.description}</FormHelperText>
          </FormControl>
        );

      default:
        return fieldContainer(
          <TextField
            name={feature}
            label={featureInfo.description}
            value={formData[feature] || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            required
            variant="outlined"
            InputProps={{
              endAdornment: featureInfo.unit && (
                <InputAdornment position="end">
                  {featureInfo.unit}
                </InputAdornment>
              ),
              startAdornment: featureInfo.icon && (
                <InputAdornment position="start">
                  {React.cloneElement(featureInfo.icon, { fontSize: 'small' })}
                </InputAdornment>
              ),
            }}
            inputProps={{
              min: featureInfo.range ? featureInfo.range[0] : undefined,
              max: featureInfo.range ? featureInfo.range[1] : undefined,
              step: featureInfo.step || 1
            }}
            helperText={featureInfo.description}
            disabled={loading}
          />
        );
    }
  };

  if (!features || features.length === 0) {
    return (
      <ThemeProvider theme={formTheme}>
        <Card sx={{ height: '100%' }} className="card-hover">
          <CardHeader 
            title="Prédiction de durée" 
            subheader="Chargement des caractéristiques..." 
            avatar={<TimerIcon />}
          />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          </CardContent>
        </Card>
      </ThemeProvider>
    );
  }

  // Réorganiser les features pour un meilleur affichage
  const organizedFeatures = [...features].sort((a, b) => {
    // Ordre de priorité personnalisé
    const order = {
      'Weekday': 1,
      'Is_Weekend': 2,
      'Hour': 3,
      'User_Parking_History': 4,
      'Parking_Duration': 5,
      'Electric_Vehicle': 6,
      'Reserved_Status': 7,
      'Payment_Amount': 8,
      'Proximity_To_Exit': 9,
      'Weather_Temperature': 10,
      'Weather_Precipitation': 11
    };
    return (order[a] || 999) - (order[b] || 999);
  });

  return (
    <ThemeProvider theme={formTheme}>
      <Card sx={{ height: '100%' }} className="card-hover">
        <CardHeader 
          title="Prédiction de durée" 
          subheader="Prédire combien de temps un véhicule va rester dans le parking" 
          avatar={<TimerIcon />}
          action={
            <Tooltip title="Aide sur ce formulaire">
              <IconButton 
                aria-label="aide" 
                onClick={() => setExpandedHelp(!expandedHelp)}
                sx={{ color: 'white' }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent>
          {expandedHelp && (
            <Paper sx={{ mb: 3, p: 2.5, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Comment utiliser ce formulaire
              </Typography>
              <Typography variant="body2" paragraph>
                Ce formulaire vous permet de prédire la durée probable de stationnement d'un véhicule en fonction des caractéristiques que vous spécifiez.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Instructions :</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">
                    Renseignez les détails du stationnement (jour de la semaine, heure, etc.)
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">
                    Utilisez les icônes d'aide <HelpIcon fontSize="small" color="action" sx={{ verticalAlign: 'middle' }} /> pour comprendre l'impact de chaque paramètre
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body2">
                    Le résultat sera affiché en heures avec une précision de 2 décimales
                  </Typography>
                </Box>
              </Box>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => setExpandedHelp(false)}
                sx={{ mt: 1 }}
              >
                Fermer l'aide
              </Button>
            </Paper>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {organizedFeatures.map(feature => (
                <Grid 
                  item 
                  xs={12} 
                  sm={featureDescriptions[feature]?.type === 'day-selector' || 
                       featureDescriptions[feature]?.type === 'frequency-selector' || 
                       featureDescriptions[feature]?.type === 'duration-selector' ? 12 : 6}
                  md={featureDescriptions[feature]?.type === 'day-selector' || 
                      featureDescriptions[feature]?.type === 'frequency-selector' || 
                      featureDescriptions[feature]?.type === 'duration-selector' ? 12 : 4}
                  key={feature} 
                  sx={{ display: 'flex' }}
                >
                  {renderInputField(feature)}
                </Grid>
              ))}
              
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 3,
                    mb: 1 
                  }}
                >
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    disabled={!isFormValid || loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      fontSize: '1.1rem',
                      background: 'linear-gradient(45deg, #2196f3 30%, #03a9f4 90%)'
                    }}
                  >
                    {loading ? 'Prédiction en cours...' : 'Prédire la durée'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default ParkingDurationForm;
