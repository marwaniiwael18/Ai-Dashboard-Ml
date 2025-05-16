import React, { useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Divider,
  LinearProgress,
  Chip,
  Stack,
  Paper,
  Tooltip,
  CircularProgress,
  Fade,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import InfoIcon from '@mui/icons-material/Info';
import TimerIcon from '@mui/icons-material/Timer';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';
import { animated, useSpring } from '@react-spring/web';

// Thème personnalisé pour les résultats
const resultTheme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#f44336',
    },
  },
  components: {
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
          background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
          color: 'white',
          borderRadius: '12px 12px 0 0',
        },
        subheader: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
  },
});

const AnimatedPaper = animated(Paper);

function PredictionResult({ data, resultType, showBoth, durationResult, occupancyResult }) {
  const theme = useTheme();
  
  // Si les anciennes propriétés sont utilisées, les convertir au nouveau format
  if (durationResult && !data) {
    data = durationResult;
    resultType = 'duration';
  } else if (occupancyResult && !data) {
    data = occupancyResult;
    resultType = 'occupancy';
  }

  // Nouveau showBoth si les deux résultats sont présents
  if (durationResult && occupancyResult) {
    showBoth = true;
  }
  
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 200,
    config: { tension: 280, friction: 20 }
  });
  
  // Nouvelles fonctions pour traiter les données de test multiple et calculer des statistiques
  const calculateTestStatistics = useMemo(() => {
    if (!Array.isArray(data) || data.length <= 1) {
      return null;
    }
    
    // On ne traite que les données qui ont un format de résultat de test
    const testResults = data.filter(item => 
      item && item.result && 
      (item.result.occupancy_prediction !== undefined || item.result.duration_prediction !== undefined)
    );
    
    if (testResults.length <= 1) {
      return null;
    }
    
    const stats = {
      occupancy: {
        count: 0,
        predicted_occupied: 0,
        predicted_free: 0,
        avg_probability: 0,
        min_probability: 1,
        max_probability: 0,
        sampleData: [],
      },
      duration: {
        count: 0,
        avg_duration: 0,
        min_duration: Infinity,
        max_duration: 0,
        sampleData: [],
      }
    };
    
    testResults.forEach(item => {
      if (item.result.occupancy_prediction !== undefined) {
        const probability = item.result.occupancy_probability;
        stats.occupancy.count++;
        stats.occupancy.avg_probability += probability;
        stats.occupancy.min_probability = Math.min(stats.occupancy.min_probability, probability);
        stats.occupancy.max_probability = Math.max(stats.occupancy.max_probability, probability);
        
        if (item.result.occupancy_prediction === 1) {
          stats.occupancy.predicted_occupied++;
        } else {
          stats.occupancy.predicted_free++;
        }
        
        stats.occupancy.sampleData.push({
          scenario: item.scenario || 'Test',
          prediction: item.result.occupancy_prediction,
          probability: probability,
          hour: item.data?.Hour || 'N/A',
          weekday: item.data?.Weekday || 'N/A'
        });
      }
      
      if (item.result.duration_prediction !== undefined) {
        const duration = item.result.duration_prediction;
        stats.duration.count++;
        stats.duration.avg_duration += duration;
        stats.duration.min_duration = Math.min(stats.duration.min_duration, duration);
        stats.duration.max_duration = Math.max(stats.duration.max_duration, duration);
        
        stats.duration.sampleData.push({
          scenario: item.scenario || 'Test',
          predicted_duration: duration,
          hour: item.data?.Hour || 'N/A',
          weekday: item.data?.Weekday || 'N/A'
        });
      }
    });
    
    if (stats.occupancy.count > 0) {
      stats.occupancy.avg_probability = stats.occupancy.avg_probability / stats.occupancy.count;
    }
    
    if (stats.duration.count > 0) {
      stats.duration.avg_duration = stats.duration.avg_duration / stats.duration.count;
    }
    
    // Limiter le nombre d'échantillons affichés
    stats.occupancy.sampleData = stats.occupancy.sampleData.slice(0, 5);
    stats.duration.sampleData = stats.duration.sampleData.slice(0, 5);
    
    return stats;
    
  }, [data]);
  
  const formatProbability = (value) => {
    return (value * 100).toFixed(1) + '%';
  };
  // Si pas de données ou données vides
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    return (
      <ThemeProvider theme={resultTheme}>
        <AnimatedPaper style={fadeIn} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(45deg, #3949ab 30%, #5c6bc0 90%)',
            color: 'white'
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} /> 
              Résultat de la prédiction
            </Typography>
          </Box>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, flexDirection: 'column' }}>
              <DirectionsCarIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2, opacity: 0.4 }} />
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 1 }}>
                En attente de données de prédiction
              </Typography>
              <Typography variant="body2" color="text.disabled" align="center">
                Veuillez remplir et soumettre le formulaire pour générer une prédiction
              </Typography>
            </Box>
          </CardContent>
        </AnimatedPaper>
      </ThemeProvider>
    );
  }
    // Si c'est un tableau de résultats (pour les tests multiples)
  if (Array.isArray(data) && data.length > 0) {
    // S'assurer que le premier élément a une structure attendue
    const latestResult = data[0]; // Le résultat le plus récent
    
    if (!latestResult || !latestResult.result) {
      // Si le format n'est pas celui attendu pour les tests multiples
      console.warn("Format de données inattendu pour les tests multiples:", data);
      // On essaye de convertir au format attendu
      const adaptedData = data.map(item => ({
        timestamp: new Date().toISOString(),
        scenario: "Test",
        data: {},
        result: item // On suppose que l'élément lui-même est le résultat
      }));
      
      if (adaptedData.length > 0 && adaptedData[0].result) {
        // On continue avec les données adaptées
        return PredictionResult({ 
          data: adaptedData,
          resultType,
          showBoth
        });
      }
    }
    
    return (
      <ThemeProvider theme={resultTheme}>
        <AnimatedPaper style={fadeIn} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
            color: 'white'
          }}>
            <Typography variant="h6">
              <QueryStatsIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> 
              Résultats des tests multiples
            </Typography>
            <Typography variant="subtitle2">
              {data.length} test{data.length > 1 ? 's' : ''} effectué{data.length > 1 ? 's' : ''}
            </Typography>
          </Box>
          
          {calculateTestStatistics && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {calculateTestStatistics.occupancy.count > 0 && (
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Statistiques d'occupation
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <PieChart
                          series={[
                            {
                              data: [
                                { 
                                  id: 0, 
                                  value: calculateTestStatistics.occupancy.predicted_occupied, 
                                  label: 'Occupé',
                                  color: theme.palette.error.main
                                },
                                { 
                                  id: 1, 
                                  value: calculateTestStatistics.occupancy.predicted_free, 
                                  label: 'Libre',
                                  color: theme.palette.success.main
                                },
                              ],
                              innerRadius: 30,
                              outerRadius: 100,
                              paddingAngle: 2,
                              cornerRadius: 5,
                              startAngle: -90,
                              endAngle: 270,
                              cx: 150,
                              cy: 100,
                            },
                          ]}
                          width={300}
                          height={200}
                        />
                      </Box>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">Probabilité moyenne:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {formatProbability(calculateTestStatistics.occupancy.avg_probability)}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">Min:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {formatProbability(calculateTestStatistics.occupancy.min_probability)}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">Max:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {formatProbability(calculateTestStatistics.occupancy.max_probability)}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      {calculateTestStatistics.occupancy.sampleData.length > 0 && (
                        <>
                          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                            Échantillon de résultats:
                          </Typography>
                          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 200 }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Scénario</TableCell>
                                  <TableCell>Prédiction</TableCell>
                                  <TableCell>Probabilité</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {calculateTestStatistics.occupancy.sampleData.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.scenario}</TableCell>
                                    <TableCell>
                                      {item.prediction === 1 ? 
                                        <Chip 
                                          size="small" 
                                          color="error" 
                                          label="Occupé" 
                                          icon={<CancelIcon />} 
                                        /> : 
                                        <Chip 
                                          size="small" 
                                          color="success" 
                                          label="Libre" 
                                          icon={<CheckCircleIcon />} 
                                        />
                                      }
                                    </TableCell>
                                    <TableCell>{formatProbability(item.probability)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </>
                      )}
                    </Paper>
                  </Grid>
                )}
                
                {calculateTestStatistics.duration.count > 0 && (
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Statistiques de durée
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                        <Box sx={{ position: 'relative', width: '100%', height: 40, mb: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(calculateTestStatistics.duration.avg_duration / 8) * 100}
                            sx={{ 
                              height: 20, 
                              borderRadius: 1,
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: theme.palette.primary.main
                              }
                            }}
                          />
                          <Box sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Typography variant="body2" fontWeight="bold" color="white">
                              Durée moyenne: {calculateTestStatistics.duration.avg_duration.toFixed(1)}h
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={6}>
                            <Paper 
                              elevation={1} 
                              sx={{ 
                                p: 2, 
                                textAlign: 'center',
                                bgcolor: 'rgba(76, 175, 80, 0.1)'
                              }}
                            >
                              <Typography variant="body2" color="text.secondary">Durée minimale</Typography>
                              <Typography variant="h6" fontWeight="bold" color="primary">
                                {calculateTestStatistics.duration.min_duration.toFixed(1)}h
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper 
                              elevation={1} 
                              sx={{ 
                                p: 2, 
                                textAlign: 'center',
                                bgcolor: 'rgba(244, 67, 54, 0.1)'
                              }}
                            >
                              <Typography variant="body2" color="text.secondary">Durée maximale</Typography>
                              <Typography variant="h6" fontWeight="bold" color="secondary">
                                {calculateTestStatistics.duration.max_duration.toFixed(1)}h
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>
                      
                      {calculateTestStatistics.duration.sampleData.length > 0 && (
                        <>
                          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                            Échantillon de résultats:
                          </Typography>
                          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 200 }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Scénario</TableCell>
                                  <TableCell>Jour</TableCell>
                                  <TableCell>Heure</TableCell>
                                  <TableCell>Durée prévue</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {calculateTestStatistics.duration.sampleData.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.scenario}</TableCell>
                                    <TableCell>{item.weekday}</TableCell>
                                    <TableCell>{item.hour}h</TableCell>
                                    <TableCell>{item.predicted_duration.toFixed(1)}h</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </>
                      )}
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Dernier test effectué
            </Typography>
          </Box>
          
          <Box sx={{ p: 2 }}>
            {latestResult && latestResult.result && (
              <RenderSingleResult 
                data={latestResult.result} 
                resultType={resultType} 
                showBoth={showBoth}
                testData={latestResult.data}
                scenario={latestResult.scenario || "Test récent"}
              />
            )}
          </Box>
        </AnimatedPaper>
      </ThemeProvider>
    );
  }

  // Si c'est un seul résultat
  return (
    <ThemeProvider theme={resultTheme}>
      <AnimatedPaper style={fadeIn} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 2, 
          background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
          color: 'white'
        }}>
          <Typography variant="h6">
            <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> 
            Résultat de la prédiction
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <RenderSingleResult 
            data={data} 
            resultType={resultType} 
            showBoth={showBoth} 
          />
        </Box>
      </AnimatedPaper>
    </ThemeProvider>
  );
}

