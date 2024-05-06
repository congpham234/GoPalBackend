export interface PlanTripInput {
  // Names of locations, cities, districts, places, counties etc.
  query: string
  country: string
  numOfDays: number
}

export interface PlanTripOutput {
  itinerary: Day[]
}

export interface Day {
  dayNumber: number
  activities: Activity[]
}

export interface Activity {
  activityName: string
  location: string
  description: string
}
