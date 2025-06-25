import z from "zod";


// adding-card

const habitSchema = z.object({
	name: z.string().min(1),
	type: z.enum(["bool", "measure", "water", "activity", "meal"]),
	notes: z.string(),
})

export type HabitSchema = z.infer<typeof habitSchema>

export const boolSchema = habitSchema.extend({
	freq_type: z.enum(["daily", "every_n_days"]),
	freq_value: z.number().min(1).max(6),
})

export type BoolSchema = z.infer<typeof boolSchema>


export const measureSchema = habitSchema.extend({
	freq_type: z.enum(["daily", "weekly"]),
	unit: z.string(),
	target_value: z.number(),
	target_type: z.enum(["at_least", "at_most"]),
})

export type MeasureSchema = z.infer<typeof measureSchema>

export const waterSchema = habitSchema.extend({
	target_value: z.number(),
})

export type WaterSchema= z.infer<typeof waterSchema>

export const mealSchema = habitSchema.extend({
	target_value: z.number(),
	target_type: z.enum(["at_least", "at_most"]),
	target_data_unit: z.enum(["prot", "fat", "carb", "calories"]),
})

export type MealSchema= z.infer<typeof mealSchema>

export const activitySchema= habitSchema.extend({
	unit: z.string(),
	freq_type: z.enum(["daily", "weekly"]),
	target_value: z.number(),
})

export type ActivitySchema= z.infer<typeof activitySchema>


export const schemas = {
	bool: boolSchema,
	measure: measureSchema,
	water: waterSchema,
	meal: mealSchema,
	activity: activitySchema,
}

export type FormTypes = keyof typeof schemas;

// completion-meal-card

export const foodSchema = z.object({
	product_name: z.string().min(1),
	calories: z.number(),
	carbs: z.number(),
	prot: z.number(),
	fat: z.number(),
	grams: z.number(),
});

export type FoodSchema = z.infer<typeof foodSchema>;

export const mealsSchema = z.object({
	name: z.string().min(1),
	created_at: z.string(),
	foods: z.array(foodSchema),
})

export type MealsSchema = z.infer<typeof mealsSchema>
