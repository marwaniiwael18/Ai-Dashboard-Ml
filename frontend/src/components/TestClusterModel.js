import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button, 
  Box, 
  CircularProgress, 
  Grid, 
  Typography, 
  Paper, 
  Divider, 
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Slider, 
  Chip, 
  Tooltip, 
  ThemeProvider, 
  createTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Avatar,
  TextField,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import axios from 'axios';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import TimerIcon from '@mui/icons-material/Timer';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RefreshIcon from '@mui/icons-material/Refresh';

// URL de l'API
// Utiliser la variable d'environnement REACT_APP_API_URL si elle existe, sinon utiliser localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Thème personnalisé pour les tests de clustering
const clusterTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
          overflow: 'visible'
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          borderRadius: '12px 12px 0 0',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          overflow: 'hidden',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
            '&:first-of-type': {
              marginTop: 0,
            },
          },
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500
        }
      }
    }
  },
});

// Scénarios de test prédéfinis pour le clustering
const clusterTestScenarios = [
  {
    name: "Client Premium",
    data: {
      "Parking_Duration": 3.0,
      "Payment_Amount": 25.0,
      "User_Parking_History": 30,
      "Proximity_To_Exit": 5
    },
    description: "Client fidèle avec stationnement proche des sorties et dépensant beaucoup."
  },
  {
    name: "Utilisateur Occasionnel",
    data: {
      "Parking_Duration": 1.0,
      "Payment_Amount": 5.0,
      "User_Parking_History": 2,
      "Proximity_To_Exit": 75
    },
    description: "Client occasionnel avec stationnement court et économique."
  },
  {
    name: "Séjour Longue Durée",
    data: {
      "Parking_Duration": 7.0,
      "Payment_Amount": 35.0,
      "User_Parking_History": 8,
      "Proximity_To_Exit": 40
    },
    description: "Client qui stationne pour une longue durée avec un budget conséquent."
  },
  {
    name: "Utilisateur Régulier",
    data: {
      "Parking_Duration": 2.0,
      "Payment_Amount": 10.0,
      "User_Parking_History": 15,
      "Proximity_To_Exit": 30
    },
    description: "Client régulier avec stationnement modéré et tarif standard."
  }
];

// Ajout d'un scénario aléatoire
const generateRandomClusterData = () => {
  return {
    "Parking_Duration": Math.round((Math.random() * 7.5 + 0.5) * 2) / 2, // Entre 0.5 et 8 par incréments de 0.5
    "Payment_Amount": Math.floor(Math.random() * 40) + 1, // Entre 1 et 40
    "User_Parking_History": Math.floor(Math.random() * 50), // Entre 0 et 50
    "Proximity_To_Exit": Math.floor(Math.random() * 100) + 1 // Entre 1 et 100
  };
};

// Ajouter un scénario aléatoire à la liste
clusterTestScenarios.push({
  name: "Scénario Aléatoire",
  data: generateRandomClusterData(),
  description: "Paramètres générés aléatoirement pour tester le comportement du modèle."
});

// Profils des clusters avec leur description
const clusterProfiles = [
  {
    name: "Court séjour économique",
    description: "Utilisateurs privilégiant des stationnements courts, payant peu et souvent éloignés des sorties.",
    color: "#2196f3"
  },
  {
    name: "Longue durée premium",
    description: "Utilisateurs stationnant pour de longues durées, avec un budget plus important.",
    color: "#ff9800"
  },
  {
    name: "Habitués fidèles",
    description: "Utilisateurs fréquents du parking, avec un historique de visites élevé.",
    color: "#4caf50"
  },
  {
    name: "Proximité & confort",
    description: "Utilisateurs privilégiant les places proches des sorties, peu importe le coût.",
    color: "#e91e63"
  }
];

// Labels pour les caractéristiques
const featureLabels = {
  "Parking_Duration": "Durée de stationnement (h)",
  "Payment_Amount": "Montant payé (€)",
  "User_Parking_History": "Historique de visites",
  "Proximity_To_Exit": "Distance à la sortie (m)"
};

// Configurations des sliders
const sliderConfigs = {
  "Parking_Duration": { min: 0.5, max: 8, step: 0.5 },
  "Payment_Amount": { min: 1, max: 40, step: 1 },
  "User_Parking_History": { min: 0, max: 50, step: 1 },
  "Proximity_To_Exit": { min: 1, max: 100, step: 1 }
};

