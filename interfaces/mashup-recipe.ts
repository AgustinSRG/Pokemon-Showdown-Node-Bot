// Mashup Recipe structure

enum MashupAuthType {
    Official = 0,
    Spotlight = 1,
    Other = 2,

    Count = 3,

    Undefined = 4
}


interface MashupRecipe {
    name: string
    aliases?: string[]
    // Format used for creating the mashup battle/tour
    baseFormat: string
    additionalRules?: string[]
	isOfficial: boolean
}