// Composant pour afficher un résultat unique
function RenderSingleResult({ data, resultType, showBoth, testData, scenario }) {  // Si c'est une prédiction d'occupation ou les deux
  if (resultType === 'occupancy' || showBoth) {
    // Vérifier si les données ont la structure attendue
    const occupancyPrediction = data && data.occupancy_prediction !== undefined 
      ? data.occupancy_prediction 
      : (data && data.prediction !== undefined ? data.prediction : null);
    
    const occupancyProbability = data && data.occupancy_probability !== undefined 
      ? data.occupancy_probability 
      : (data && data.probability ? data.probability.occupied : 0.5);
    
    // Si les données ne sont toujours pas disponibles, afficher un message
    if (occupancyPrediction === null) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Les données de prédiction ne sont pas dans le format attendu.</Typography>
        </Box>
      );
    }
    
    const isOccupied = occupancyPrediction === 1;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={showBoth ? 6 : 12}>
          <Fade in timeout={500}>
            <Paper elevation={2} sx={{ p: 2, height: '100%', position: 'relative' }}>
              {scenario && (
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {scenario}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {isOccupied ? 
                  <CancelIcon color="error" fontSize="large" sx={{ mr: 1 }} /> :
                  <CheckCircleIcon color="success" fontSize="large" sx={{ mr: 1 }} />
                }
                <Typography variant="h6" gutterBottom>
                  {isOccupied ? 'Place occupée' : 'Place libre'}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Probabilité d'occupation:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={occupancyProbability * 100} 
                    color={isOccupied ? "secondary" : "primary"}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5 
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 60 }}>
                  <Typography variant="body2" color="text.secondary">
                    {(occupancyProbability * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Interprétation:
              </Typography>
              <Typography variant="body1">
                {isOccupied 
                  ? `Il est ${(occupancyProbability * 100).toFixed(1)}% probable que cette place soit occupée.` 
                  : `Il est ${((1 - occupancyProbability) * 100).toFixed(1)}% probable que cette place soit libre.`}
              </Typography>
              
              {testData && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                  <Typography variant="caption" color="text.secondary">
                    Paramètres clés du test: {testData.Weekday !== undefined ? `Jour ${testData.Weekday}` : ''} 
                    {testData.Hour !== undefined ? `, ${testData.Hour}h` : ''}
                    {testData.Is_Weekend !== undefined ? `, ${testData.Is_Weekend === 1 ? 'Weekend' : 'Jour de semaine'}` : ''}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Fade>
        </Grid>
        
        {showBoth && data.duration_prediction !== undefined && (
          <Grid item xs={12} sm={6}>
            <RenderDurationResult 
              data={data} 
              testData={testData}
            />
          </Grid>
        )}
      </Grid>
    );
  }
  // Si c'est une prédiction de durée seulement
  else if (resultType === 'duration') {
    return <RenderDurationResult data={data} testData={testData} scenario={scenario} />;
  }
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography>Aucun résultat disponible</Typography>
    </Box>
  );
}

