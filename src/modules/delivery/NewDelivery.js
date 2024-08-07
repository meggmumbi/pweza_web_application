import clsx from 'clsx';
import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Grid,
  Select,
  StepConnector,
  MenuItem,
  FormControl,
  Stepper, Step, StepLabel,
  FormLabel,
  useTheme,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker,Autocomplete  } from '@react-google-maps/api';
import { spacing } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  getBikes
} from "../../common/apis/bike";
import {
  getUsers
} from "../../common/apis/account";
import {
  getPackages
} from "../../common/apis/packages";
import {
  postDelivery, updateDelivery
} from "../../common/apis/delivery";
import Paper from "@mui/material/Paper";
import "react-toastify/dist/ReactToastify.min.css";
import PublishIcon from '@mui/icons-material/Publish';
import { getOrderByUserId } from '../../common/apis/orders';
import { Person, LocationOn, CheckCircle, ArrowBack, ArrowForward } from '@mui/icons-material';
import { getFromLocalStorage } from '../../common/utils/LocalStorage';


const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const mapStyles = [
  {
    "featureType": "water",
    "stylers": [
      { "saturation": 43 },
      { "lightness": -11 },
      { "hue": "#0088ff" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      { "hue": "#ff0000" },
      { "saturation": -100 },
      { "lightness": 99 }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#808080" },
      { "lightness": 54 }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#ece2d9" }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#ccdca1" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#767676" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  /* Add more styles as needed */
];


const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient(95deg, rgba(255, 107, 107,1) 0%, rgba(255, 158, 107,1) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient(95deg, rgba(255, 107, 107,1) 0%, rgba(255, 158, 107,1) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Icons for each step
const useColorlibStepIconStyles = styled({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient(136deg, rgba(255, 107, 107,1) 0%, rgba(255, 158, 107,1) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient(136deg, rgba(255, 107, 107,1) 0%, rgba(255, 158, 107,1) 100%)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <Person />,
    2: <LocationOn />,
    3: <PublishIcon />,
    4: <CheckCircle />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}
const steps = ['Basic Details', 'Address', 'Submit Application'];

const containerStyle = {
  width: '800px',
  height: '600px'
};

const center = {
  lat: 1.2921,
  lng: 36.8219
};

const NewDelivery = () => {
  const row = getFromLocalStorage("applications-detail-row") || {}
  const account = getFromLocalStorage("user") || {}
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  let { id } = useParams();
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const [cost, setCost] = useState(0);
  const [sourceAutocomplete, setSourceAutocomplete] = useState(null);
  const [destinationAutocomplete, setDestinationAutocomplete] = useState(null);

  const onLoadSourceAutocomplete = (autocomplete) => {
    setSourceAutocomplete(autocomplete);
  };

  const onLoadDestinationAutocomplete = (autocomplete) => {
    setDestinationAutocomplete(autocomplete);
  };

  const onPlaceChangedSource = () => {
    const place = sourceAutocomplete.getPlace();
    if (place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()   
      };
      const loc = {
        name: place.name,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng()   
      };
      
      setSource(location);
      formik.setFieldValue('sourceLocation', loc);
      if (destination) {
        calculateDistance(location, destination);
      }
    }
  };

  const onPlaceChangedDestination = () => {
    const place = destinationAutocomplete.getPlace();
    if (place.geometry) {
      const location = {        
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()   
      };
      const loc = {
        name: place.name,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng()   
      };
      setDestination(location);
      formik.setFieldValue('destinationLocation', loc);
      if (source) {
        calculateDistance(source, location);
      }
    }
  };

  const handleMapClick = async (event) => {
    const location = {
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng()
    };

    if (!source) {
      setSource(location);
      
    } else {
      setDestination(location);
      formik.setFieldValue('destinationAddress', `${location.lat},${location.lng}`);
      calculateDistance(source, location);
    }
  };

  const calculateDistance = (source, destination) => {
    const radlat1 = Math.PI * source.lat / 180;
    const radlat2 = Math.PI * destination.lat / 180;
    const theta = source.lng - destination.lng;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344; // Distance in kilometers
    setDistance(dist);
    //formik.setFieldValue('distance', dist);
    calculateCost(dist);
  };

  const calculateCost = (distance) => {
    const ratePerKm = 2; // Define your cost per kilometer      
    setCost(distance * ratePerKm);
    // formik.setFieldValue('cost', distance * ratePerKm);
  };

  const postMutation = useMutation({ mutationFn: postDelivery });
  const updateMutation = useMutation({ mutationFn: updateDelivery });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      formik.handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const { data: bikeData } = useQuery({
    queryKey: 'getBikes',
    queryFn: getBikes,

  });

  const { data: packageData, isLoading, error } = useQuery({
    queryKey: 'getPackages',
    queryFn: getPackages,

  });
  const { data: ridersData } = useQuery({
    queryKey: 'getUsers',
    queryFn: getUsers,

  });

  const { data: orderData } = useQuery({
    queryKey: ['orders',account.id],
    queryFn: getOrderByUserId
});

  const riders = ridersData?.data?.users.filter(user => user.roles.includes('Rider'));

  const formik = useFormik({

    initialValues: {
      orderId: row?.userId || "",
      userId: row?.userId || account.id,
      riderId: row?.riderId || "",
      bikeId: row?.bikeId || "",  
      packageId: row?.packageId || "",  
      status: row?.status || 0,
      sourceLocation: {
        name: '',
        latitude: 0,
        longitude: 0
      },
      destinationLocation: {
        name: '',
        latitude: 0,
        longitude: 0
      }
    },
    validationSchema: Yup.object().shape({
      packageId: Yup.string().required("Required"),
      bikeId: Yup.string().required("Required"),
      riderId: Yup.string().required("Required"),
      orderId: Yup.string().required("Required"),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      console.log(values);
      try {
        console.log("values", values);
        const payload = [

        ]
        if (row?.id) {
          values.id = row.id;

          await updateMutation.mutateAsync(values);

        } else {

          await postMutation.mutateAsync(values);

        }
        toast.success("Successfully Added a new Delivey", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: handleToastClose,
        });
      } catch (error) {
        toast.error(error.response.data, {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    },
  });

  const handleToastClose = () => {
    navigate("/pweza/delivery");

  };


  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid
              container
              spacing={5}
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item sm={6}>
                <FormControl sx={{ m: 1, width: "100%", marginBottom: "5px" }} size="medium">
                  <FormLabel
                    style={{
                      fontSize: "16px",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    Bike
                  </FormLabel>
                  <Select
                    name="bikeId"
                    label="bikeId"
                    value={formik.values.bikeId}
                    error={Boolean(formik.touched.bikeId && formik.errors.bikeId)}
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                    sx={{
                      marginTop: 2,
                      '& legend': { display: 'none' },
                      '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                    }}
                    my={2}
                  >
                    {bikeData?.data?.map((bikeType) => (
                      <MenuItem key={bikeType.id} value={bikeType.id}>
                        {bikeType.model}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={5}
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item sm={6}>
                <FormControl sx={{ m: 1, width: "100%", marginBottom: "5px" }} size="medium">
                  <FormLabel
                    style={{
                      fontSize: "16px",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    Package
                  </FormLabel>
                  <Select
                    name="packageId"
                    label="packageId"
                    value={formik.values.packageId}
                    error={Boolean(formik.touched.packageId && formik.errors.packageId)}
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                    sx={{
                      marginTop: 2,
                      '& legend': { display: 'none' },
                      '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                    }}
                    my={2}
                  >
                    {packageData?.data?.map((packaged) => (
                      <MenuItem key={packaged.id} value={packaged.id}>
                        {packaged.type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={5}
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item sm={6}>
                <FormControl sx={{ m: 1, width: "100%", marginBottom: "5px" }} size="medium">
                  <FormLabel
                    style={{
                      fontSize: "16px",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    Rider
                  </FormLabel>
                  <Select
                    name="riderId"
                    label="riderId"
                    value={formik.values.riderId}
                    error={Boolean(formik.touched.riderId && formik.errors.riderId)}
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                    sx={{
                      marginTop: 2,
                      '& legend': { display: 'none' },
                      '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                    }}
                    my={2}
                  >
                    {riders?.map((rider) => (
                      <MenuItem key={rider.id} value={rider.id}>
                        {rider.userName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={5}
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item sm={6}>
                <FormControl sx={{ m: 1, width: "100%", marginBottom: "5px" }} size="medium">
                  <FormLabel
                    style={{
                      fontSize: "16px",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    Order
                  </FormLabel>
                  <Select
                    name="orderId"
                    label="orderId"
                    value={formik.values.orderId}
                    error={Boolean(formik.touched.orderId && formik.errors.orderId)}
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                    sx={{
                      marginTop: 2,
                      '& legend': { display: 'none' },
                      '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                    }}
                    my={2}
                  >
                    {orderData?.data.map((order) => (
                      <MenuItem key={order.id} value={order.id}>
                        {order.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box style={{ maxWidth: '100%', margin: 'auto', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <LoadScript googleMapsApiKey="AIzaSyAuWt5mMOgPSby9vFXFfti_LEDRuV97-Eg" libraries={['places']}>
            <Autocomplete onLoad={onLoadSourceAutocomplete} onPlaceChanged={onPlaceChangedSource}>
              <TextField
                label="Source Address"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Autocomplete>
            <Autocomplete onLoad={onLoadDestinationAutocomplete} onPlaceChanged={onPlaceChangedDestination}>
              <TextField
                label="Destination Address"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Autocomplete>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={center}
              zoom={7}
              options={{
                styles: mapStyles,
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
              }}
              onClick={handleMapClick}
            >
              {source && <Marker position={source} label="S" icon={{ path: MyLocationIcon, scale: 7, fillColor: '#1976d2', fillOpacity: 1, strokeWeight: 2 }} />}
              {destination && <Marker position={destination} label="D" icon={{ path: LocationOnIcon, scale: 7, fillColor: '#ff4081', fillOpacity: 1, strokeWeight: 2 }} />}
            </GoogleMap>
          </LoadScript>
          <Box mt={2} style={{ textAlign: 'center' }}>
            <Typography variant="h6" style={{ margin: '10px 0' }}>Distance: <strong>{distance.toFixed(2)} km</strong></Typography>
            <Typography variant="h6" style={{ margin: '10px 0' }}>Cost: <strong>${cost.toFixed(2)}</strong></Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => { setSource(null); setDestination(null); setDistance(0); setCost(0); }}
            style={{ display: 'block', margin: '20px auto' }}
          >
            Reset
          </Button>
        </Box>

        );
      case 2:
        return (
          <Box>

          </Box>
        );
      default:
        return <div>Unknown Step</div>;
    }
  };


  return (
    <React.Fragment>
      <ToastContainer />
      <Grid container spacing={3} alignItems="stretch" >
        <Grid item md={12} style={{ display: "flex", width: "100%" }}>
          <Paper
            square={true}
            sx={{
              borderTop: 5,
              borderColor: "#4ab7e0",
              width: "100%",
              px: 3,
              py: 5,
            }}
            elevation={8}
          >
            <Grid
              item
              xs={12}
              md={6}
              sm={6}
              sx={{ padding: "10px", textAlign: "left" }}
            >
              <Typography
                gutterBottom
                sx={{ fontSize: "2.5rem", fontWeight: "bold" }}
              >
                Application
              </Typography>
              <Typography gutterBottom>Add New Delivery details below</Typography>
            </Grid>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon} style={{
                    color: activeStep === index ? '#1976d2' : '#bdbdbd', // Active step in blue, others in grey
                    fontWeight: activeStep === index ? 'bold' : 'normal', // Bold for active step
                  }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <form onSubmit={formik.handleSubmit}>
              <Card mb={12}>
                <CardContent>
                  {formik.isSubmitting ? (
                    <Box display="flex" justifyContent="center" my={6}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>

                      {renderStepContent(activeStep)}
                      <div>
                        <Grid item xl={12} xs={12} md={12} sx={{ marginTop: '50px' }}>
                          <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Button
                              variant="contained"
                              sx={{
                                fontSize: '14px',
                                fontWeight: 'bolder',
                                backgroundColor: '#333333',
                              }}
                              startIcon={<ArrowBack />}
                              disabled={activeStep === 0}
                              onClick={handleBack}

                            >
                              Back
                            </Button>
                            <Button
                              variant="contained"
                              sx={{
                                fontSize: "14px",
                                fontWeight: "bolder",
                                backgroundColor: "#333333",
                                "&:hover": {
                                  background: "#E19133",
                                  color: "white",
                                },
                              }}
                              startIcon={<ArrowForward />}
                              onClick={handleNext}
                              type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                            >
                              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                            </Button>
                          </Grid>
                        </Grid>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default NewDelivery;
