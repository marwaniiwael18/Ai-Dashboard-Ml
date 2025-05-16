import React, { useState } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Tooltip,
  IconButton,

  Tabs,
  Tab,
  LinearProgress,

  ThemeProvider,
  createTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import SaveAltIcon from '@mui/icons-material/SaveAlt';

import SettingsIcon from '@mui/icons-material/Settings';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

// URL de l'API
// Utiliser la variable d'environnement REACT_APP_API_URL si elle existe, sinon utiliser localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Thème personnalisé pour les tests
const testTheme = createTheme({
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
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: 56,
          '&.Mui-expanded': {
            minHeight: 56,
          },
        },
        content: {
          margin: '12px 0',
          '&.Mui-expanded': {
            margin: '12px 0',
          },
        },
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          boxShadow: '0 4px 10px 0 rgba(0,0,0,0.12)',
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            fontWeight: 600
          }
        }
      }
    }
  },
});

// Scénarios de test prédéfinis
const testScenarios = [
  {
    name: "Scénario 1: Jour de semaine, matin",
    data: {
      "Hour": 9,
      "Weekday": 2,
      "Is_Weekend": 0,
      "Parking_Duration": 1.5,
      "Electric_Vehicle": 0,
      "Reserved_Status": 0,
      "Entry_Time_Minutes": 540,
      "Exit_Time_Minutes": 630,
      "User_Parking_History": 3,
      "Payment_Amount": 5.0,
      "Proximity_To_Exit": 15
    },
    description: "Un usager régulier se gare en semaine pour une courte durée le matin."
  },
  {
    name: "Scénario 2: Weekend, longue durée",
    data: {
      "Hour": 14,
      "Weekday": 6,
      "Is_Weekend": 1,
      "Parking_Duration": 5.0,
      "Electric_Vehicle": 0,
      "Reserved_Status": 0,
      "Entry_Time_Minutes": 840,
      "Exit_Time_Minutes": 1140,
      "User_Parking_History": 1,
      "Payment_Amount": 15.0,
      "Proximity_To_Exit": 45
    },
    description: "Stationnement de longue durée pendant le weekend, usager occasionnel."
  },
  {
    name: "Scénario 3: Véhicule électrique",
    data: {
      "Hour": 17,
      "Weekday": 4,
      "Is_Weekend": 0,
      "Parking_Duration": 2.5,
      "Electric_Vehicle": 1,
      "Reserved_Status": 0,
      "Entry_Time_Minutes": 1020,
      "Exit_Time_Minutes": 1170,
      "User_Parking_History": 10,
      "Payment_Amount": 7.5,
      "Proximity_To_Exit": 5
    },
    description: "Un véhicule électrique stationné près de la sortie, appartenant à un usager très régulier."
  },
  {
    name: "Scénario 4: Place réservée, soirée",
    data: {
      "Hour": 20,
      "Weekday": 5,
      "Is_Weekend": 1,
      "Parking_Duration": 8.0,
      "Electric_Vehicle": 0,
      "Reserved_Status": 1,
      "Entry_Time_Minutes": 1200,
      "Exit_Time_Minutes": 1680,
      "User_Parking_History": 25,
      "Payment_Amount": 25.0,
      "Proximity_To_Exit": 30
    },
    description: "Stationnement de nuit dans une place réservée, par un abonné fidèle."
  },
  // Ajout de scénarios spécifiques pour le test du clustering
  {
    name: "Scénario 5: Profil Premium",
    data: {
      "Hour": 10,
      "Weekday": 3,
      "Is_Weekend": 0,
      "Parking_Duration": 2.0,
      "Electric_Vehicle": 1,
      "Reserved_Status": 1,
      "Entry_Time_Minutes": 600,
      "Exit_Time_Minutes": 720,
      "User_Parking_History": 30,
      "Payment_Amount": 20.0,
      "Proximity_To_Exit": 5 // Très proche de la sortie
    },
    description: "Client premium fidèle avec un véhicule électrique, se gare près de la sortie."
  },
  {
    name: "Scénario 6: Usager économique",
    data: {
      "Hour": 7,
      "Weekday": 1,
      "Is_Weekend": 0,
      "Parking_Duration": 0.5,
      "Electric_Vehicle": 0,
      "Reserved_Status": 0,
      "Entry_Time_Minutes": 420,
      "Exit_Time_Minutes": 450,
      "User_Parking_History": 2,
      "Payment_Amount": 2.0,
      "Proximity_To_Exit": 80 // Loin de la sortie
    },
    description: "Usager occasionnel, stationnement court et économique loin de la sortie."
  }
];

