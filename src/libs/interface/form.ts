export interface PlaceForm {
    placeName: string
    description: string
    latitude?: number | ''
    longitude?: number | ''
    userId?: string
}

export interface SignInForm {
    email: string
}
