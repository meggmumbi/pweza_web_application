import React from 'react';
import { Box, Button, MenuItem, TextField, Typography, Grid, Breadcrumbs, Link } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    postProduct,
    updateProduct
  } from "../../common/apis/product";
  import { ToastContainer, toast } from "react-toastify";
  import { useNavigate, useParams } from "react-router-dom";
  import "react-toastify/dist/ReactToastify.min.css";
  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { useFormik } from "formik";
  import { getFromLocalStorage } from '../../common/utils/LocalStorage';


// Validation schema using Yup
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Product Name is required'),
    category: Yup.string().required('Category is required'),
    type: Yup.string().required('Type is required'),
    description: Yup.string(),
    size: Yup.string(),
    color: Yup.string(),
    weight: Yup.string(),
    material: Yup.string(),
    features: Yup.string(),
    condition: Yup.string().required('Condition is required'),
});



const CreateProduct = () => {
    const navigate = useNavigate();
    const row = getFromLocalStorage("products-detail-row") || {}
    const account = getFromLocalStorage("user") || {}
    const postMutation = useMutation({ mutationFn: postProduct });
    const updateMutation = useMutation({ mutationFn: updateProduct });

    const initialValues = {
        name: row?.name || "",
        category: row?.category || "",
        type:row?.type || "Physical",
        description: row?.description || "",
        size: row?.size || "",
        color: row?.color || "",
        weight:row?.weight || "",
        material:row?.material || "",
        features: row?.features || "",
        condition: row?.condition || "",
       
    };

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            if (row?.id) {
                values.id = row.id;
                values.userId = account.id;
                await updateMutation.mutateAsync(values);
            } else {
                values.userId = account.id;
                await postMutation.mutateAsync(values);
            }
            toast.success("Successfully submitted product", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                onClose: handleToastClose,
            });
            resetForm();
        } catch (error) {
            toast.error(error.response?.data || error.message, {
                position: "top-right",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleToastClose = () => {
        navigate("/pweza/products");
    
      };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, handleChange, handleBlur, values }) => (
                <Form>
                     <ToastContainer />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '100vh',
                           
                            marginLeft: '350px',
                            py: 5,
                        }}
                    >
                       
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                boxShadow: 5,
                                borderRadius: 3,
                                p: 4,
                                maxWidth: 1000,
                                width: '100%',
                                '& .MuiTextField-root': {
                                    backgroundColor: '#fff',
                                    borderRadius: 1,
                                },
                                '& .MuiButton-root': {
                                    transition: 'all 0.3s ease-in-out',
                                },                                
                            }}
                        >
                            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                                <Link underline="hover" color="inherit" href="/">
                                    Home
                                </Link>
                                <Link underline="hover" color="inherit" href="/products">
                                    Products
                                </Link>
                                <Typography color="textPrimary">Create Product</Typography>
                            </Breadcrumbs>

                            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                                Create Product
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        name="name"
                                        label="Product Name"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name}
                                        helperText={<ErrorMessage name="name" />}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        select
                                        name="condition"
                                        label="Condition"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.condition}
                                        helperText={<ErrorMessage name="condition" />}
                                        required
                                    >
                                        <MenuItem value="new">New</MenuItem>
                                        <MenuItem value="used">Used</MenuItem>
                                    </Field>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        select
                                        name="category"
                                        label="Category"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.category}
                                        helperText={<ErrorMessage name="category" />}
                                        required
                                    >
                                        <MenuItem value="category1">Category 1</MenuItem>
                                        <MenuItem value="category2">Category 2</MenuItem>
                                        <MenuItem value="category3">Category 3</MenuItem>
                                    </Field>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        select
                                        name="type"
                                        label="Type"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.type}
                                        defaultValue="Physical"
                                        helperText={<ErrorMessage name="type" />}
                                        required
                                    >
                                        <MenuItem value="Physical">Physical</MenuItem>
                                        <MenuItem value="Digital">Digital</MenuItem>
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="description"
                                        label="Description"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.description}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        name="size"
                                        label="Size"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.size}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        name="color"
                                        label="Color"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.color}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        name="weight"
                                        label="Weight"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.weight}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        name="material"
                                        label="Material"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.material}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="features"
                                        label="Features"
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.features}
                                    />
                                </Grid>


                            </Grid>
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
                                        startIcon={<ArrowBackIcon />}
                                        href="/pweza/products"

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
                                        startIcon={<AddCircleIcon />}

                                        type='submit'
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>


                        </Box>
                      
                    </Box>
                    
                </Form>
            )}
           
        </Formik>
        
    );
};

export default CreateProduct;
