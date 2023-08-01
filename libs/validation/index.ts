import * as Yup from 'yup'

export const MapFormSchema = Yup.object().shape({
    placeName: Yup.string().required('Place Name is required'),
    description: Yup.string().required('Description is required'),
})
