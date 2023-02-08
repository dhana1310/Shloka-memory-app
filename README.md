

# To run the program locally 
	1. 	regular==>>>
		npm run start

	2. with webpack==>>>
	    npm run webPackDev

# To build the program 
	1. regular==>>>
		npm run build

	2. with webpack==>>>
		npm run webPackBuild

# To create the android project
	ionic capacitor add android

# To open the android project in Android studio
	npx cap open android

# Sample response json
`{
	"allShlokasList": [
		{
			"bookShortCode": "BG",
			"chaptersList": [
				{
					"chapterNumber": "2",
					"selectedShlokas": [
						"69",
						"70"
					]
				},
				{
					"chapterNumber": "3",
					"selectedShlokas": [
						"1",
						"2"
					]
				}
			],
			"cantosList": []
		},
		{
			"bookShortCode": "SB",
			"chaptersList": [],
			"cantosList": [
				{
					"cantoNumber": "1",
					"chaptersList": [
						{
							"chapterNumber": "2",
							"selectedShlokas": [
								"1",
								"2"
							]
						}
					]
				}
			]
		},
		{
			"bookShortCode": "CC",
			"chaptersList": [],
			"cantosList": [
				{
					"cantoNumber": "Madhya",
					"chaptersList": [
						{
							"chapterNumber": "21",
							"selectedShlokas": [
								"1",
								"2",
								"148"
							]
						}
					]
				}
			]
		}
	]
}`