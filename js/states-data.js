const statesData = [
    {
        name: "Alabama",
        abbreviation: "AL",
        zipPrefix: "35",
        timezone: "America/Chicago"
    },
    {
        name: "Alaska",
        abbreviation: "AK",
        zipPrefix: "99",
        timezone: "America/Anchorage"
    },
    {
        name: "Arizona",
        abbreviation: "AZ",
        zipPrefix: "85",
        timezone: "America/Phoenix"
    },
    {
        name: "Arkansas",
        abbreviation: "AR",
        zipPrefix: "71",
        timezone: "America/Chicago"
    },
    {
        name: "California",
        abbreviation: "CA",
        zipPrefix: "90",
        timezone: "America/Los_Angeles"
    },
    {
        name: "Colorado",
        abbreviation: "CO",
        zipPrefix: "80",
        timezone: "America/Denver"
    },
    {
        name: "Connecticut",
        abbreviation: "CT",
        zipPrefix: "06",
        timezone: "America/New_York"
    },
    {
        name: "Delaware",
        abbreviation: "DE",
        zipPrefix: "19",
        timezone: "America/New_York"
    },
    {
        name: "Florida",
        abbreviation: "FL",
        zipPrefix: "32",
        timezone: "America/New_York"
    },
    {
        name: "Georgia",
        abbreviation: "GA",
        zipPrefix: "30",
        timezone: "America/New_York"
    },
    {
        name: "Hawaii",
        abbreviation: "HI",
        zipPrefix: "96",
        timezone: "Pacific/Honolulu"
    },
    {
        name: "Idaho",
        abbreviation: "ID",
        zipPrefix: "83",
        timezone: "America/Boise"
    },
    {
        name: "Illinois",
        abbreviation: "IL",
        zipPrefix: "60",
        timezone: "America/Chicago"
    },
    {
        name: "Indiana",
        abbreviation: "IN",
        zipPrefix: "46",
        timezone: "America/Indiana/Indianapolis"
    },
    {
        name: "Iowa",
        abbreviation: "IA",
        zipPrefix: "50",
        timezone: "America/Chicago"
    },
    {
        name: "Kansas",
        abbreviation: "KS",
        zipPrefix: "66",
        timezone: "America/Chicago"
    },
    {
        name: "Kentucky",
        abbreviation: "KY",
        zipPrefix: "40",
        timezone: "America/New_York"
    },
    {
        name: "Louisiana",
        abbreviation: "LA",
        zipPrefix: "70",
        timezone: "America/Chicago"
    },
    {
        name: "Maine",
        abbreviation: "ME",
        zipPrefix: "04",
        timezone: "America/New_York"
    },
    {
        name: "Maryland",
        abbreviation: "MD",
        zipPrefix: "20",
        timezone: "America/New_York"
    },
    {
        name: "Massachusetts",
        abbreviation: "MA",
        zipPrefix: "02",
        timezone: "America/New_York"
    },
    {
        name: "Michigan",
        abbreviation: "MI",
        zipPrefix: "48",
        timezone: "America/Detroit"
    },
    {
        name: "Minnesota",
        abbreviation: "MN",
        zipPrefix: "55",
        timezone: "America/Chicago"
    },
    {
        name: "Mississippi",
        abbreviation: "MS",
        zipPrefix: "38",
        timezone: "America/Chicago"
    },
    {
        name: "Missouri",
        abbreviation: "MO",
        zipPrefix: "63",
        timezone: "America/Chicago"
    },
    {
        name: "Montana",
        abbreviation: "MT",
        zipPrefix: "59",
        timezone: "America/Denver"
    },
    {
        name: "Nebraska",
        abbreviation: "NE",
        zipPrefix: "68",
        timezone: "America/Chicago"
    },
    {
        name: "Nevada",
        abbreviation: "NV",
        zipPrefix: "89",
        timezone: "America/Los_Angeles"
    },
    {
        name: "New Hampshire",
        abbreviation: "NH",
        zipPrefix: "03",
        timezone: "America/New_York"
    },
    {
        name: "New Jersey",
        abbreviation: "NJ",
        zipPrefix: "07",
        timezone: "America/New_York"
    },
    {
        name: "New Mexico",
        abbreviation: "NM",
        zipPrefix: "87",
        timezone: "America/Denver"
    },
    {
        name: "New York",
        abbreviation: "NY",
        zipPrefix: "10",
        timezone: "America/New_York"
    },
    {
        name: "North Carolina",
        abbreviation: "NC",
        zipPrefix: "27",
        timezone: "America/New_York"
    },
    {
        name: "North Dakota",
        abbreviation: "ND",
        zipPrefix: "58",
        timezone: "America/Chicago"
    },
    {
        name: "Ohio",
        abbreviation: "OH",
        zipPrefix: "43",
        timezone: "America/New_York"
    },
    {
        name: "Oklahoma",
        abbreviation: "OK",
        zipPrefix: "73",
        timezone: "America/Chicago"
    },
    {
        name: "Oregon",
        abbreviation: "OR",
        zipPrefix: "97",
        timezone: "America/Los_Angeles"
    },
    {
        name: "Pennsylvania",
        abbreviation: "PA",
        zipPrefix: "15",
        timezone: "America/New_York"
    },
    {
        name: "Rhode Island",
        abbreviation: "RI",
        zipPrefix: "02",
        timezone: "America/New_York"
    },
    {
        name: "South Carolina",
        abbreviation: "SC",
        zipPrefix: "29",
        timezone: "America/New_York"
    },
    {
        name: "South Dakota",
        abbreviation: "SD",
        zipPrefix: "57",
        timezone: "America/Chicago"
    },
    {
        name: "Tennessee",
        abbreviation: "TN",
        zipPrefix: "37",
        timezone: "America/Chicago"
    },
    {
        name: "Texas",
        abbreviation: "TX",
        zipPrefix: "75",
        timezone: "America/Chicago"
    },
    {
        name: "Utah",
        abbreviation: "UT",
        zipPrefix: "84",
        timezone: "America/Denver"
    },
    {
        name: "Vermont",
        abbreviation: "VT",
        zipPrefix: "05",
        timezone: "America/New_York"
    },
    {
        name: "Virginia",
        abbreviation: "VA",
        zipPrefix: "20",
        timezone: "America/New_York"
    },
    {
        name: "Washington",
        abbreviation: "WA",
        zipPrefix: "98",
        timezone: "America/Los_Angeles"
    },
    {
        name: "West Virginia",
        abbreviation: "WV",
        zipPrefix: "24",
        timezone: "America/New_York"
    },
    {
        name: "Wisconsin",
        abbreviation: "WI",
        zipPrefix: "53",
        timezone: "America/Chicago"
    },
    {
        name: "Wyoming",
        abbreviation: "WY",
        zipPrefix: "82",
        timezone: "America/Denver"
    }
];

// For territories if needed later
const territoriesData = [
    {
        name: "Puerto Rico",
        abbreviation: "PR",
        zipPrefix: "00",
        timezone: "America/Puerto_Rico"
    },
    {
        name: "Washington DC",
        abbreviation: "DC",
        zipPrefix: "20",
        timezone: "America/New_York"
    }
    // Add other territories as needed
];
