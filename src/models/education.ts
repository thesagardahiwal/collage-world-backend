import mongoose, { Schema, model } from 'mongoose';

export enum EducationFieldEnum {
    ENGINEERING = 'Engineering',
    MEDICINE = 'Medicine',
    BUSINESS = 'Business',
    ARTS = 'Arts',
    SCIENCE = 'Science',
    COMPUTER_SCIENCE = 'Computer Science',
    MATHEMATICS = 'Mathematics',
    PHYSICS = 'Physics',
    CHEMISTRY = 'Chemistry',
    BIOLOGY = 'Biology',
    ECONOMICS = 'Economics',
    LAW = 'Law',
    PSYCHOLOGY = 'Psychology',
    SOCIAL_SCIENCE = 'Social Science',
    ENVIRONMENTAL_SCIENCE = 'Environmental Science',
    AGRICULTURE = 'Agriculture',
    ARCHITECTURE = 'Architecture',
    CIVIL_ENGINEERING = 'Civil Engineering',
    ELECTRICAL_ENGINEERING = 'Electrical Engineering',
    MECHANICAL_ENGINEERING = 'Mechanical Engineering',
    AERONAUTICAL_ENGINEERING = 'Aeronautical Engineering',
    CHEMICAL_ENGINEERING = 'Chemical Engineering',
    NURSING = 'Nursing',
    PHARMACY = 'Pharmacy',
    VETERINARY_SCIENCE = 'Veterinary Science',
    MARINE_BIOLOGY = 'Marine Biology',
    STATISTICS = 'Statistics',
    INFORMATION_TECHNOLOGY = 'Information Technology',
    EDUCATION = 'Education',
    FILM_AND_MEDIA = 'Film and Media',
    MUSIC = 'Music',
    FINE_ARTS = 'Fine Arts',
    JOURNALISM = 'Journalism',
    DESIGN = 'Design',
    DANCE = 'Dance',
    SPORTS_SCIENCE = 'Sports Science',
    PUBLIC_HEALTH = 'Public Health',
  }

  export interface IEducation extends Document {
    name: string;
    subjects: mongoose.Types.ObjectId[];
  }
  
  const EducationSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    subjects: [{
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    }],
  });
  
  
  const EducationField = model('EducationField', EducationSchema);
  export default EducationField;