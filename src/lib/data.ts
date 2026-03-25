export type Department = 'Health' | 'Agriculture';

export interface DataRow {
  id: string;
  state: string;
  year: number;
  metricName: string;
  value: number;
}

export const healthData: DataRow[] = [
  { id: 'h1', state: 'Maharashtra', year: 2023, metricName: 'Hospitals Built', value: 120 },
  { id: 'h2', state: 'Maharashtra', year: 2022, metricName: 'Hospitals Built', value: 95 },
  { id: 'h3', state: 'Gujarat', year: 2023, metricName: 'Hospitals Built', value: 80 },
  { id: 'h4', state: 'Gujarat', year: 2022, metricName: 'Hospitals Built', value: 65 },
  { id: 'h5', state: 'Karnataka', year: 2023, metricName: 'Hospitals Built', value: 110 },
  { id: 'h6', state: 'Maharashtra', year: 2023, metricName: 'Doctors Recruited', value: 450 },
  { id: 'h7', state: 'Gujarat', year: 2023, metricName: 'Doctors Recruited', value: 320 },
  { id: 'h8', state: 'Karnataka', year: 2023, metricName: 'Doctors Recruited', value: 410 },
  // Adding more mock data for realistic table
  ...Array.from({ length: 50 }).map((_, i) => ({
    id: `h_auto_${i}`,
    state: ['Tamil Nadu', 'Kerala', 'Punjab', 'Rajasthan'][i % 4],
    year: 2020 + (i % 4),
    metricName: ['Vaccinations Administered', 'Clinics Upgraded'][i % 2],
    value: Math.floor(Math.random() * 1000) + 100
  }))
];

export const agricultureData: DataRow[] = [
  { id: 'a1', state: 'Punjab', year: 2023, metricName: 'Wheat Yield (Tons)', value: 50000 },
  { id: 'a2', state: 'Punjab', year: 2022, metricName: 'Wheat Yield (Tons)', value: 48000 },
  { id: 'a3', state: 'Haryana', year: 2023, metricName: 'Wheat Yield (Tons)', value: 42000 },
  { id: 'a4', state: 'Haryana', year: 2022, metricName: 'Wheat Yield (Tons)', value: 41000 },
  { id: 'a5', state: 'Uttar Pradesh', year: 2023, metricName: 'Rice Yield (Tons)', value: 85000 },
  { id: 'a6', state: 'Punjab', year: 2023, metricName: 'Tractors Distributed', value: 1200 },
  { id: 'a7', state: 'Haryana', year: 2023, metricName: 'Tractors Distributed', value: 900 },
  { id: 'a8', state: 'Uttar Pradesh', year: 2023, metricName: 'Tractors Distributed', value: 2100 },
  ...Array.from({ length: 50 }).map((_, i) => ({
    id: `a_auto_${i}`,
    state: ['Madhya Pradesh', 'Andhra Pradesh', 'West Bengal', 'Bihar'][i % 4],
    year: 2020 + (i % 4),
    metricName: ['Fertilizer Subsidy (Cr)', 'Irrigation Projects'][i % 2],
    value: Math.floor(Math.random() * 5000) + 50
  }))
];

// Simulate API call
export const fetchDepartmentData = async (department: Department): Promise<DataRow[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(department === 'Health' ? healthData : agricultureData);
    }, 600); // simulated network delay
  });
};
