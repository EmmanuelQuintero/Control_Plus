import { useState } from "react";
import { Apple, Flame, Target } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { MealCard } from "@/components/meal-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Nutrition() {
  const [mealType, setMealType] = useState("");
  const [calories, setCalories] = useState("");

  const handleLogMeal = () => {
    console.log("Logging meal:", { mealType, calories });
    setMealType("");
    setCalories("");
  };

  const todaysMeals = [
    {
      type: "Breakfast",
      time: "8:30 AM",
      calories: 450,
      items: ["Oatmeal with berries", "Greek yogurt", "Orange juice"],
    },
    {
      type: "Lunch",
      time: "12:45 PM",
      calories: 620,
      items: ["Grilled chicken salad", "Whole grain bread", "Apple"],
    },
    {
      type: "Snack",
      time: "3:30 PM",
      calories: 180,
      items: ["Protein bar", "Almonds"],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nutrition Tracking</h1>
        <p className="text-muted-foreground">Monitor your daily food intake</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Calories Today"
          value="1,847"
          icon={Flame}
          subtitle="Goal: 2,000"
          color="nutrition"
        />
        <StatCard
          title="Meals Logged"
          value="3"
          icon={Apple}
          subtitle="Today"
          color="success"
        />
        <StatCard
          title="Target Met"
          value="92%"
          icon={Target}
          subtitle="This week"
          color="primary"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card data-testid="card-log-meal">
          <CardHeader>
            <CardTitle>Log Meal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mealType">Meal Type</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger id="mealType" data-testid="select-meal-type">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="Enter calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                data-testid="input-calories"
              />
            </div>
            <Button onClick={handleLogMeal} className="w-full" data-testid="button-log-meal">
              Log Meal
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Today's Meals</h3>
          {todaysMeals.map((meal, idx) => (
            <MealCard key={idx} {...meal} />
          ))}
        </div>
      </div>
    </div>
  );
}
