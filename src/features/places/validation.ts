import * as Yup from 'yup'

export const createPlaceValidationSchema = Yup.object({
    name: Yup.string().required('Place Name is required'),
    description: Yup.string().required('Description is required'),
})

