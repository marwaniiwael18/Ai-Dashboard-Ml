import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Divider,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import TimerIcon from '@mui/icons-material/Timer';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PieChart } from '@mui/x-charts/PieChart';

// Thème personnalisé pour les résultats de clustering
const clusterResultTheme = createTheme({
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
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500
        }
      }
    }
  },
});

// Configuration des clusters avec leurs caractéristiques
const clusterProfiles = [
  {
    name: "Court séjour économique",
    description: "Utilisateurs privilégiant des stationnements courts, payant peu et souvent éloignés des sorties.",
    color: "#2196f3",
    icon: <TimerIcon />,
    characteristics: [
      { label: "Durée moyenne", value: "1-2 heures" },
      { label: "Budget", value: "Économique" },
      { label: "Fidélité", value: "Variable" }
    ]
  },
  {
    name: "Longue durée premium",
    description: "Utilisateurs stationnant pour de longues durées, avec un budget plus important.",
    color: "#ff9800",
    icon: <PaymentIcon />,
    characteristics: [
      { label: "Durée moyenne", value: "5+ heures" },
      { label: "Budget", value: "Élevé" },
      { label: "Fidélité", value: "Moyenne" }
    ]
  },
  {
    name: "Habitués fidèles",
    description: "Utilisateurs fréquents du parking, avec un historique de visites élevé.",
    color: "#4caf50",
    icon: <HistoryIcon />,
    characteristics: [
      { label: "Durée moyenne", value: "Variable" },
      { label: "Budget", value: "Moyen" },
      { label: "Fidélité", value: "Très élevée" }
    ]
  },
  {
    name: "Proximité & confort",
    description: "Utilisateurs privilégiant les places proches des sorties, peu importe le coût.",
    color: "#e91e63",
    icon: <LocationOnIcon />,
    characteristics: [
      { label: "Durée moyenne", value: "Variable" },
      { label: "Budget", value: "Élevé" },
      { label: "Fidélité", value: "Moyenne à élevée" }
    ]
  }
];

const ClusterResult = ({ result, loading }) => {
  // Si pas de résultat ou chargement en cours
  if (!result) {
    return (
      <ThemeProvider theme={clusterResultTheme}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title="Résultat de l'Analyse"
            subheader="Profil comportemental de l'utilisateur"
            avatar={<CategoryIcon />}
          />
          <CardContent>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LinearProgress sx={{ mb: 3 }} />
                <Typography variant="body1">
                  Analyse du profil en cours...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: 2
              }}>
                <GroupIcon sx={{ fontSize: 60, color: 'text.disabled', opacity: 0.5, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Aucun résultat d'analyse disponible
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Utilisez le formulaire pour identifier le profil utilisateur
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </ThemeProvider>
    );
  }

  // Récupérer le profil du cluster identifié
  const clusterIndex = result.cluster;
  const clusterProfile = clusterProfiles[clusterIndex];
  const confidence = result.confidence * 100;

  return (
    <ThemeProvider theme={clusterResultTheme}>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title="Profil Utilisateur"
          subheader="Résultat de l'analyse comportementale"
          avatar={<CategoryIcon />}
        />
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Chip
              label={`Cluster ${clusterIndex + 1}: ${clusterProfile.name}`}
              sx={{
                bgcolor: clusterProfile.color,
                color: 'white',
                fontSize: '1rem',
                py: 2,
                px: 2
              }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Indice de confiance
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={confidence}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: clusterProfile.color
                      }
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">{Math.round(confidence)}%</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary" paragraph>
            {clusterProfile.description}
          </Typography>

          <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Caractéristiques du profil:
            </Typography>
            <List dense>
              {clusterProfile.characteristics.map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon fontSize="small" sx={{ color: clusterProfile.color }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    secondary={item.value} 
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      fontWeight: 500
                    }}
                    secondaryTypographyProps={{ 
                      variant: 'body2'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default ClusterResult;
