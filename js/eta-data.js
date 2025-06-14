/**
 * FedEx Ground ETA Data (in days) from Texas and Detroit Warehouses
 * Data represents business days (Mon-Fri) for standard ground shipping
 * 
 * Structure:
 * - Keys are state abbreviations (e.g., "CA")
 * - Values are integers representing days
 * - "N/A" for states not serviced by a warehouse
 */

const etaData = {
    texas: {
        // Southern States
        AL: 3,  // Alabama
        AR: 2,  // Arkansas
        FL: 4,  // Florida
        GA: 3,  // Georgia
        LA: 2,  // Louisiana
        MS: 2,  // Mississippi
        NM: 3,  // New Mexico
        OK: 2,  // Oklahoma
        TN: 3,  // Tennessee
        TX: 1,  // Texas
        
        // Midwest States
        CO: 4,  // Colorado
        IA: 5,  // Iowa
        IL: 5,  // Illinois
        IN: 5,  // Indiana
        KS: 4,  // Kansas
        KY: 5,  // Kentucky
        MO: 4,  // Missouri
        NE: 5,  // Nebraska
        OH: 6,  // Ohio
        SD: 6,  // South Dakota
        WI: 6,  // Wisconsin
        
        // Western States
        AZ: 3,  // Arizona
        CA: 5,  // California
        NV: 4,  // Nevada
        UT: 4,  // Utah
        
        // Eastern States
        CT: 7,  // Connecticut
        DE: 7,  // Delaware
        DC: 7,  // District of Columbia
        ME: 8,  // Maine
        MD: 7,  // Maryland
        MA: 8,  // Massachusetts
        NH: 8,  // New Hampshire
        NJ: 7,  // New Jersey
        NY: 7,  // New York
        NC: 6,  // North Carolina
        PA: 7,  // Pennsylvania
        RI: 8,  // Rhode Island
        SC: 6,  // South Carolina
        VT: 8,  // Vermont
        VA: 6,  // Virginia
        WV: 7,  // West Virginia
        
        // Non-continental
        AK: 14, // Alaska
        HI: 14, // Hawaii
        PR: 10  // Puerto Rico
    },
    
    detroit: {
        // Midwest States
        IL: 2,  // Illinois
        IN: 1,  // Indiana
        IA: 3,  // Iowa
        KY: 2,  // Kentucky
        MI: 1,  // Michigan
        MN: 3,  // Minnesota
        MO: 3,  // Missouri
        OH: 1,  // Ohio
        WI: 2,  // Wisconsin
        
        // Northeast States
        CT: 3,  // Connecticut
        DE: 3,  // Delaware
        DC: 3,  // District of Columbia
        ME: 4,  // Maine
        MD: 3,  // Maryland
        MA: 4,  // Massachusetts
        NH: 4,  // New Hampshire
        NJ: 3,  // New Jersey
        NY: 3,  // New York
        PA: 3,  // Pennsylvania
        RI: 4,  // Rhode Island
        VT: 4,  // Vermont
        WV: 3,  // West Virginia
        
        // Southern States
        AL: 4,  // Alabama
        FL: 5,  // Florida
        GA: 4,  // Georgia
        LA: 5,  // Louisiana
        MS: 4,  // Mississippi
        NC: 3,  // North Carolina
        SC: 4,  // South Carolina
        TN: 3,  // Tennessee
        VA: 3,  // Virginia
        
        // Western States
        CO: 5,  // Colorado
        ND: 4,  // North Dakota
        SD: 4,  // South Dakota
        WY: 5,  // Wyoming
        
        // Non-continental
        AK: 12, // Alaska
        HI: 12, // Hawaii
        
        // States with longer ETAs from Detroit
        AZ: 6,  // Arizona
        CA: 7,  // California
        ID: 6,  // Idaho
        MT: 6,  // Montana
        NV: 6,  // Nevada
        NM: 6,  // New Mexico
        OR: 7,  // Oregon
        UT: 6,  // Utah
        WA: 7,  // Washington
        
        // Not serviced from Detroit
        AR: 'N/A',  // Arkansas
        KS: 'N/A',  // Kansas
        NE: 'N/A',  // Nebraska
        OK: 'N/A',  // Oklahoma
        TX: 'N/A'   // Texas
    }
};

// For states not explicitly listed (default to N/A)
const allStates = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
                   'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
                   'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
                   'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
                   'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
                   'DC','PR'];

// Ensure all states exist in both warehouses
allStates.forEach(state => {
    if (!etaData.texas[state]) etaData.texas[state] = 'N/A';
    if (!etaData.detroit[state]) etaData.detroit[state] = 'N/A';
});

// Freeze object to prevent accidental modification
Object.freeze(etaData);