// Ajout d'une fonction pour générer des valeurs aléatoires
const generateRandomTestData = () => {
  // Générer des valeurs aléatoires pour chaque caractéristique
  return {
    "Hour": Math.floor(Math.random() * 24),
    "Weekday": Math.floor(Math.random() * 7),
    "Is_Weekend": Math.random() > 0.7 ? 1 : 0, // 30% de chances d'être un weekend
    "Parking_Duration": Math.random() * 8 + 0.5, // Entre 0.5 et 8.5 heures
    "Electric_Vehicle": Math.random() > 0.8 ? 1 : 0, // 20% de chances d'être électrique
    "Reserved_Status": Math.random() > 0.7 ? 1 : 0, // 30% de chances d'être réservé
    "Entry_Time_Minutes": Math.floor(Math.random() * 1440), // Minutes dans la journée (0-1439)
    "Exit_Time_Minutes": Math.floor(Math.random() * 1440), // Minutes dans la journée (0-1439)
    "User_Parking_History": Math.floor(Math.random() * 50), // Entre 0 et 50 visites
    "Payment_Amount": Math.round(Math.random() * 30 * 10) / 10, // Entre 0 et 30€, arrondi à 0.1€
    "Proximity_To_Exit": Math.floor(Math.random() * 100) + 1 // Entre 1 et 100m
  };
};

// Ajout d'un scénario aléatoire à la liste des scénarios existants
testScenarios.push({
  name: "Scénario Aléatoire",
  data: generateRandomTestData(),
  description: "Paramètres générés aléatoirement pour tester le modèle avec des données imprévisibles."
});

// Conversion des noms de caractéristiques pour affichage
const featureLabels = {
  "Hour": "Heure d'arrivée",
  "Weekday": "Jour de la semaine",
  "Is_Weekend": "Jour de weekend",
  "Parking_Duration": "Durée de stationnement (h)",
  "Electric_Vehicle": "Véhicule électrique",
  "Reserved_Status": "Place réservée",
  "Entry_Time_Minutes": "Heure d'entrée (minutes)",
  "Exit_Time_Minutes": "Heure de sortie (minutes)",
  "User_Parking_History": "Historique utilisateur",
  "Payment_Amount": "Montant payé (€)",
  "Proximity_To_Exit": "Distance à la sortie (m)"
};

function TestOccupancyModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [testData, setTestData] = useState(testScenarios[0].data);
  const [results, setResults] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isGeneratingRandomTests, setIsGeneratingRandomTests] = useState(false);
  const isMobile = useMediaQuery(testTheme.breakpoints.down('md'));

  // Stats calculées à partir des résultats
  const [stats, setStats] = useState({
    totalTests: 0,
    successRate: 0,
    averageConfidence: 0,
    occupied: 0,
    notOccupied: 0
  });

  const updateStats = (resultsList) => {
    if (!resultsList || resultsList.length === 0) {
      setStats({
        totalTests: 0,
        successRate: 0,
        averageConfidence: 0,
        occupied: 0,
        notOccupied: 0
      });
      return;
    }

    const total = resultsList.length;
    const occupied = resultsList.filter(r => r.result.prediction === 1).length;
    const notOccupied = total - occupied;
    
    // Calcul de la confiance moyenne (la probabilité de la classe prédite)
    const avgConfidence = resultsList.reduce((acc, curr) => {
      const confidence = curr.result.prediction === 1 
        ? curr.result.probability.occupied 
        : curr.result.probability.not_occupied;
      return acc + confidence;
    }, 0) / total * 100;
    
    // Pour cet exemple, on simule un taux de succès
    // Dans un vrai système, on aurait besoin de connaître les vraies valeurs
    // Ici nous estimons que les prédictions avec confiance > 75% sont "correctes"
    const successCount = resultsList.filter(r => {
      const confidence = r.result.prediction === 1 
        ? r.result.probability.occupied 
        : r.result.probability.not_occupied;
      return confidence > 0.75;
    }).length;
    
    setStats({
      totalTests: total,
      successRate: (successCount / total) * 100,
      averageConfidence: avgConfidence,
      occupied,
      notOccupied
    });
  };



  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleRandomTestGeneration = async () => {
    setIsGeneratingRandomTests(true);
    try {
      // Générer et exécuter 5 tests aléatoires consécutifs
      const randomResults = [];
      const numRandomTests = 5;
      
      for (let i = 0; i < numRandomTests; i++) {
        // Générer de nouvelles données aléatoires
        const randomData = generateRandomTestData();
        
        // Mettre à jour le scénario aléatoire
        testScenarios[testScenarios.length - 1].data = randomData;
        
        try {
          const response = await axios.post(`${API_URL}/predict/occupancy`, randomData);
          
          randomResults.push({
            timestamp: new Date().toISOString(),
            scenario: `Test aléatoire #${i+1}`,
            data: {...randomData},
            result: response.data
          });
          
          // Petite pause pour visualiser la progression
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (err) {
          console.error(`Erreur lors du test aléatoire ${i+1}:`, err);
        }
      }
      
      // Mise à jour du testData pour afficher le dernier test aléatoire
      if (randomResults.length > 0) {
        setTestData(testScenarios[testScenarios.length - 1].data);
      }
      
      // Ajouter tous les résultats aléatoires au début de la liste
      const updatedResults = [...randomResults, ...results];
      setResults(updatedResults);
      updateStats(updatedResults);
      
    } catch (err) {
      setError("Erreur lors de la génération des tests aléatoires.");
    } finally {
      setIsGeneratingRandomTests(false);
    }
  };

  const handleRunTest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict/occupancy`, testData);
      
      // Ajouter le nouveau résultat au début de la liste
      const newResult = {
        timestamp: new Date().toISOString(),
        scenario: testScenarios[selectedScenario].name,
        data: {...testData},
        result: response.data
      };
      
      const updatedResults = [newResult, ...results];
      setResults(updatedResults);
      updateStats(updatedResults);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors du test.');
    } finally {
      setLoading(false);
    }
  };
  
  const runBatchTests = async () => {
    setIsRunningBatch(true);
    setBatchProgress(0);
    
    const batchResults = [];
    
    for (let i = 0; i < testScenarios.length; i++) {
      try {
        setBatchProgress((i / testScenarios.length) * 100);
        const response = await axios.post(`${API_URL}/predict/occupancy`, testScenarios[i].data);
        
        batchResults.push({
          timestamp: new Date().toISOString(),
          scenario: testScenarios[i].name,
          data: {...testScenarios[i].data},
          result: response.data
        });
        
        // Petite pause pour visualiser la progression
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`Erreur lors du test du scénario ${i+1}:`, err);
      }
    }
    
    setBatchProgress(100);
    
    // Ajouter tous les résultats du batch au début de la liste
    const updatedResults = [...batchResults, ...results];
    setResults(updatedResults);
    updateStats(updatedResults);
    
    setTimeout(() => {
      setIsRunningBatch(false);
    }, 500);
  };
  
  const clearResults = () => {
    setResults([]);
    updateStats([]);
  };

  const downloadResults = () => {
    // Convertir les résultats en CSV
    const headers = "Timestamp,Scenario,Hour,Weekday,Is_Weekend,Parking_Duration,Electric_Vehicle,Reserved_Status,User_History,Payment,Distance_To_Exit,Prediction,Probability_Occupied,Probability_Not_Occupied\n";
    
    const rows = results.map(r => {
      return `"${r.timestamp}","${r.scenario}",${r.data.Hour},${r.data.Weekday},${r.data.Is_Weekend},${r.data.Parking_Duration},${r.data.Electric_Vehicle},${r.data.Reserved_Status},${r.data.User_Parking_History},${r.data.Payment_Amount},${r.data.Proximity_To_Exit},${r.result.prediction},${r.result.probability.occupied},${r.result.probability.not_occupied}`;
    }).join("\n");
    
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien et déclencher le téléchargement
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `smart_parking_test_results_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    handleMenuClose();
  };
  
  // Ajout de la fonction generateNewRandomScenario
  const handleGenerateRandomScenario = () => {
    // Créer un nouveau scénario aléatoire
    const randomData = generateRandomTestData();
    // Mettre à jour les données de test
    setTestData(randomData);
    // Mettre à jour le scénario actuel
    setSelectedScenario(testScenarios.length - 1);
    // Mettre à jour le dernier scénario de la liste avec ces nouvelles données aléatoires
    testScenarios[testScenarios.length - 1].data = randomData;
  };
  
  // Formatage des valeurs booléennes pour affichage
  const formatBoolean = (value) => {
    return value === 1 ? "Oui" : "Non";
  };
  
  // Formatage des jours de la semaine
  const formatDay = (day) => {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    return days[day];
  };

  return (
    <ThemeProvider theme={testTheme}>
      <Card sx={{ mb: 3 }} elevation={3}>
        <CardHeader
          title="Test du Modèle d'Occupation"
          subheader="Tester les prédictions du modèle avec des scénarios prédéfinis"
          avatar={<BugReportIcon />}
          sx={{
            background: 'linear-gradient(90deg, #3949ab 0%, #5e35b1 100%)',
            color: 'white',
            '& .MuiCardHeader-subheader': {
              color: 'rgba(255,255,255,0.7)'
            }
          }}
          action={
            <IconButton 
              aria-label="Menu" 
              color="inherit" 
              onClick={handleMenuClick}
              sx={{ color: 'white' }}
            >
              <MoreVertIcon />
            </IconButton>
          }
        />
        
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >          <MenuItem onClick={() => { runBatchTests(); handleMenuClose(); }}>
            <ListItemIcon>
              <AutoFixHighIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Exécuter tous les tests</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { handleRandomTestGeneration(); handleMenuClose(); }}>
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Générer 5 tests aléatoires</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { clearResults(); handleMenuClose(); }}>
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Effacer les résultats</ListItemText>
          </MenuItem>
          <MenuItem onClick={downloadResults} disabled={results.length === 0}>
            <ListItemIcon>
              <SaveAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Exporter en CSV</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Paramètres</ListItemText>
          </MenuItem>
        </Menu>
        
        <CardContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <FilterListIcon sx={{ mr: 1 }} color="primary" /> Sélection du scénario
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  {testScenarios.map((scenario, index) => (
                    <Accordion 
                      key={index}
                      expanded={selectedScenario === index}
                      onChange={() => setSelectedScenario(index)}
                      sx={{ 
                        mb: 1,
                        boxShadow: selectedScenario === index 
                          ? '0 4px 12px rgba(0,0,0,0.15)' 
                          : '0 1px 4px rgba(0,0,0,0.1)',
                        bgcolor: selectedScenario === index 
                          ? 'rgba(63,81,181,0.05)' 
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
                        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Caractéristique</TableCell>
                                <TableCell>Valeur</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(scenario.data).map(([key, value], idx) => (
                                <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell component="th" scope="row">
                                    {featureLabels[key] || key}
                                  </TableCell>
                                  <TableCell>
                                    {key === "Weekday" ? formatDay(value) :
                                     (key === "Is_Weekend" || key === "Electric_Vehicle" || key === "Reserved_Status") ?
                                      formatBoolean(value) : value}
                                    {key === "Payment_Amount" && " €"}
                                    {key === "Proximity_To_Exit" && " m"}
                                    {key === "Parking_Duration" && " h"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={handleRunTest}
                          disabled={loading || isRunningBatch}
                          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <BugReportIcon />}
                          fullWidth
                        >
                          {loading ? "Test en cours..." : "Tester ce scénario"}
                        </Button>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      onClick={runBatchTests}
                      disabled={loading || isRunningBatch || isGeneratingRandomTests}
                      startIcon={isRunningBatch ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                      fullWidth
                    >
                      {isRunningBatch ? "Exécution des tests..." : "Tester tous les scénarios"}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleGenerateRandomScenario}
                      disabled={loading || isRunningBatch || isGeneratingRandomTests}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                      fullWidth
                    >
                      Générer scénario aléatoire
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      color="info"
                      onClick={handleRandomTestGeneration}
                      disabled={loading || isRunningBatch || isGeneratingRandomTests}
                      startIcon={isGeneratingRandomTests ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                      fullWidth
                    >
                      {isGeneratingRandomTests ? "Génération de tests..." : "Générer et exécuter 5 tests aléatoires"}
                    </Button>
                  </Grid>
                </Grid>
                
                {isRunningBatch && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={batchProgress} 
                      color="secondary"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                      {Math.round(batchProgress)}% des tests complétés
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2.5, 
                  borderRadius: 2, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BarChartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Statistiques des Tests
                    </Typography>
                  </Box>
                  
                  {results.length > 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={clearResults}
                      startIcon={<RefreshIcon />}
                      sx={{ minWidth: 'auto', p: '4px 8px' }}
                    >
                      Réinitialiser
                    </Button>
                  )}
                </Box>
                
                {results.length > 0 ? (
                  <>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 1.5, 
                              textAlign: 'center', 
                              bgcolor: 'primary.light', 
                              color: 'white',
                              borderRadius: 2,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              {stats.totalTests}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                              Tests effectués
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 1.5, 
                              textAlign: 'center', 
                              bgcolor: 'secondary.main', 
                              color: 'white',
                              borderRadius: 2,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              {Math.round(stats.successRate)}%
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                              Taux de confiance
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 1.5, 
                              textAlign: 'center', 
                              bgcolor: '#f44336', 
                              color: 'white',
                              borderRadius: 2,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              {stats.occupied}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                              Places occupées
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 1.5, 
                              textAlign: 'center', 
                              bgcolor: '#4caf50', 
                              color: 'white',
                              borderRadius: 2,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              {stats.notOccupied}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                              Places libres
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>

                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'background.default', 
                        borderRadius: 2, 
                        border: '1px solid rgba(0,0,0,0.08)', 
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                        Distribution des places
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box 
                          sx={{ 
                            width: `${(stats.occupied / stats.totalTests) * 100}%`, 
                            height: 24, 
                            bgcolor: '#f44336',
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {stats.occupied > 0 && (stats.occupied / stats.totalTests) * 100 > 15 && (
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                              {Math.round((stats.occupied / stats.totalTests) * 100)}%
                            </Typography>
                          )}
                        </Box>
                        <Box 
                          sx={{ 
                            width: `${(stats.notOccupied / stats.totalTests) * 100}%`, 
                            height: 24, 
                            bgcolor: '#4caf50',
                            borderTopRightRadius: 12,
                            borderBottomRightRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {stats.notOccupied > 0 && (stats.notOccupied / stats.totalTests) * 100 > 15 && (
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                              {Math.round((stats.notOccupied / stats.totalTests) * 100)}%
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#f44336', borderRadius: '50%', mr: 1 }} />
                          <Typography variant="caption">Occupées</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%', mr: 1 }} />
                          <Typography variant="caption">Libres</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <PieChart
                          series={[
                            {
                              data: [
                                { id: 0, value: stats.occupied, label: 'Occupées', color: '#f44336' },
                                { id: 1, value: stats.notOccupied, label: 'Libres', color: '#4caf50' }
                              ],
                              innerRadius: 55,
                              outerRadius: 80,
                              paddingAngle: 2,
                              cornerRadius: 5,
                              startAngle: -90,
                              endAngle: 270,
                              cx: 125,
                              cy: 90
                            }
                          ]}
                          width={250}
                          height={180}
                          slotProps={{
                            legend: { hidden: true }
                          }}
                        />
                        
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                            {Math.round(stats.averageConfidence)}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            confiance
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Dernier test: {new Date(results[0]?.timestamp).toLocaleTimeString()}
                        </Typography>
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                          {stats.totalTests} prédictions
                        </Typography>
                      </Box>
                    </Paper>
                  </>
                ) : (
                  <Box sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    p: 3,
                    bgcolor: 'rgba(0,0,0,0.02)',
                    borderRadius: 2,
                    border: '1px dashed rgba(0,0,0,0.2)'
                  }}>
                    <BugReportIcon color="disabled" sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" align="center">
                      Aucun test n'a encore été effectué.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                      Sélectionnez un scénario et cliquez sur "Tester" pour commencer.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            {results.length > 0 && (
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange} 
                      variant="fullWidth"
                      sx={{ px: 2 }}
                    >
                      <Tab 
                        icon={<DescriptionIcon />} 
                        iconPosition="start" 
                        label={`Résultats (${results.length})`}
                      />
                      <Tab 
                        icon={<BarChartIcon />} 
                        iconPosition="start" 
                        label="Graphiques"
                      />
                    </Tabs>
                  </Box>
                  
                  {tabValue === 0 && (
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader size={isMobile ? "small" : "medium"}>
                        <TableHead>
                          <TableRow>
                            <TableCell width="5%">#</TableCell>
                            <TableCell width="25%">Scénario</TableCell>
                            <TableCell width="15%">Heure</TableCell>
                            <TableCell width="15%">Jour</TableCell>
                            <TableCell width="20%">Prédiction</TableCell>
                            <TableCell width="20%">Confiance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.map((row, index) => (
                            <TableRow
                              key={index}
                              sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' } }}
                            >
                              <TableCell component="th" scope="row">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <Tooltip title={row.scenario}>
                                  <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                                    {row.scenario.split(":")[0]}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell>{row.data.Hour}:00</TableCell>
                              <TableCell>{formatDay(row.data.Weekday)}</TableCell>
                              <TableCell>
                                <Chip
                                  icon={row.result.prediction === 1 ? <CancelIcon /> : <CheckCircleIcon />}
                                  label={row.result.prediction === 1 ? "Occupé" : "Libre"}
                                  color={row.result.prediction === 1 ? "error" : "success"}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ width: '100%', mr: 1 }}>
                                    <LinearProgress
                                      variant="determinate"
                                      value={row.result.prediction === 1 
                                        ? row.result.probability.occupied * 100 
                                        : row.result.probability.not_occupied * 100}
                                      color={row.result.prediction === 1 ? "error" : "success"}
                                      sx={{ height: 8, borderRadius: 4 }}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {row.result.prediction === 1 
                                        ? Math.round(row.result.probability.occupied * 100)
                                        : Math.round(row.result.probability.not_occupied * 100)}%
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  
                  {tabValue === 1 && (
                    <Box sx={{ p: 3 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        Distribution des prédictions par jour de la semaine
                      </Typography>
                      
                      <Box sx={{ height: 300, mb: 4 }}>
                        <BarChart
                          dataset={results.reduce((acc, result) => {
                            const day = result.data.Weekday;
                            const prediction = result.result.prediction;
                            
                            if (!acc[day]) {
                              acc[day] = { day: formatDay(day), occupied: 0, notOccupied: 0 };
                            }
                            
                            if (prediction === 1) {
                              acc[day].occupied += 1;
                            } else {
                              acc[day].notOccupied += 1;
                            }
                            
                            return acc;
                          }, []).filter(Boolean)}
                          xAxis={[{ scaleType: 'band', dataKey: 'day' }]}
                          series={[
                            { dataKey: 'occupied', label: 'Occupé', color: '#f44336' },
                            { dataKey: 'notOccupied', label: 'Libre', color: '#4caf50' }
                          ]}
                          height={300}
                          slotProps={{
                            legend: {
                              direction: 'row',
                              position: { vertical: 'top', horizontal: 'right' }
                            }
                          }}
                        />
                      </Box>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        Taux d'occupation par heure
                      </Typography>
                      
                      <Box sx={{ height: 300 }}>
                        <BarChart
                          dataset={results.reduce((acc, result) => {
                            const hour = result.data.Hour;
                            const prediction = result.result.prediction;
                            
                            if (!acc[hour]) {
                              acc[hour] = { hour: `${hour}:00`, occupied: 0, notOccupied: 0 };
                            }
                            
                            if (prediction === 1) {
                              acc[hour].occupied += 1;
                            } else {
                              acc[hour].notOccupied += 1;
                            }
                            
                            return acc;
                          }, []).filter(Boolean).sort((a, b) => parseInt(a.hour) - parseInt(b.hour))}
                          xAxis={[{ scaleType: 'band', dataKey: 'hour' }]}
                          series={[
                            { dataKey: 'occupied', label: 'Occupé', color: '#f44336' },
                            { dataKey: 'notOccupied', label: 'Libre', color: '#4caf50' }
                          ]}
                          height={300}
                          slotProps={{
                            legend: {
                              direction: 'row',
                              position: { vertical: 'top', horizontal: 'right' }
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default TestOccupancyModel;
