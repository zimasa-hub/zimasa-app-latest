"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { ChevronLeft, ChevronRight, Plus, ChevronUp, ChevronDown, Calendar } from 'lucide-react'

type Meal = {
  name: string
  calories: number
  description: string
}

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'

type ApiResponse = {
  date: string
  caloriesConsumed: number
  calorieGoal: number
  mealIdeas: Record<MealType, Meal[]>
}

const mockApiResponse: ApiResponse = {
  date: '2024-09-05',
  caloriesConsumed: 740,
  calorieGoal: 2000,
  mealIdeas: {
    Breakfast: [
      { name: 'Oatmeal with berries', calories: 250, description: 'A hearty bowl of oatmeal topped with fresh mixed berries. High in fiber and antioxidants.' },
      { name: 'Greek yogurt with honey', calories: 200, description: 'Creamy Greek yogurt drizzled with honey. Rich in protein and probiotics.' },
      { name: 'Whole grain toast with avocado', calories: 300, description: 'Toasted whole grain bread topped with mashed avocado. Packed with healthy fats and fiber.' },
    ],
    Lunch: [
      { name: 'Grilled chicken salad', calories: 350, description: 'Mixed greens topped with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette.' },
      { name: 'Quinoa and black bean bowl', calories: 400, description: 'Protein-packed bowl with quinoa, black beans, roasted vegetables, and lime dressing.' },
    ],
    Dinner: [
      { name: 'Baked salmon with roasted vegetables', calories: 450, description: 'Oven-baked salmon fillet served with a medley of roasted seasonal vegetables.' },
      { name: 'Vegetarian stir-fry', calories: 300, description: 'Colorful mix of stir-fried tofu and vegetables in a light soy-ginger sauce.' },
    ],
    Snack: [
      { name: 'Apple slices with peanut butter', calories: 200, description: 'Crisp apple slices served with a side of creamy peanut butter for dipping.' },
      { name: 'Carrot sticks and hummus', calories: 150, description: 'Fresh carrot sticks paired with smooth, protein-rich hummus.' },
    ],
  },
}

export default function CalorieTracker () {
  const [activeSection, setActiveSection] = useState<'explore' | 'add'>('explore')
  const [activeMealType, setActiveMealType] = useState<MealType>('Breakfast')
  const [expandedMeals, setExpandedMeals] = useState<Set<number>>(new Set())
  const [currentDate, setCurrentDate] = useState<Date>(new Date(mockApiResponse.date))
  const [apiData, setApiData] = useState<ApiResponse>(mockApiResponse)
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    // In a real application, this would be an API call
    setApiData(mockApiResponse)
  }, [currentDate])

  const percentage = (apiData.caloriesConsumed / apiData.calorieGoal) * 100
  
  const toggleMealExpansion = (index: number) => {
    setExpandedMeals((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
    setShowCalendar(false)
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(new Date(event.target.value))
    setShowCalendar(false)
  }

  return (
    <div className="max-w-3xl lg:mx-auto lg:w-full bg-gray-50 min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigateDate('prev')} aria-label="Previous day">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          className="text-lg font-semibold flex items-center gap-2" 
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          <Calendar className="w-5 h-5" />
        </button>
        <button onClick={() => navigateDate('next')} aria-label="Next day">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {showCalendar && (
        <div className="mb-4 p-2 bg-white rounded-lg shadow">
          <input 
            type="date" 
            value={currentDate.toISOString().split('T')[0]} 
            onChange={handleDateChange}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      <div className="w-32 h-32 mx-auto mb-6">
        <CircularProgressbar
          value={percentage}
          text={`${apiData.caloriesConsumed}`}
          styles={buildStyles({
            textSize: '22',
            pathColor: '#10B981',
            textColor: '#111827',
            trailColor: '#E5E7EB',
          })}
        />
        <p className="text-center text-sm text-gray-500 mt-2">of {apiData.calorieGoal} cals</p>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-center">Calories Consumed Today</h3>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <button 
          className={`py-2 px-4 rounded-full ${activeSection === 'explore' ? 'bg-custom-green text-white' : 'bg-white text-custom-greenbg-custom-green border border-custom-greenbg-custom-green'}`}
          onClick={() => setActiveSection('explore')}
        >
          Explore Meals
        </button>
        <button 
          className={`py-2 px-4 rounded-full ${activeSection === 'add' ? 'bg-custom-green text-white' : 'bg-white text-custom-greenbg-custom-green border border-custom-greenbg-custom-green'}`}
          onClick={() => setActiveSection('add')}
        >
          Add Meals
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map((meal) => (
          <button
            key={meal}
            className={`py-2 px-3 rounded-lg text-sm ${activeMealType === meal ? 'bg-custom-green text-white' : 'bg-white border border-gray-200'}`}
            onClick={() => setActiveMealType(meal)}
          >
            {meal}
          </button>
        ))}
      </div>

      {activeSection === 'explore' && (
        <div className="bg-white rounded-lg overflow-hidden mb-6">
          <div className="relative h-48 sm:h-64">
            <Image
              src="/placeholder.png?height=192&width=384"
              alt={`${activeMealType} Ideas`}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black to-transparent w-full">
              <h4 className="text-white font-semibold text-xl">{activeMealType} Ideas</h4>
            </div>
          </div>
          {apiData.mealIdeas[activeMealType].map((idea, index) => (
            <div key={index} className="border-t">
              <button 
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => toggleMealExpansion(index)}
              >
                <div>
                  <p className="font-medium">{idea.name}</p>
                  <p className="text-sm text-gray-500">{idea.calories} cal</p>
                </div>
                {expandedMeals.has(index) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {expandedMeals.has(index) && (
                <p className="p-4 text-sm text-gray-600">{idea.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'add' && (
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm">Add a meal (Coming soon...)</p>
        </div>
      )}
    </div>
  )
}
