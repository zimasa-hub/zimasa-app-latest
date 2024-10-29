// Define the interface for meal timing
export interface MealTiming {
    id: number;
    name: string;
    time: string;
    isDefault: boolean;
    createdAt: string; // ISO string format for date
  }

  export interface CalorieTrackerProps {
    data: MealTiming[] | null; // Prop to accept meal timings
  }

  // Define the interface for the meal logging data

  export interface MealLog {
    mealTiming: number;  // The timing of the meal represented as a number (e.g., 23 for 11 AM)
    foodName: string;    // The name of the food item
    planned?: boolean;    // Optional field for planned amount, now a boolean
    timeConsumed: string; // The time at which the food was consumed
    imageUrl?: string;   // Optional field for the image URL
  }
  
 export interface UserNameProps {
    name: string | null;
    currentMode?: string | null;
    isProvider?: boolean | null;
    onModeSwitch?:() => void;
    currentMemberId: string | null;
  
  }