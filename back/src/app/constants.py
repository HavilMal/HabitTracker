# Constants used to describe frequency
EVERY_N_DAYS     = 'every_n_days'
AT_LEAST         = 'at_least'
AT_MOST          = 'at_most'
DAILY            = 'daily'
WEEKLY           = 'weekly'

#habit types
BOOL     = 'bool'
MEASURE  = 'measure'
WATER    = 'water'
MEAL     = 'meal'
ACTIVITY = 'activity'

# Constants used to describe food and meals
CALORIES = 'calories'
CARB     = 'carbs'
PROT     = 'prot'
FAT      = 'fat'

# Constants used in making queries to the database
DB_URL        = 'https://api.nal.usda.gov/fdc/v1/'
DB_PAGE_SIZE  = 10
DB_DATATYPES  = ['Branded', 'Foundation', 'Survey (FNDDS)']
DB_FOOD_ID    = 'fdcId'
DB_FOOD_DESC  = 'description'
DB_FOOD_BRAND = 'brandOwner'
DB_FOOD_SCORE = 'score'

DB_ENERGY      = 'energy'
DB_ENERGY_UNIT = 'kcal'
DB_CARB        = 'carbohydrate'
DB_PROT        = 'protein'
DB_FAT         = 'total lipid'