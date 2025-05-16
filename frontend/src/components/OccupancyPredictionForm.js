import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  TextField, 
  Button, 
  Box,
  CircularProgress,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Tooltip,
  IconButton,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Stack,
  Chip,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
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
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';

// Thème personnalisé pour les formulaires
const formTheme = createTheme({
  components: {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#f44336',
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
            boxShadow: '0px 0px 0px 8px rgba(244, 67, 54, 0.16)',
          },
        },
        valueLabel: {
          backgroundColor: '#f44336',
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
          background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
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
            backgroundColor: 'rgba(244, 67, 54, 0.12)',
            color: '#d32f2f',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.2)',
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
    backgroundColor: 'rgba(244, 67, 54, 0.12)',
    borderColor: theme.palette.error.main
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

// Descriptions des champs et valeurs recommandées pour la prédiction d'occupation
const featureDescriptions = {
  'Hour': {
    description: 'Heure d\'arrivée',
    type: 'select',
    options: Array.from({ length: 24 }, (_, i) => ({ 
      value: i, 
      label: `${i}:00` 
    })),
    defaultValue: 12,
    icon: <AccessTimeIcon color="error" />,
    detailedDesc: 'L\'heure d\'arrivée au parking influence directement la probabilité d\'occupation des places. Les heures de pointe sont généralement plus chargées.'
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
    icon: <CalendarMonthIcon color="error" />,
    detailedDesc: 'Les taux d\'occupation varient considérablement selon le jour de la semaine. Les jours ouvrés ont tendance à être plus occupés que les weekends dans certaines zones.'
  },
  'Is_Weekend': {
    description: 'Jour de weekend',
    type: 'boolean',
    options: [
      { value: 0, label: 'Jour de semaine' },
      { value: 1, label: 'Weekend' }
    ],
    defaultValue: 0,
    icon: <WeekendIcon color="error" />,
    detailedDesc: 'Les weekends ont généralement des taux d\'occupation différents des jours de semaine, selon le type de zone (commerciale, résidentielle, etc.).'
  },
  'Parking_Duration': {
    description: 'Durée prévue',
    range: [0.5, 8],
    step: 0.5,
    type: 'slider',
    unit: 'h',
    defaultValue: 2,
    icon: <AccessTimeIcon color="error" />,
    detailedDesc: 'La durée prévue de stationnement affecte la probabilité qu\'une place soit occupée à un moment donné.'
  },
  'Electric_Vehicle': {
    description: 'Véhicule électrique',
    type: 'boolean',
    options: [
      { value: 0, label: 'Non' },
      { value: 1, label: 'Oui' }
    ],
    defaultValue: 0,
    icon: <ElectricCarIcon color="error" />,
    detailedDesc: 'Les places pour véhicules électriques ont des taux d\'occupation différents des places standard.'
  },
  'Reserved_Status': {
    description: 'Place réservée',
    type: 'boolean',
    options: [
      { value: 0, label: 'Non ' },
      { value: 1, label: 'Oui' }
    ],
    defaultValue: 0,
    icon: <BookmarkIcon color="error" />,
    detailedDesc: 'Les places réservées ont généralement des taux d\'occupation plus prévisibles.'
  },
  'Entry_Time_Minutes': {
    description: 'Heure d\'entrée (minutes)',
    range: [0, 1440],
    step: 30,
    type: 'time-selector',
    defaultValue: 720, // 12:00 (midi)
    icon: <AccessTimeIcon color="error" />,
    detailedDesc: 'L\'heure d\'entrée exprimée en minutes depuis minuit (0-1439).'
  },
  'Exit_Time_Minutes': {
    description: 'Heure de sortie (minutes)',
    range: [0, 1440],
    step: 30,
    type: 'time-selector',
    defaultValue: 900, // 15:00 (15h)
    icon: <AccessTimeIcon color="error" />,
    detailedDesc: 'L\'heure de sortie prévue exprimée en minutes depuis minuit (0-1439).'
  },
  'User_Parking_History': {
    description: 'Fréquence d\'utilisation',
    type: 'frequency-selector',
    options: [
      { value: 1, label: 'Rare', description: '1-2 visites' },
      { value: 5, label: 'Occasionnel', description: '3-7 visites' },
      { value: 15, label: 'Régulier', description: '8-20 visites' },
      { value: 30, label: 'Fréquent', description: '20+ visites' }
    ],
    defaultValue: 5,
    icon: <AccountCircleIcon color="error" />,
    detailedDesc: 'Le nombre de visites précédentes de cet utilisateur. Les utilisateurs réguliers ont souvent des comportements de stationnement prévisibles.'
  },
  'Payment_Amount': {
    description: 'Montant du paiement',
    range: [0, 50],
    step: 0.5,
    type: 'number',
    unit: '€',
    defaultValue: 10,
    icon: <EuroIcon color="error" />,
    detailedDesc: 'Le montant payé peut indiquer l\'intention de l\'utilisateur concernant la durée de stationnement.'
  },
  'Proximity_To_Exit': {
    description: 'Distance à la sortie',
    range: [1, 100],
    step: 1,
    type: 'number',
    unit: 'm',
    defaultValue: 25,
    icon: <LocationOnIcon color="error" />,
    detailedDesc: 'La distance de la place à la sortie la plus proche. Les places plus proches de la sortie sont souvent plus demandées.'
  }
};

function OccupancyPredictionForm({ onSubmit, loading, features }) {
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

  const handleTimeChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });

    // Si c'est l'entrée et que la sortie existe, mettre à jour la sortie si nécessaire
    if (name === 'Entry_Time_Minutes' && formData.Exit_Time_Minutes !== undefined) {
      if (value >= formData.Exit_Time_Minutes) {
        // Ajouter 60 minutes à l'heure d'entrée pour l'heure de sortie
        setFormData(prevData => ({
          ...prevData,
          'Exit_Time_Minutes': Math.min(value + 60, 1440)
        }));
      }
    }
    // Si c'est la sortie et que l'entrée existe, mettre à jour l'entrée si nécessaire
    else if (name === 'Exit_Time_Minutes' && formData.Entry_Time_Minutes !== undefined) {
      if (value <= formData.Entry_Time_Minutes) {
        // Soustraire 60 minutes de l'heure de sortie pour l'heure d'entrée
        setFormData(prevData => ({
          ...prevData,
          'Entry_Time_Minutes': Math.max(value - 60, 0)
        }));
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

  // Convertir les minutes en format heure:minute
  const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Convertir le format heure:minute en minutes
  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
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
          {featureInfo.icon || <DirectionsCarIcon color="error" />}
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
                  color="error" 
                  variant="outlined" 
                />
              </Grid>
            </Grid>
            <FormHelperText>{featureInfo.description}</FormHelperText>
          </Box>
        );

      case 'time-selector':
        const timeValue = formData[feature] !== undefined ? formatMinutesToTime(formData[feature]) : '00:00';
        return fieldContainer(
          <Box sx={{ width: '100%', mt: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={24}>
                <TextField
                  type="time"
                  value={timeValue}
                  onChange={(e) => handleTimeChange(feature, parseTimeToMinutes(e.target.value))}
                  fullWidth
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {feature.includes('Entry') ? 'Entrée:' : 'Sortie:'}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Chip 
                  label={`${Math.floor(formData[feature] / 60)}h${formData[feature] % 60}`} 
                  color="error" 
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
            <FormHelperText>
              {feature === 'Entry_Time_Minutes' ? 
                `Heure d'entrée: ${formatMinutesToTime(formData[feature] || 0)}` : 
                `Heure de sortie: ${formatMinutesToTime(formData[feature] || 0)}`}
            </FormHelperText>
            
            {/* Slider visuel pour mieux visualiser l'heure dans la journée */}
            <Box sx={{ mt: 2, mb: 1, px: 1 }}>
              <Slider
                value={formData[feature] || 0}
                onChange={(_, value) => handleTimeChange(feature, value)}
                min={0}
                max={1440}
                step={30}
                marks={[
                  { value: 0, label: '00h' },
                  { value: 360, label: '06h' },
                  { value: 720, label: '12h' },
                  { value: 1080, label: '18h' },
                  { value: 1440, label: '24h' }
                ]}
                disabled={loading}
                valueLabelFormat={(value) => formatMinutesToTime(value)}
                valueLabelDisplay="auto"
              />
            </Box>
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
                color="error"
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
                      bgcolor: option.value === 5 || option.value === 6 ? 'rgba(255, 152, 0, 0.12)' : 'rgba(244, 67, 54, 0.12)',
                      color: option.value === 5 || option.value === 6 ? '#ff9800' : '#f44336',
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
            title="Prédiction d'occupation" 
            subheader="Chargement des caractéristiques..." 
            avatar={<DirectionsCarIcon />}
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
      'Entry_Time_Minutes': 4,
      'Exit_Time_Minutes': 5,
      'User_Parking_History': 6,
      'Parking_Duration': 7,
      'Electric_Vehicle': 8,
      'Reserved_Status': 9,
      'Payment_Amount': 10,
      'Proximity_To_Exit': 11
    };
    return (order[a] || 999) - (order[b] || 999);
  });

  return (
    <ThemeProvider theme={formTheme}>
      <Card sx={{ height: '100%' }} className="card-hover">
        <CardHeader 
          title="Prédiction d'occupation" 
          subheader="Prédire si une place de parking sera occupée ou libre" 
          avatar={<DirectionsCarIcon />}
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
            <Paper sx={{ mb: 3, p: 2.5, bgcolor: '#fef6f5', borderRadius: 2, border: '1px solid rgba(244, 67, 54, 0.1)' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Comment utiliser ce formulaire
              </Typography>
              <Typography variant="body2" paragraph>
                Ce formulaire vous permet de prédire la probabilité qu'une place de stationnement soit occupée en fonction des caractéristiques que vous spécifiez.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Instructions :</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">
                    Renseignez les détails du stationnement (jour, heure, type de véhicule, etc.)
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">
                    Utilisez les icônes d'aide <HelpIcon fontSize="small" color="action" sx={{ verticalAlign: 'middle' }} /> pour comprendre l'impact de chaque paramètre
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body2">
                    Le résultat indiquera si la place sera probablement occupée ou libre, avec une estimation de probabilité
                  </Typography>
                </Box>
              </Box>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => setExpandedHelp(false)}
                color="error"
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
                       featureDescriptions[feature]?.type === 'time-selector' ? 12 : 6}
                  md={featureDescriptions[feature]?.type === 'day-selector' || 
                      featureDescriptions[feature]?.type === 'frequency-selector' ? 12 : 
                      featureDescriptions[feature]?.type === 'time-selector' ? 6 : 4}
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
                    color="error" 
                    type="submit"
                    disabled={!isFormValid || loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      fontSize: '1.1rem',
                      background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)'
                    }}
                  >
                    {loading ? 'Prédiction en cours...' : 'Prédire l\'occupation'}
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

export default OccupancyPredictionForm;
