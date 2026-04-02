import * as Yup from 'yup'

export const signInValidationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
})

