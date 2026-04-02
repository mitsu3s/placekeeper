import { ErrorMessage, Field, Form, Formik } from 'formik'
import type { CreatePlaceFormValues } from '@/features/places/types'
import { createPlaceValidationSchema } from '@/features/places/validation'
import type { LatLngTuple } from '@/lib/geo'

const initialValues: CreatePlaceFormValues = {
    name: '',
    description: '',
}

interface PlaceFormPanelProps {
    selectedPosition: LatLngTuple | null
    isSubmitting: boolean
    onSubmit: (values: CreatePlaceFormValues) => Promise<boolean>
}

export function PlaceFormPanel({
    selectedPosition,
    isSubmitting,
    onSubmit,
}: PlaceFormPanelProps) {
    return (
        <div className="bg-white py-4 w-full flex justify-center pl-3 pr-4">
            <div className="w-full max-w-2xl rounded-lg border p-4 divide-y divide-gray-200">
                <Formik
                    initialValues={initialValues}
                    validationSchema={createPlaceValidationSchema}
                    onSubmit={async (values, actions) => {
                        const isSuccess = await onSubmit(values)

                        if (isSuccess) {
                            actions.resetForm()
                        }

                        actions.setSubmitting(false)
                    }}
                >
                    {({ isValid, isSubmitting: isFormikSubmitting }) => (
                        <Form className="flex w-full flex-col gap-4">
                            <div className="px-4">
                                <div className="relative max-w-xs">
                                    <label
                                        htmlFor="name"
                                        className="text-gray-500 text-xs uppercase"
                                    >
                                        Place Name
                                    </label>
                                    <Field
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="p-1 block w-full rounded-md border border-gray-200 text-sm text-gray-800 outline-none ring-gray-300 transition duration-100 focus-visible:ring"
                                        autoComplete="off"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                            </div>
                            <div className="px-4">
                                <div className="relative max-w-xs">
                                    <label
                                        htmlFor="description"
                                        className="text-gray-500 text-xs uppercase"
                                    >
                                        Description
                                    </label>
                                    <Field
                                        type="text"
                                        id="description"
                                        name="description"
                                        className="p-1 block w-full rounded-md border border-gray-200 text-sm text-gray-800 outline-none ring-gray-300 transition duration-100 focus-visible:ring"
                                        autoComplete="off"
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex justify-end px-4">
                                <button
                                    type="submit"
                                    className={`px-4 py-2 rounded text-sm font-medium ${
                                        isSubmitting ||
                                        isFormikSubmitting ||
                                        !isValid ||
                                        selectedPosition === null
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                    disabled={
                                        isSubmitting ||
                                        isFormikSubmitting ||
                                        !isValid ||
                                        selectedPosition === null
                                    }
                                >
                                    {isSubmitting ? 'Loading...' : 'Create'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

