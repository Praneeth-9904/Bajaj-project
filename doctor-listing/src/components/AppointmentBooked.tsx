import { Box, Typography, Button, Paper, Avatar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Doctor } from '../types/doctor';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AppointmentBooked = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor as Doctor;

  if (!doctor) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        backgroundColor: '#f5f5f5',
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          No doctor information found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Doctors List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      p: 3,
      backgroundColor: '#f5f5f5',
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 600, 
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'white',
        }}
      >
        <CheckCircleIcon 
          color="success" 
          sx={{ 
            fontSize: 80, 
            mb: 2,
            color: '#4caf50',
          }} 
        />
        
        <Typography variant="h4" gutterBottom>
          Appointment Booked Successfully!
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mt: 3,
          mb: 3,
        }}>
          <Avatar 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`}
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 2,
              border: '2px solid #2196f3',
            }} 
          />
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h6">
              {doctor.name}
            </Typography>
            <Typography color="textSecondary">
              {doctor.speciality.join(', ')}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Your appointment has been successfully booked with {doctor.name}.
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Consultation Mode: {doctor.consultationMode}
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Consultation Fee: ₹{doctor.fees}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Doctors List
        </Button>
      </Paper>
    </Box>
  );
};

export default AppointmentBooked; 