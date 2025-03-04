"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationFieldEnum = void 0;
const mongoose_1 = require("mongoose");
var EducationFieldEnum;
(function (EducationFieldEnum) {
    EducationFieldEnum["ENGINEERING"] = "Engineering";
    EducationFieldEnum["MEDICINE"] = "Medicine";
    EducationFieldEnum["BUSINESS"] = "Business";
    EducationFieldEnum["ARTS"] = "Arts";
    EducationFieldEnum["SCIENCE"] = "Science";
    EducationFieldEnum["COMPUTER_SCIENCE"] = "Computer Science";
    EducationFieldEnum["MATHEMATICS"] = "Mathematics";
    EducationFieldEnum["PHYSICS"] = "Physics";
    EducationFieldEnum["CHEMISTRY"] = "Chemistry";
    EducationFieldEnum["BIOLOGY"] = "Biology";
    EducationFieldEnum["ECONOMICS"] = "Economics";
    EducationFieldEnum["LAW"] = "Law";
    EducationFieldEnum["PSYCHOLOGY"] = "Psychology";
    EducationFieldEnum["SOCIAL_SCIENCE"] = "Social Science";
    EducationFieldEnum["ENVIRONMENTAL_SCIENCE"] = "Environmental Science";
    EducationFieldEnum["AGRICULTURE"] = "Agriculture";
    EducationFieldEnum["ARCHITECTURE"] = "Architecture";
    EducationFieldEnum["CIVIL_ENGINEERING"] = "Civil Engineering";
    EducationFieldEnum["ELECTRICAL_ENGINEERING"] = "Electrical Engineering";
    EducationFieldEnum["MECHANICAL_ENGINEERING"] = "Mechanical Engineering";
    EducationFieldEnum["AERONAUTICAL_ENGINEERING"] = "Aeronautical Engineering";
    EducationFieldEnum["CHEMICAL_ENGINEERING"] = "Chemical Engineering";
    EducationFieldEnum["NURSING"] = "Nursing";
    EducationFieldEnum["PHARMACY"] = "Pharmacy";
    EducationFieldEnum["VETERINARY_SCIENCE"] = "Veterinary Science";
    EducationFieldEnum["MARINE_BIOLOGY"] = "Marine Biology";
    EducationFieldEnum["STATISTICS"] = "Statistics";
    EducationFieldEnum["INFORMATION_TECHNOLOGY"] = "Information Technology";
    EducationFieldEnum["EDUCATION"] = "Education";
    EducationFieldEnum["FILM_AND_MEDIA"] = "Film and Media";
    EducationFieldEnum["MUSIC"] = "Music";
    EducationFieldEnum["FINE_ARTS"] = "Fine Arts";
    EducationFieldEnum["JOURNALISM"] = "Journalism";
    EducationFieldEnum["DESIGN"] = "Design";
    EducationFieldEnum["DANCE"] = "Dance";
    EducationFieldEnum["SPORTS_SCIENCE"] = "Sports Science";
    EducationFieldEnum["PUBLIC_HEALTH"] = "Public Health";
})(EducationFieldEnum || (exports.EducationFieldEnum = EducationFieldEnum = {}));
const EducationSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    subjects: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Subject',
        }],
});
const EducationField = (0, mongoose_1.model)('EducationField', EducationSchema);
exports.default = EducationField;