function TestClusterModel() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [testData, setTestData] = useState(clusterTestScenarios[0].data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    "Parking_Duration": 2.0,
    "Payment_Amount": 10.0,
    "User_Parking_History": 5,
    "Proximity_To_Exit": 30
  });

  // Fonction pour exécuter le test
  const handleRunTest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict/cluster`, testData);
      
      // Ajouter le nouveau résultat au début de la liste
      const newResult = {
        timestamp: new Date().toISOString(),
        scenario: clusterTestScenarios[selectedScenario].name,
        data: {...testData},
        result: response.data
      };
      
      setResults([newResult, ...results]);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de l\'analyse du cluster.');
    } finally {
      setLoading(false);
    }
  };

  // Gérer les changements de scénario
  const handleChangeScenario = (index) => {
    setSelectedScenario(index);
    setTestData(clusterTestScenarios[index].data);
  };

  // Gérer les changements de valeurs dans les sliders
  const handleSliderChange = (feature) => (event, newValue) => {
    setTestData({
      ...testData,
      [feature]: newValue
    });
  };

  // Réinitialiser le scénario aléatoire
  const handleGenerateRandomScenario = () => {
    const randomData = generateRandomClusterData();
    // Mettre à jour le scénario aléatoire existant
    clusterTestScenarios[clusterTestScenarios.length - 1].data = randomData;
    // Si le scénario aléatoire est sélectionné, mettre à jour les données de test
    if (selectedScenario === clusterTestScenarios.length - 1) {
      setTestData(randomData);
    }
  };

  // Exécuter tous les tests
  const runAllTests = async () => {
    setLoading(true);
    try {
      const allResults = [];
      
      // Tester chaque scénario
      for (let i = 0; i < clusterTestScenarios.length; i++) {
        const scenario = clusterTestScenarios[i];
        const response = await axios.post(`${API_URL}/predict/cluster`, scenario.data);
        
        allResults.push({
          timestamp: new Date().toISOString(),
          scenario: scenario.name,
          data: {...scenario.data},
          result: response.data
        });
      }
      
      // Mettre à jour les résultats
      setResults([...allResults, ...results]);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de l\'analyse des clusters.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour effacer les résultats
  const clearResults = () => {
    setResults([]);
  };

  // Gérer les changements dans le formulaire de prédiction personnalisée
  const handleFormChange = (feature) => (event) => {
    const value = Number(event.target.value);
    setFormData({
      ...formData,
      [feature]: value
    });
  };

  // Soumettre le formulaire de prédiction personnalisée
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict/cluster`, formData);
      
      const newResult = {
        timestamp: new Date().toISOString(),
        scenario: "Prédiction Personnalisée",
        data: {...formData},
        result: response.data
      };
      
      setResults([newResult, ...results]);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de l\'analyse du cluster.');
    } finally {
      setLoading(false);
    }
  };

  // Gestion du changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={clusterTheme}>
      <Card sx={{ mb: 3 }} elevation={3}>
        <CardHeader
          title="Test du Modèle de Clustering"
          subheader="Identifiez le profil comportemental des utilisateurs du parking"
          avatar={<GroupIcon />}
          sx={{
            background: 'linear-gradient(90deg, #00897b 0%, #009688 100%)',
            color: 'white',
            '& .MuiCardHeader-subheader': {
              color: 'rgba(255,255,255,0.7)'
            }
          }}
        />
        
        <CardContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab icon={<CategoryIcon />} iconPosition="start" label="Scénarios prédéfinis" />
              <Tab icon={<GroupIcon />} iconPosition="start" label="Prédiction personnalisée" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <CategoryIcon sx={{ mr: 1 }} color="primary" /> Scénarios de Test
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    {clusterTestScenarios.map((scenario, index) => (
                      <Accordion 
                        key={index}
                        expanded={selectedScenario === index}
                        onChange={() => handleChangeScenario(index)}
                        sx={{ 
                          mb: 1,
                          boxShadow: selectedScenario === index 
                            ? '0 4px 12px rgba(0,0,0,0.15)' 
                            : '0 1px 4px rgba(0,0,0,0.1)',
                          bgcolor: selectedScenario === index 
                            ? 'rgba(0,150,136,0.05)' 
                            : 'white'
                        }}
                        elevation={selectedScenario === index ? 2 : 1}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`scenario-${index}-content`}
                          id={`scenario-${index}-header`}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: selectedScenario === index ? 'primary.main' : 'grey.300',
                                color: 'white',
                                width: 32,
                                height: 32,
                                mr: 2,
                                fontSize: '0.9rem'
                              }}
                            >
                              {index + 1}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {scenario.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {scenario.description}
                              </Typography>
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* Sliders pour ajuster les paramètres */}
                          {Object.entries(testData).map(([feature, value]) => (
                            <Box key={feature} sx={{ mb: 3 }}>
                              <Typography id={`${feature}-slider-label`} gutterBottom>
                                {featureLabels[feature]}: <strong>{value}</strong>
                                {feature === "Payment_Amount" && " €"}
                                {feature === "Proximity_To_Exit" && " m"}
                                {feature === "Parking_Duration" && " h"}
                              </Typography>
                              <Slider
                                value={value}
                                onChange={handleSliderChange(feature)}
                                aria-labelledby={`${feature}-slider-label`}
                                min={sliderConfigs[feature].min}
                                max={sliderConfigs[feature].max}
                                step={sliderConfigs[feature].step}
                                marks={[
                                  { value: sliderConfigs[feature].min, label: `${sliderConfigs[feature].min}` },
                                  { value: sliderConfigs[feature].max, label: `${sliderConfigs[feature].max}` }
                                ]}
                                valueLabelDisplay="auto"
                                color="primary"
                              />
                            </Box>
                          ))}
                          
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleRunTest}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            fullWidth
                            sx={{ mt: 2 }}
                          >
                            {loading ? "Analyse en cours..." : "Analyser ce profil"}
                          </Button>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleGenerateRandomScenario}
                        fullWidth
                        startIcon={<RefreshIcon />}
                      >
                        Nouveau scénario aléatoire
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={runAllTests}
                        disabled={loading}
                        fullWidth
                      >
                        Tester tous les scénarios
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2, minHeight: 400 }}>
                  {/* ... Existing code for displaying results ... */}
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <GroupIcon sx={{ mr: 1 }} color="primary" /> Résultats de Clustering
                  </Typography>
                  
                  {results.length > 0 ? (
                    <Box>
                      <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.1)' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Dernier résultat: <strong>{results[0].scenario}</strong>
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                          <Chip
                            label={`Cluster ${results[0].result.cluster + 1}`}
                            color="primary"
                            sx={{ 
                              fontSize: '1rem', 
                              fontWeight: 'bold',
                              mb: 1,
                              px: 2,
                              py: 3,
                              bgcolor: clusterProfiles[results[0].result.cluster]?.color
                            }}
                          />
                          <Typography variant="body1" color="text.secondary" gutterBottom>
                            {results[0].result.profile}
                          </Typography>
                          
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">
                              Indice de confiance: <strong>{Math.round(results[0].result.confidence * 100)}%</strong>
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={results[0].result.confidence * 100} 
                              sx={{ height: 10, borderRadius: 5, mt: 1, mb: 2 }} 
                            />
                          </Box>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Historique des tests ({results.length})
                      </Typography>
                      
                      <TableContainer sx={{ maxHeight: 300, mt: 1 }}>
                        <Table size="small" stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>Scénario</TableCell>
                              <TableCell>Cluster</TableCell>
                              <TableCell>Profil</TableCell>
                              <TableCell align="right">Confiance</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {results.map((result, index) => (
                              <TableRow key={index} hover>
                                <TableCell>{result.scenario}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={`C${result.result.cluster + 1}`} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: clusterProfiles[result.result.cluster]?.color || 'primary.main',
                                      color: 'white'
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{result.result.profile}</TableCell>
                                <TableCell align="right">{Math.round(result.result.confidence * 100)}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      {results.length > 1 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Répartition des clusters
                          </Typography>
                          
                          <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                            <PieChart
                              series={[
                                {
                                  data: Array.from({ length: 4 }, (_, i) => ({
                                    id: i,
                                    value: results.filter(r => r.result.cluster === i).length,
                                    label: `Cluster ${i+1}`,
                                    color: clusterProfiles[i]?.color
                                  })).filter(item => item.value > 0),
                                  innerRadius: 30,
                                  outerRadius: 80,
                                  paddingAngle: 2,
                                  cornerRadius: 4,
                                }
                              ]}
                              width={300}
                              height={200}
                            />
                          </Box>
                        </Box>
                      )}
                      
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={clearResults}
                        >
                          Effacer les résultats
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: 400,
                      bgcolor: 'rgba(0,0,0,0.02)',
                      borderRadius: 2,
                      p: 3
                    }}>
                      <GroupIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
                      <Typography variant="body1" align="center" color="text.secondary">
                        Aucun test n'a encore été effectué
                      </Typography>
                      <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
                        Sélectionnez un scénario et cliquez sur "Analyser" pour commencer
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Formulaire de prédiction de cluster
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Entrez les caractéristiques du comportement utilisateur pour identifier son profil.
                  </Typography>
                  
                  <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          label={featureLabels["Parking_Duration"]}
                          type="number"
                          fullWidth
                          value={formData["Parking_Duration"]}
                          onChange={handleFormChange("Parking_Duration")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <TimerIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">h</InputAdornment>
                            ),
                          }}
                          inputProps={{
                            min: sliderConfigs["Parking_Duration"].min,
                            max: sliderConfigs["Parking_Duration"].max,
                            step: sliderConfigs["Parking_Duration"].step
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          label={featureLabels["Payment_Amount"]}
                          type="number"
                          fullWidth
                          value={formData["Payment_Amount"]}
                          onChange={handleFormChange("Payment_Amount")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PaymentIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">€</InputAdornment>
                            ),
                          }}
                          inputProps={{
                            min: sliderConfigs["Payment_Amount"].min,
                            max: sliderConfigs["Payment_Amount"].max,
                            step: sliderConfigs["Payment_Amount"].step
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          label={featureLabels["User_Parking_History"]}
                          type="number"
                          fullWidth
                          value={formData["User_Parking_History"]}
                          onChange={handleFormChange("User_Parking_History")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <HistoryIcon />
                              </InputAdornment>
                            ),
                          }}
                          inputProps={{
                            min: sliderConfigs["User_Parking_History"].min,
                            max: sliderConfigs["User_Parking_History"].max,
                            step: sliderConfigs["User_Parking_History"].step
                          }}
                          helperText="Nombre de visites précédentes"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          label={featureLabels["Proximity_To_Exit"]}
                          type="number"
                          fullWidth
                          value={formData["Proximity_To_Exit"]}
                          onChange={handleFormChange("Proximity_To_Exit")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOnIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">m</InputAdornment>
                            ),
                          }}
                          inputProps={{
                            min: sliderConfigs["Proximity_To_Exit"].min,
                            max: sliderConfigs["Proximity_To_Exit"].max,
                            step: sliderConfigs["Proximity_To_Exit"].step
                          }}
                          helperText="Distance de la place à la sortie la plus proche"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          fullWidth
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                          sx={{ mt: 2 }}
                        >
                          {loading ? "Analyse en cours..." : "Analyser le profil utilisateur"}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Informations sur les profils
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {clusterProfiles.map((profile, index) => (
                      <Grid item xs={12} key={index}>
                        <Paper 
                          elevation={1} 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            borderLeft: `4px solid ${profile.color}`,
                            mb: 1
                          }}
                        >
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Cluster {index + 1}: {profile.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {profile.description}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Le modèle de clustering utilise un algorithme K-means pour regrouper les utilisateurs en fonction de leurs habitudes de stationnement.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Les caractéristiques utilisées sont la durée de stationnement, le montant payé, l'historique d'utilisation et la préférence de proximité aux sorties.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      
      {results.length > 0 && (
        <Card sx={{ mb: 3 }} elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Analyse des caractéristiques par cluster
            </Typography>
            
            <Box sx={{ height: 350, mt: 3 }}>
              <BarChart
                dataset={Object.entries(featureLabels).map(([key, label]) => {
                  const values = {};
                  
                  // Calculer la moyenne pour chaque caractéristique par cluster
                  for (let i = 0; i < 4; i++) {
                    const clusterResults = results.filter(r => r.result.cluster === i);
                    if (clusterResults.length > 0) {
                      values[`Cluster ${i+1}`] = clusterResults.reduce((sum, item) => 
                        sum + item.data[key], 0) / clusterResults.length;
                    } else {
                      values[`Cluster ${i+1}`] = 0;
                    }
                  }
                  
                  return {
                    feature: label,
                    ...values
                  };
                })}
                xAxis={[{ scaleType: 'band', dataKey: 'feature' }]}
                series={Array.from({ length: 4 }, (_, i) => ({
                  dataKey: `Cluster ${i+1}`,
                  label: `Cluster ${i+1}`,
                  color: clusterProfiles[i]?.color
                }))}
                legend={{
                  direction: 'row',
                  position: { vertical: 'top', horizontal: 'right' },
                }}
                height={350}
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </ThemeProvider>
  );
}

export default TestClusterModel;
