"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { ChevronLeft, ChevronRight, Calendar, Upload, ChevronUp, ChevronDown, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CalorieTrackerProps, MealTiming } from '@/lib/interfaces/meals/interfaces'

type Meal = {
  name: string
  calories: number
  description: string
}

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Other'

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
    Other: [
      { name: 'Custom meal', calories: 0, description: 'Add your custom meal here.' },
    ],
  },
}

const defaultMealTimings: MealTiming[] = [
  { id: 1, name: 'Breakfast', time: '08:00:00', isDefault: true, createdAt: new Date().toISOString() },
  { id: 2, name: 'Lunch', time: '12:00:00', isDefault: true, createdAt: new Date().toISOString() },
  { id: 3, name: 'Dinner', time: '19:00:00', isDefault: true, createdAt: new Date().toISOString() },
  { id: 4, name: 'Snack', time: '15:00:00', isDefault: true, createdAt: new Date().toISOString() },
  { id: 5, name: 'Other', time: '00:00:00', isDefault: true, createdAt: new Date().toISOString() },
]

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ data }) => {
  const [activeSection, setActiveSection] = useState<'explore' | 'add'>('explore')
  const [activeMealType, setActiveMealType] = useState<MealType>('Breakfast')
  const [expandedMeals, setExpandedMeals] = useState<Set<number>>(new Set())
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [apiData, setApiData] = useState<ApiResponse>(mockApiResponse)
  const [showCalendar, setShowCalendar] = useState(false)
  const [mealName, setMealName] = useState('')
  const [mealDescription, setMealDescription] = useState('')
  const [mealImage, setMealImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [mealTimings, setMealTimings] = useState<MealTiming[]>(data || defaultMealTimings)

  useEffect(() => {
    // In a real application, this would be an API call
    setApiData(mockApiResponse)
  }, [currentDate])

  useEffect(() => {
    if (data) {
      setMealTimings(data)
    }
  }, [data])

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setMealImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setMealImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    const activeMealTiming = mealTimings.find(timing => timing.name === activeMealType)
    
    if (!activeMealTiming) {
      console.error('No matching meal timing found')
      return
    }

    const formData = new FormData()
    formData.append('mealTiming', activeMealTiming.id.toString())
    formData.append('foodName', mealName)
    if (mealImage) {
      formData.append('image', mealImage)
    }
    formData.append('planned', 'true')
    formData.append('timeConsumed', new Date().toISOString())

    try {
      const response = await fetch('/api/user/meals', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        console.log('Meal added successfully')
        // Reset form after submission
        setMealName('')
        setMealDescription('')
        setMealImage(null)
        setImagePreview(null)
      } else {
        console.error('Failed to add meal')
      }
    } catch (error) {
      console.error('Error submitting meal:', error)
    }
  }

  return (
    <div className="max-w-5xl lg:mx-auto lg:w-full bg-gray-50 min-h-screen p-4 mb-16">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigateDate('prev')} aria-label="Previous day">
          <ChevronLeft className="w-6 h-6 text-teal-600" />
        </button>
        <button 
          className="text-lg font-semibold flex items-center gap-2 text-teal-600" 
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          <Calendar className="w-5 h-5" />
        </button>
        <button onClick={() => navigateDate('next')} aria-label="Next day">
          <ChevronRight className="w-6 h-6 text-teal-600" />
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
            pathColor: '#0D9488',
            textColor: '#0D9488',
            trailColor: '#E5E7EB',
          })}
        />
        <p className="text-center text-sm text-gray-500 mt-2">of {apiData.calorieGoal} cals</p>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-center text-teal-700">Calories Consumed Today</h3>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <button 
          className={`py-2 px-4 rounded-full ${activeSection === 'explore' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'}`}
          onClick={() => setActiveSection('explore')}
        >
          Explore Meals
        </button>
        <button 
          className={`py-2 px-4 rounded-full ${activeSection === 'add' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'}`}
          onClick={() => setActiveSection('add')}
        >
          Add Meals
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
        {mealTimings.map((mealTiming) => (
          <button
            key={mealTiming.id}
            className={`py-2 px-3 rounded-lg text-sm ${activeMealType === mealTiming.name ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-teal-600'}`}
            onClick={() => setActiveMealType(mealTiming.name as MealType)}
          >
            {mealTiming.name}
          </button>
        ))}
      </div>

      {activeSection === 'explore' && (
        <div className="bg-white rounded-lg overflow-hidden mb-6 shadow-lg">
          <div className="relative h-48 sm:h-64">
            <Image
              src="/placeholder.png?height=256&width=384"
              alt={`${activeMealType} Ideas`}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black to-transparent w-full">
              <h4 className="text-white font-semibold text-xl">{activeMealType} Ideas</h4>
            </div>
          </div>
          {apiData.mealIdeas[activeMealType].map((idea, index) => (
            <div key={index} className="border-t border-gray-100">
              <button 
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-150"
                onClick={() => toggleMealExpansion(index)}
              >
                <div>
                  <p className="font-medium text-teal-700">{idea.name}</p>
                  <p className="text-sm text-gray-500">{idea.calories} cal</p>
                </div>
                {expandedMeals.has(index) ? (
                  <ChevronUp className="w-4 h-4 text-teal-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-teal-600" />
                )}
              </button>
              {expandedMeals.has(index) && (
                <p className="p-4 text-sm text-gray-600 bg-gray-50">{idea.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'add' && (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-teal-700">Add {activeMealType} Meal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="meal-name" className="block text-sm font-medium text-gray-700 mb-1">
                Meal Name
              </label>
              <Input
                id="meal-name"
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder={`Enter ${activeMealType.toLowerCase()} name`}
                required
                className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div>
              <label htmlFor="meal-description" className="block text-sm font-medium text-gray-700 mb-1">
                Meal Description
              </label>
              <Textarea
                id="meal-description"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                placeholder={`Describe your ${activeMealType.toLowerCase()}`}
                rows={3}
                className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div>
              <label htmlFor="meal-image" className="block text-sm font-medium text-gray-700 mb-1">
                Meal Image
              </label>
              <div className="mt-1 flex items-center">
                <label htmlFor="meal-image" className="cursor-pointer bg-white py-2 px-3 border border-teal-300 rounded-md shadow-sm text-sm leading-4 font-medium text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  <Upload className="w-5 h-5 inline-block mr-2" />
                  Upload Image
                </label>
                <input
                  id="meal-image"
                  name="meal-image"
                  type="file"
                  className="sr-only"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                {mealImage && <span className="ml-3 text-sm text-gray-500">{mealImage.name}</span>}
              </div>
              {imagePreview && (
                <div className="mt-4 relative">
                  <Image
                    src={imagePreview}
                    alt="Meal preview"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 focus:ring-teal-500">
              Add {activeMealType} Meal
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

export default CalorieTracker;