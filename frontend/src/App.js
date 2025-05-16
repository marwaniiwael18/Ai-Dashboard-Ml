import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  Tabs, 
  Tab, 
  Paper,
  Alert,
  AlertTitle,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Button,
  CssBaseline,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery  // Ajout de l'import manquant
} from '@mui/material';
import axios from 'axios';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BugReportIcon from '@mui/icons-material/BugReport';
import ParkingIcon from '@mui/icons-material/LocalParking';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';

// Composants personnalisés
import ParkingDurationForm from './components/ParkingDurationForm';
import OccupancyPredictionForm from './components/OccupancyPredictionForm';
import ClusterPredictionForm from './components/ClusterPredictionForm';
import PredictionResult from './components/PredictionResult';
import ClusterResult from './components/ClusterResult';
import TestOccupancyModel from './components/TestOccupancyModel';
import TestClusterModel from './components/TestClusterModel';
import Header from './components/Header';
import Footer from './components/Footer';

// URL de l'API
// Utiliser la variable d'environnement REACT_APP_API_URL si elle existe, sinon utiliser localhost
const API_URL = process.env.REACT_APP_API_URL || 'https://smart-parking-api-xgay.onrender.com';

// Thème global personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 30px 0 rgba(0,0,0,0.15)',
            transform: 'translateY(-5px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 15px 0 rgba(0,0,0,0.07)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