// Composant pour afficher un résultat de durée
function RenderDurationResult({ data, testData, scenario }) {
  // Vérifier si les données ont la structure attendue
  if (!data || (data.duration_prediction === undefined && data.prediction === undefined)) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Les données de prédiction de durée ne sont pas disponibles.
        </Typography>
      </Paper>
    );
  }

  // Adapter la structure des données selon ce qui est disponible
  const durationPrediction = data.duration_prediction !== undefined ? 
    data.duration_prediction : 
    (data.prediction !== undefined ? data.prediction : 0);
  
  const hours = Math.floor(durationPrediction);
  const minutes = Math.round((durationPrediction - hours) * 60);

  // Obtenir une couleur qui représente la durée (de vert clair pour les courts séjours à rouge pour les longs)
  const getDurationColor = (duration) => {
    if (duration <= 1) return '#4caf50'; // vert
    if (duration <= 2) return '#8bc34a'; // vert-jaune
    if (duration <= 4) return '#ffeb3b'; // jaune
    if (duration <= 6) return '#ff9800'; // orange
    return '#f44336'; // rouge
  };

  const durationColor = getDurationColor(durationPrediction);
  
  return (
    <Fade in timeout={500}>
      <Paper elevation={2} sx={{ p: 2, height: '100%', position: 'relative' }}>
        {scenario && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {scenario}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon fontSize="large" sx={{ mr: 1, color: durationColor }} />
          <Typography variant="h6" gutterBottom>
            Durée prévue
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center', my: 3 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: durationColor }}>
            {hours}h{minutes > 0 ? minutes : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {durationPrediction.toFixed(2)} heures
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Échelle de durée:
          </Typography>
          <Box sx={{ width: '100%', height: 8, borderRadius: 4, position: 'relative', bgcolor: 'rgba(0,0,0,0.05)', mt: 1, mb: 2 }}>
            {/* Échelle de gradient pour représenter visuellement la durée */}
            <Box 
              sx={{ 
                position: 'absolute', 
                left: 0, 
                top: 0, 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(to right, #4caf50, #8bc34a, #ffeb3b, #ff9800, #f44336)',
                borderRadius: 4,
                opacity: 0.3
              }} 
            />
            {/* Indicateur de position */}
            <Box 
              sx={{ 
                position: 'absolute', 
                left: `${Math.min(durationPrediction / 8 * 100, 100)}%`, 
                top: '-8px',
                transform: 'translateX(-50%)',
                width: 12,
                height: 24,
                bgcolor: durationColor,
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} 
            />
            
            {/* Labels de l'échelle */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="caption" sx={{ color: '#4caf50' }}>Courte (1h)</Typography>
              <Typography variant="caption" sx={{ color: '#ffeb3b' }}>Moyenne (3h)</Typography>
              <Typography variant="caption" sx={{ color: '#f44336' }}>Longue (8h+)</Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Interprétation:
        </Typography>
        <Typography variant="body1">
          {durationPrediction <= 1 
            ? "Stationnement de très courte durée."
            : durationPrediction <= 2 
              ? "Stationnement de courte durée."
              : durationPrediction <= 4 
                ? "Stationnement de durée moyenne."
                : durationPrediction <= 6 
                  ? "Stationnement de longue durée."
                  : "Stationnement de très longue durée."
          }
        </Typography>
        
        {testData && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
            <Typography variant="caption" color="text.secondary">
              Paramètres clés du test: {testData.Weekday !== undefined ? `Jour ${testData.Weekday}` : ''} 
              {testData.Hour !== undefined ? `, ${testData.Hour}h` : ''}
              {testData.Electric_Vehicle !== undefined ? `, ${testData.Electric_Vehicle === 1 ? 'Véhicule électrique' : 'Véhicule standard'}` : ''}
            </Typography>
          </Box>
        )}
      </Paper>
    </Fade>
  );
}

export default PredictionResult;
