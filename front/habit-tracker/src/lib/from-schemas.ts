import z from "zod";

const habitSchema = z.object({
	name: z.string().min(1),
	type: z.enum(["bool", "measure", "water", "activity", "meal"]),
	notes: z.string(),
})

export type HabitSchema = z.infer<typeof habitSchema>

export const boolSchema = habitSchema.extend({
	freq_type: z.enum(["daily", "weekly", "monthly"]),
	freq_value: z.number(),
	unit: z.string(),
	target_value: z.number(),
	target_type: z.enum(["at_least", "at_most"]),
})

export type BoolSchema = z.infer<typeof boolSchema>


export const measureSchema = habitSchema.extend({
	freq_type: z.enum(["daily", "weekly", "monthly"]),
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
	unit: z.string(),
	target_value: z.number(),
	target_type: z.enum(["at_least", "at_most"]),
	target_data_unit: z.enum(["prot", "fat", "carb", "calories"]),
})

export type MealSchema= z.infer<typeof mealSchema>

export const activitySchema= habitSchema.extend({
	unit: z.string(),
	freq_type: z.enum(["daily", "weekly", "monthly"]),
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