// Composant simple de test de durée avec des scénarios prédéfinis
const TestDurationModel = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const scenarios = [
    {
      name: "Jour de semaine - Bureau",
      data: {
        "Hour": 9,
        "Weekday": 2,
        "Day": 2, // Ajout de la caractéristique Day
        "Is_Weekend": 0,
        "Electric_Vehicle": 0,
        "Reserved_Status": 1,
        "User_Parking_History": 15,
        "Parking_Duration": 5,
        "Payment_Amount": 15,
        "Proximity_To_Exit": 30,
        "Weather_Temperature": 22,
        "Weather_Precipitation": 0
      },
      description: "Un jour de semaine typique pour un travailleur de bureau"
    },
    {
      name: "Shopping weekend",
      data: {
        "Hour": 14,
        "Weekday": 6,
        "Day": 6, // Ajout de la caractéristique Day
        "Is_Weekend": 1,
        "Electric_Vehicle": 0,
        "Reserved_Status": 0,
        "User_Parking_History": 3,
        "Parking_Duration": 3,
        "Payment_Amount": 8,
        "Proximity_To_Exit": 15,
        "Weather_Temperature": 24,
        "Weather_Precipitation": 0
      },
      description: "Shopping du weekend, après-midi"
    },
    {
      name: "Soirée en semaine",
      data: {
        "Hour": 19,
        "Weekday": 4,
        "Day": 4, // Ajout de la caractéristique Day
        "Is_Weekend": 0,
        "Electric_Vehicle": 0,
        "Reserved_Status": 0,
        "User_Parking_History": 2,
        "Parking_Duration": 3,
        "Payment_Amount": 6,
        "Proximity_To_Exit": 20,
        "Weather_Temperature": 18,
        "Weather_Precipitation": 1
      },
      description: "Sortie en soirée pendant la semaine"
    },
    {
      name: "Véhicule électrique - longue durée",
      data: {
        "Hour": 10,
        "Weekday": 3,
        "Day": 3, // Ajout de la caractéristique Day
        "Is_Weekend": 0,
        "Electric_Vehicle": 1,
        "Reserved_Status": 1,
        "User_Parking_History": 8,
        "Parking_Duration": 8,
        "Payment_Amount": 25,
        "Proximity_To_Exit": 40,
        "Weather_Temperature": 20,
        "Weather_Precipitation": 0
      },
      description: "Véhicule électrique nécessitant une recharge complète"
    },
    {
      name: "Journée pluvieuse",
      data: {
        "Hour": 12,
        "Weekday": 5,
        "Day": 5, // Ajout de la caractéristique Day
        "Is_Weekend": 0,
        "Electric_Vehicle": 0,
        "Reserved_Status": 0,
        "User_Parking_History": 1,
        "Parking_Duration": 1,
        "Payment_Amount": 4,
        "Proximity_To_Exit": 10,
        "Weather_Temperature": 14,
        "Weather_Precipitation": 3
      },
      description: "Jour pluvieux avec précipitations importantes"
    }
  ];

  const handleRunTest = async (scenarioIndex) => {
    setLoading(true);
    try {
      const scenario = scenarios[scenarioIndex];
      console.log("Envoi de la requête avec données:", scenario.data);
      
      // Vérifier que toutes les caractéristiques requises sont présentes
      if (!scenario.data.Day) {
        console.warn("La caractéristique 'Day' est manquante ou nulle!");
      }
      
      const response = await axios.post(`${API_URL}/predict/duration`, scenario.data);
      console.log("Réponse reçue:", response.data);
      
      // Ajouter le résultat
      setResults([{
        scenario: scenario.name,
        data: scenario.data,
        result: response.data,
        timestamp: new Date().toISOString()
      }, ...results]);
      
      setError(null);
    } catch (err) {
      console.error("Erreur test:", err);
      // Afficher les détails de l'erreur pour un meilleur diagnostic
      const errorDetails = err.response?.data?.error || err.message || "Erreur inconnue";
      setError(`Erreur: ${errorDetails}. Vérifiez la console pour plus de détails.`);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    const newResults = [];
    
    try {
      for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        try {
          console.log(`Test ${i+1}/${scenarios.length}: ${scenario.name}`);
          console.log("Données:", scenario.data);
          const response = await axios.post(`${API_URL}/predict/duration`, scenario.data);
          
          newResults.push({
            scenario: scenario.name,
            data: scenario.data,
            result: response.data,
            timestamp: new Date().toISOString()
          });
          console.log(`Test ${i+1} réussi:`, response.data);
        } catch (testErr) {
          console.error(`Erreur dans le scénario ${scenario.name}:`, testErr);
          console.error("Message:", testErr.message);
          console.error("Réponse:", testErr.response?.data);
          // Continuer avec le prochain scénario malgré l'erreur
        }
      }
      
      if (newResults.length > 0) {
        setResults([...newResults, ...results]);
        setError(null);
      } else {
        setError("Tous les scénarios ont échoué. Vérifiez la console pour plus de détails.");
      }
    } catch (err) {
      console.error("Erreur globale:", err);
      setError(`Erreur générale: ${err.message}. ${err.response?.data?.error || ""}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Test du Modèle de Durée
      </Typography>
      <Typography paragraph>
        Testez le modèle de prédiction de durée avec divers scénarios prédéfinis.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Erreur</AlertTitle>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scénarios de test
            </Typography>
            
            <List>
              {scenarios.map((scenario, index) => (
                <ListItem 
                  key={index}
                  secondaryAction={
                    <Button 
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleRunTest(index)}
                      disabled={loading}
                    >
                      {loading ? "En cours..." : "Tester"}
                    </Button>
                  }
                >
                  <ListItemIcon>
                    <AccessTimeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={scenario.name} 
                    secondary={scenario.description}
                  />
                </ListItem>
              ))}
            </List>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={runAllTests}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ mt: 2 }}
            >
              Tester tous les scénarios
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" gutterBottom>
                Résultats
              </Typography>
              
              {results.length > 0 && (
                <Button 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  onClick={() => setResults([])}
                >
                  Effacer
                </Button>
              )}
            </Box>
            
            {results.length > 0 ? (
              <PredictionResult data={results} resultType="duration" />
            ) : (
              <Box sx={{ 
                p: 4, 
                textAlign: 'center', 
                bgcolor: 'rgba(0,0,0,0.03)',
                borderRadius: 1 
              }}>
                <AccessTimeIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                <Typography variant="body1" sx={{ mt: 1 }} color="text.secondary">
                  Aucun test n'a encore été effectué ou les résultats sont vides.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                  Sélectionnez un scénario à tester dans la liste ci-contre.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

function App() {
  const [durationFeatures, setDurationFeatures] = useState([]);
  const [occupancyFeatures, setOccupancyFeatures] = useState([]);
  const [durationResult, setDurationResult] = useState(null);
  const [occupancyResult, setOccupancyResult] = useState(null);
  const [clusterResult, setClusterResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [activeTab, setActiveTab] = useState(0);
  const [activeModelTab, setActiveModelTab] = useState(0);
  const [showProjectInfo, setShowProjectInfo] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Vérifier si l'API est disponible
  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`);
        if (response.data.status === 'ok') {
          setApiStatus('connected');
          
          // Récupérer les caractéristiques des modèles
          const featuresResponse = await axios.get(`${API_URL}/features`);
          setDurationFeatures(featuresResponse.data.regression_features);
          setOccupancyFeatures(featuresResponse.data.classification_features);
        } else {
          setApiStatus('error');
          setError('API disponible mais les modèles ne sont pas chargés.');
        }
      } catch (err) {
        setApiStatus('disconnected');
        setError('Impossible de se connecter à l\'API. Veuillez vérifier que le serveur Flask est en cours d\'exécution.');
      }
    };
    
    checkApi();
  }, []);

  // Fonction pour prédire la durée de stationnement
  const predictDuration = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict/duration`, formData);
      setDurationResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la prédiction de la durée.');
      setDurationResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour prédire l'occupation
  const predictOccupancy = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict/occupancy`, formData);
      setOccupancyResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la prédiction de l\'occupation.');
      setOccupancyResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour prédire le cluster
  const predictCluster = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict/cluster`, formData);
      setClusterResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la prédiction du cluster.');
      setClusterResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header apiStatus={apiStatus} />
      
<Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Section d'information sur le projet */}
        {showProjectInfo && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 3, 
              borderRadius: 3,
              backgroundImage: 'linear-gradient(to right, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.1))',
              border: '1px solid rgba(25, 118, 210, 0.2)'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              justifyContent: 'space-between', 
              mb: 2 
            }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: 'primary.main', 
                  m: 0,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
               Parkini Smart Parking Analytics
              </Typography>
              <IconButton 
                onClick={() => setShowProjectInfo(false)} 
                sx={{ 
                  mt: { xs: 1, sm: 0 },
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' }
                }}
              >
                <InfoIcon color="primary" />
              </IconButton>
            </Box>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              Bienvenue dans notre système de prédiction intelligent pour les parkings. Cette application utilise 
              l'apprentissage automatique pour optimiser la gestion des stationnements en prédisant la durée de 
              stationnement, l'occupation des places, et en identifiant les profils comportementaux des utilisateurs.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={1} sx={{ p: 2, height: '100%', borderLeft: '4px solid #1976d2' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Prédiction de Durée</Typography>
                  </Box>
                  <Typography variant="body2">
                    Estimez combien de temps un véhicule restera stationné en fonction de divers facteurs comme 
                    l'heure d'arrivée, le jour de la semaine et les caractéristiques du véhicule.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={1} sx={{ p: 2, height: '100%', borderLeft: '4px solid #f44336' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ParkingIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">Prédiction d'Occupation</Typography>
                  </Box>
                  <Typography variant="body2">
                    Prévoyez si une place de parking sera occupée ou libre à un moment donné, 
                    permettant une meilleure allocation des ressources.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={1} sx={{ p: 2, height: '100%', borderLeft: '4px solid #4caf50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CategoryIcon sx={{ mr: 1, color: '#4caf50' }} />
                    <Typography variant="h6">Analyse Comportementale</Typography>
                  </Box>
                  <Typography variant="body2">
                    Identifiez les différents profils d'utilisateurs de parking pour adapter 
                    vos services et votre tarification en conséquence.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}
        
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            mb: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 2,
            '& .MuiTab-root': {
              py: 1.5
            }
          }}
        >
          <Tab 
            label="Dashboard" 
            icon={<DashboardIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label="Test des Modèles" 
            icon={<BugReportIcon />} 
            iconPosition="start" 
          />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  mb: { xs: 1, sm: 0 },
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                Dashboard Smart Parking
              </Typography>
              
              
             
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>Erreur</AlertTitle>
                {error}
              </Alert>
            )}
            
            {apiStatus === 'checking' && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                <CircularProgress />
              </Box>
            )}
            
            {apiStatus === 'connected' && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4} xl={4}>
                    <ParkingDurationForm 
                      onSubmit={predictDuration}
                      loading={loading}
                      features={durationFeatures}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={4}>
                    <OccupancyPredictionForm
                      onSubmit={predictOccupancy}
                      loading={loading}
                      features={occupancyFeatures}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={4}>
                    <ClusterPredictionForm
                      onSubmit={predictCluster}
                      loading={loading}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4 }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      mb: 3, 
                      bgcolor: 'rgba(0,0,0,0.02)', 
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <DashboardIcon sx={{ mr: 1 }} />
                      Résultats des prédictions
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6} lg={4}>
                        <PredictionResult 
                          title="Durée de stationnement"
                          durationResult={durationResult}
                          resultType="duration"
                          loading={loading}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={4}>
                        <PredictionResult 
                          title="Occupation des places"
                          occupancyResult={occupancyResult}
                          resultType="occupancy"
                          loading={loading}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={4}>
                        <ClusterResult 
                          result={clusterResult}
                          loading={loading}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  mb: { xs: 1, sm: 0 },
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                Test des Modèles
              </Typography>
            </Box>
            
            <Paper 
              elevation={1} 
              sx={{ 
                p: { xs: 1, sm: 2 }, 
                mb: 3, 
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Tabs
                value={activeModelTab}
                onChange={(e, value) => setActiveModelTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  mb: 2,
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  '& .MuiTab-root': {
                    fontWeight: 500,
                    py: 1.5
                  }
                }}
              >
                <Tab label="Occupation" icon={<ParkingIcon />} iconPosition="start" />
                <Tab label="Clustering" icon={<GroupIcon />} iconPosition="start" />
                <Tab label="Durée" icon={<AccessTimeIcon />} iconPosition="start" />
              </Tabs>
              
              <Box sx={{ p: { xs: 1, sm: 2 } }}>
                {activeModelTab === 0 && <TestOccupancyModel />}
                {activeModelTab === 1 && <TestClusterModel />}
                {activeModelTab === 2 && <TestDurationModel />}
              </Box>
            </Paper>
          </Box>
        )}
      </Container>
      
      <Footer />
    </ThemeProvider>
  );
}

export default App;
