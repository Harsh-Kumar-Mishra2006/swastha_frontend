export interface DiseaseSpecialization {
  disease: string;
  specialization: string;
  keywords: string[];
}

export const specializationDiseases: DiseaseSpecialization[] = [
  // Cardiology
  { disease: "Heart Attack", specialization: "Cardiology", keywords: ["chest pain", "heart", "attack", "myocardial"] },
  { disease: "High Blood Pressure", specialization: "Cardiology", keywords: ["hypertension", "bp", "blood pressure"] },
  { disease: "Arrhythmia", specialization: "Cardiology", keywords: ["irregular heartbeat", "palpitations", "rhythm"] },
  { disease: "Heart Failure", specialization: "Cardiology", keywords: ["heart failure", "congestive", "cardiac"] },
  
  // Dermatology
  { disease: "Acne", specialization: "Dermatology", keywords: ["pimples", "breakout", "skin"] },
  { disease: "Eczema", specialization: "Dermatology", keywords: ["dermatitis", "skin inflammation", "rash"] },
  { disease: "Psoriasis", specialization: "Dermatology", keywords: ["skin patches", "scaly skin", "autoimmune"] },
  { disease: "Skin Allergy", specialization: "Dermatology", keywords: ["allergic reaction", "hives", "itching"] },
  
  // Neurology
  { disease: "Migraine", specialization: "Neurology", keywords: ["headache", "migraine", "severe headache"] },
  { disease: "Epilepsy", specialization: "Neurology", keywords: ["seizures", "fits", "convulsions"] },
  { disease: "Stroke", specialization: "Neurology", keywords: ["brain attack", "paralysis", "cerebrovascular"] },
  { disease: "Parkinson's", specialization: "Neurology", keywords: ["tremors", "movement disorder", "parkinson"] },
  
  // Orthopedics
  { disease: "Fracture", specialization: "Orthopedics", keywords: ["broken bone", "bone break", "fracture"] },
  { disease: "Arthritis", specialization: "Orthopedics", keywords: ["joint pain", "inflammation", "rheumatism"] },
  { disease: "Back Pain", specialization: "Orthopedics", keywords: ["spine", "lower back", "backache"] },
  { disease: "Sports Injury", specialization: "Orthopedics", keywords: ["ligament", "muscle tear", "sprain"] },
  
  // Pediatrics
  { disease: "Child Fever", specialization: "Pediatrics", keywords: ["fever in children", "high temperature", "pediatric fever"] },
  { disease: "Growth Issues", specialization: "Pediatrics", keywords: ["development", "height", "weight issues"] },
  { disease: "Childhood Asthma", specialization: "Pediatrics", keywords: ["wheezing", "breathing issues", "pediatric asthma"] },
  { disease: "Vaccination", specialization: "Pediatrics", keywords: ["immunization", "vaccines", "child vaccination"] },
  
  // Gynecology
  { disease: "Pregnancy Care", specialization: "Gynecology", keywords: ["prenatal", "antenatal", "pregnancy"] },
  { disease: "Menstrual Issues", specialization: "Gynecology", keywords: ["period problems", "irregular periods", "pms"] },
  { disease: "PCOS", specialization: "Gynecology", keywords: ["polycystic", "hormonal imbalance", "ovarian cysts"] },
  { disease: "Fertility Issues", specialization: "Gynecology", keywords: ["infertility", "conception", "ivf"] },
  
  // Ophthalmology
  { disease: "Cataract", specialization: "Ophthalmology", keywords: ["vision blur", "cloudy lens", "eye surgery"] },
  { disease: "Glaucoma", specialization: "Ophthalmology", keywords: ["eye pressure", "vision loss", "optic nerve"] },
  { disease: "Dry Eye", specialization: "Ophthalmology", keywords: ["eye irritation", "red eyes", "tearing"] },
  { disease: "Refractive Errors", specialization: "Ophthalmology", keywords: ["myopia", "hyperopia", "spectacles"] },
  
  // Dentistry
  { disease: "Tooth Decay", specialization: "Dentistry", keywords: ["cavities", "dental caries", "tooth pain"] },
  { disease: "Gum Disease", specialization: "Dentistry", keywords: ["gingivitis", "periodontitis", "bleeding gums"] },
  { disease: "Root Canal", specialization: "Dentistry", keywords: ["rct", "tooth infection", "dental abscess"] },
  { disease: "Teeth Whitening", specialization: "Dentistry", keywords: ["stained teeth", "cosmetic dentistry", "dental cleaning"] },
  
  // Psychiatry
  { disease: "Depression", specialization: "Psychiatry", keywords: ["sadness", "low mood", "mental health"] },
  { disease: "Anxiety", specialization: "Psychiatry", keywords: ["stress", "panic attacks", "worry"] },
  { disease: "Insomnia", specialization: "Psychiatry", keywords: ["sleep issues", "sleeplessness", "sleep disorder"] },
  { disease: "Bipolar Disorder", specialization: "Psychiatry", keywords: ["mood swings", "manic", "depressive episodes"] },
  
  // Gastroenterology
  { disease: "Acid Reflux", specialization: "Gastroenterology", keywords: ["heartburn", "gerd", "acidity"] },
  { disease: "Irritable Bowel", specialization: "Gastroenterology", keywords: ["ibs", "stomach cramps", "bloating"] },
  { disease: "Constipation", specialization: "Gastroenterology", keywords: ["difficulty passing stool", "irregular bowel"] },
  { disease: "Ulcer", specialization: "Gastroenterology", keywords: ["stomach ulcer", "peptic ulcer", "gastric"] }
];

// Get all unique specializations
export const getAllSpecializations = (): string[] => {
  const specializations = [...new Set(specializationDiseases.map(item => item.specialization))];
  return specializations;
};

// Get specializations for a disease
export const getSpecializationsByDisease = (diseaseName: string): string[] => {
  const diseases = specializationDiseases.filter(
    item => item.disease.toLowerCase().includes(diseaseName.toLowerCase()) ||
            item.keywords.some(keyword => diseaseName.toLowerCase().includes(keyword))
  );
  return [...new Set(diseases.map(item => item.specialization))];
};

// Search diseases by keyword
export const searchDiseases = (query: string): string[] => {
  if (!query) return [];
  const matched = specializationDiseases.filter(
    item => item.disease.toLowerCase().includes(query.toLowerCase()) ||
            item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
  );
  return [...new Set(matched.map(item => item.disease))];
};

// Get all diseases
export const getAllDiseases = (): string[] => {
  return [...new Set(specializationDiseases.map(item => item.disease))];
};