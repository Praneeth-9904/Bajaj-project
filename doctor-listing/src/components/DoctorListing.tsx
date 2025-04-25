import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  Autocomplete,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Rating,
  Avatar,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
} from '@mui/material';
import { Doctor, FilterState, ConsultationMode, SortOption } from '../types/doctor';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

// Sample data for testing
const SAMPLE_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    speciality: ['General Physician'],
    experience: 10,
    fees: 500,
    consultationMode: 'Video Consult'
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    speciality: ['Dentist'],
    experience: 8,
    fees: 800,
    consultationMode: 'In Clinic'
  },
  {
    id: '3',
    name: 'Dr. Michael Brown',
    speciality: ['Dermatologist'],
    experience: 15,
    fees: 1000,
    consultationMode: 'Video Consult'
  }
];

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

const DoctorListing = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    consultationMode: null,
    specialities: [],
    sortBy: null,
  });
  const [tempFilterState, setTempFilterState] = useState<FilterState>({
    searchQuery: '',
    consultationMode: null,
    specialities: [],
    sortBy: null,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Memoize the filtered doctors to prevent unnecessary re-renders
  const filteredDoctorsMemo = useMemo(() => {
    let result = [...doctors];

    // Apply search filter
    if (filterState.searchQuery) {
      result = result.filter(doctor =>
        doctor.name.toLowerCase().includes(filterState.searchQuery.toLowerCase())
      );
    }

    // Apply consultation mode filter
    if (filterState.consultationMode) {
      result = result.filter(doctor =>
        doctor.consultationMode === filterState.consultationMode
      );
    }

    // Apply specialities filter
    if (filterState.specialities.length > 0) {
      result = result.filter(doctor =>
        doctor.speciality.some(s => filterState.specialities.includes(s))
      );
    }

    // Apply sorting
    if (filterState.sortBy) {
      result.sort((a, b) => {
        if (filterState.sortBy === 'fees') {
          return a.fees - b.fees; // Low to High
        } else if (filterState.sortBy === 'experience') {
          return b.experience - a.experience; // High to Low
        }
        return 0;
      });
    }

    console.log('Sorted doctors:', result);
    return result;
  }, [doctors, filterState]);

  useEffect(() => {
    console.log('Component mounted');
    fetchDoctors();
  }, []);

  useEffect(() => {
    console.log('Location changed:', location.search);
    const params = new URLSearchParams(location.search);
    const newFilterState: FilterState = {
      searchQuery: params.get('search') || '',
      consultationMode: (params.get('mode') as ConsultationMode) || null,
      specialities: params.get('specialities')?.split(',') || [],
      sortBy: (params.get('sort') as SortOption) || null,
    };
    setFilterState(newFilterState);
    setTempFilterState(newFilterState);
  }, [location.search]);

  useEffect(() => {
    console.log('Filters or doctors changed, applying filters');
    setFilteredDoctors(filteredDoctorsMemo);
  }, [filteredDoctorsMemo]);

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors from:', 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
      setLoading(true);
      const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched doctors:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from API');
      }

      // Ensure each doctor has a speciality array
      const processedData = data.map(doctor => ({
        ...doctor,
        speciality: Array.isArray(doctor.speciality) ? doctor.speciality : []
      }));

      setDoctors(processedData);
      setFilteredDoctors(processedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching doctors');
      // Set some sample data in case of error
      const sampleData: Doctor[] = [
        {
          id: '1',
          name: 'Dr. John Smith',
          speciality: ['General Physician'],
          experience: 10,
          fees: 500,
          consultationMode: 'Video Consult' as ConsultationMode
        },
        {
          id: '2',
          name: 'Dr. Sarah Johnson',
          speciality: ['Dentist'],
          experience: 8,
          fees: 800,
          consultationMode: 'In Clinic' as ConsultationMode
        }
      ];
      setDoctors(sampleData);
      setFilteredDoctors(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (newState: FilterState) => {
    const params = new URLSearchParams();
    if (newState.searchQuery) params.set('search', newState.searchQuery);
    if (newState.consultationMode) params.set('mode', newState.consultationMode);
    if (newState.specialities.length > 0) params.set('specialities', newState.specialities.join(','));
    if (newState.sortBy) params.set('sort', newState.sortBy);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleSearch = (value: string) => {
    setFilterState(prev => ({ ...prev, searchQuery: value }));
    updateURL({ ...filterState, searchQuery: value });
  };

  const handleConsultationModeChange = (mode: ConsultationMode) => {
    setFilterState(prev => ({ ...prev, consultationMode: mode }));
    updateURL({ ...filterState, consultationMode: mode });
  };

  const handleSpecialityChange = (speciality: string) => {
    setFilterState(prev => {
      const newSpecialities = prev.specialities.includes(speciality)
        ? prev.specialities.filter(s => s !== speciality)
        : [...prev.specialities, speciality];
      return { ...prev, specialities: newSpecialities };
    });
    updateURL({ ...filterState, specialities: filterState.specialities.includes(speciality) 
      ? filterState.specialities.filter(s => s !== speciality)
      : [...filterState.specialities, speciality] });
  };

  const handleSortChange = (sortBy: SortOption) => {
    console.log('Sorting by:', sortBy);
    setFilterState(prev => ({ ...prev, sortBy }));
    setTempFilterState(prev => ({ ...prev, sortBy }));
    updateURL({ ...filterState, sortBy });
  };

  const handleClearFilters = () => {
    const newFilterState = {
      searchQuery: '',
      consultationMode: null,
      specialities: [],
      sortBy: null,
    };
    setFilterState(newFilterState);
    updateURL(newFilterState);
  };

  const allSpecialities = useMemo(() => 
    Array.from(
      new Set(
        doctors
          .flatMap(doctor => doctor.speciality || [])
          .filter(Boolean)
      )
    ).sort(),
    [doctors]
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    navigate('/appointment-booked', { state: { doctor } });
  };

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Filters
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={handleClearFilters}
          data-testid="clear-filters"
        >
          Clear All
        </Button>
      </Box>
      
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend" data-testid="filter-header-moc">Consultation Mode</FormLabel>
        <RadioGroup
          value={filterState.consultationMode || ''}
          onChange={(e) => handleConsultationModeChange(e.target.value as ConsultationMode)}
        >
          <FormControlLabel
            value="Video Consult"
            control={<Radio />}
            label="Video Consult"
            data-testid="filter-video-consult"
          />
          <FormControlLabel
            value="In Clinic"
            control={<Radio />}
            label="In Clinic"
            data-testid="filter-in-clinic"
          />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend" data-testid="filter-header-speciality">Specialities</FormLabel>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 1,
        }}>
          {allSpecialities.map((speciality) => (
            <FormControlLabel
              key={speciality}
              control={
                <Checkbox
                  checked={filterState.specialities.includes(speciality)}
                  onChange={() => handleSpecialityChange(speciality)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      borderRadius: '4px',
                    },
                  }}
                />
              }
              label={speciality}
              data-testid={`filter-specialty-${speciality.replace(/\s+/g, '-')}`}
            />
          ))}
        </Box>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => setFilteredDoctors(filteredDoctorsMemo)}
        sx={{ mt: 2 }}
      >
        Apply Filters
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          p: 3,
        }}
      >
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchDoctors}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f5f5f5',
        padding: 0,
        margin: 0,
      }}>
        {/* Mobile Filter Button */}
        {isMobile && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              color="primary"
              aria-label="open filters"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* Search Bar */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: 'white' }}>
            <Autocomplete
              freeSolo
              options={suggestions}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Doctors"
                  data-testid="autocomplete-input"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              )}
              onChange={(_, value) => {
                if (typeof value === 'string') {
                  handleSearch(value);
                } else if (value) {
                  handleSearch(value.name);
                }
              }}
              onInputChange={(_, value) => handleSearch(value)}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Avatar 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${option.id}`}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{option.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {option.speciality.join(', ')}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<SearchIcon />}
                      onClick={() => handleBookAppointment(option)}
                    >
                      Book
                    </Button>
                  </Box>
                </li>
              )}
            />
          </Paper>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flex: 1,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: 3,
          p: { xs: 1, sm: 2, md: 3 },
        }}>
          {/* Filters Panel - Desktop */}
          {!isMobile && (
            <Box sx={{ 
              width: 300,
              position: 'sticky',
              top: 20,
              height: 'fit-content',
              alignSelf: 'flex-start',
            }}>
              <Paper elevation={3} sx={{ p: 2, backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Filters
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={handleClearFilters}
                    data-testid="clear-filters"
                  >
                    Clear All
                  </Button>
                </Box>
                
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend" data-testid="filter-header-moc">Consultation Mode</FormLabel>
                  <RadioGroup
                    value={filterState.consultationMode || ''}
                    onChange={(e) => handleConsultationModeChange(e.target.value as ConsultationMode)}
                  >
                    <FormControlLabel
                      value="Video Consult"
                      control={<Radio />}
                      label="Video Consult"
                      data-testid="filter-video-consult"
                    />
                    <FormControlLabel
                      value="In Clinic"
                      control={<Radio />}
                      label="In Clinic"
                      data-testid="filter-in-clinic"
                    />
                  </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend" data-testid="filter-header-speciality">Specialities</FormLabel>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: 1,
                  }}>
                    {allSpecialities.map((speciality) => (
                      <FormControlLabel
                        key={speciality}
                        control={
                          <Checkbox
                            checked={filterState.specialities.includes(speciality)}
                            onChange={() => handleSpecialityChange(speciality)}
                            sx={{
                              '& .MuiSvgIcon-root': {
                                borderRadius: '4px',
                              },
                            }}
                          />
                        }
                        label={speciality}
                        data-testid={`filter-specialty-${speciality.replace(/\s+/g, '-')}`}
                      />
                    ))}
                  </Box>
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setFilteredDoctors(filteredDoctorsMemo)}
                  sx={{ mt: 2 }}
                >
                  Apply Filters
                </Button>
              </Paper>
            </Box>
          )}

          {/* Filters Panel - Mobile */}
          <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 300,
                p: 2,
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Doctors List */}
          <Box sx={{ 
            flex: 1,
            width: '100%',
          }}>
            {/* Sort Controls */}
            <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle1">Sort By:</Typography>
                <Button
                  variant={filterState.sortBy === 'fees' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => handleSortChange('fees')}
                  data-testid="sort-fees"
                >
                  Price: Low to High
                </Button>
                <Button
                  variant={filterState.sortBy === 'experience' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => handleSortChange('experience')}
                  data-testid="sort-experience"
                >
                  Experience: High to Low
                </Button>
              </Box>
            </Paper>

            <Grid container spacing={3}>
              {filteredDoctorsMemo.map((doctor) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={doctor.id}>
                  <Card 
                    elevation={3} 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`}
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            mr: 2,
                            border: '2px solid #2196f3',
                          }} 
                        />
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {doctor.name}
                          </Typography>
                          <Rating value={4.5} precision={0.5} readOnly size="small" />
                        </Box>
                      </Box>
                      
                      <Typography color="textSecondary" gutterBottom>
                        {(doctor.speciality || []).join(', ')}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip 
                          label={`${doctor.experience} years exp`} 
                          size="small" 
                          color="primary" 
                        />
                        <Chip 
                          label={`₹${doctor.fees}`} 
                          size="small" 
                          color="secondary" 
                        />
                        <Chip 
                          label={doctor.consultationMode} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>

                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        startIcon={<SearchIcon />}
                        onClick={() => handleBookAppointment(doctor)}
                        sx={{ mt: 2 }}
                      >
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DoctorListing; 