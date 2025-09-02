import { toast } from "react-toastify";

class PatientService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'patient_c';
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "chief_complaint_c"}},
          {"field": {"Name": "triage_priority_c"}},
          {"field": {"Name": "vital_signs_blood_pressure_c"}},
          {"field": {"Name": "vital_signs_heart_rate_c"}},
          {"field": {"Name": "vital_signs_temperature_c"}},
          {"field": {"Name": "vital_signs_respiratory_rate_c"}},
          {"field": {"Name": "vital_signs_oxygen_saturation_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patients:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "chief_complaint_c"}},
          {"field": {"Name": "triage_priority_c"}},
          {"field": {"Name": "vital_signs_blood_pressure_c"}},
          {"field": {"Name": "vital_signs_heart_rate_c"}},
          {"field": {"Name": "vital_signs_temperature_c"}},
          {"field": {"Name": "vital_signs_respiratory_rate_c"}},
          {"field": {"Name": "vital_signs_oxygen_saturation_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      return response?.data || null;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(patientData) {
    try {
      const params = {
        records: [{
          Name: patientData.name_c || patientData.name,
          id_c: patientData.id_c,
          name_c: patientData.name_c || patientData.name,
          date_of_birth_c: patientData.date_of_birth_c || patientData.dateOfBirth,
          gender_c: patientData.gender_c || patientData.gender,
          contact_c: patientData.contact_c || patientData.contact,
          emergency_contact_c: patientData.emergency_contact_c || patientData.emergencyContact,
          blood_type_c: patientData.blood_type_c || patientData.bloodType,
          allergies_c: Array.isArray(patientData.allergies_c || patientData.allergies) 
            ? (patientData.allergies_c || patientData.allergies).join('\n')
            : (patientData.allergies_c || patientData.allergies || ''),
          current_ward_c: patientData.current_ward_c || patientData.currentWard,
          bed_number_c: patientData.bed_number_c || patientData.bedNumber,
          status_c: patientData.status_c || patientData.status || "Stable",
          admission_date_c: patientData.admission_date_c || patientData.admissionDate || new Date().toISOString().split('T')[0],
          chief_complaint_c: patientData.chief_complaint_c || patientData.chiefComplaint,
          triage_priority_c: patientData.triage_priority_c || patientData.triagePriority,
          vital_signs_blood_pressure_c: patientData.vital_signs_blood_pressure_c || (patientData.vitalSigns && patientData.vitalSigns.bloodPressure),
          vital_signs_heart_rate_c: patientData.vital_signs_heart_rate_c || (patientData.vitalSigns && parseInt(patientData.vitalSigns.heartRate)),
          vital_signs_temperature_c: patientData.vital_signs_temperature_c || (patientData.vitalSigns && parseFloat(patientData.vitalSigns.temperature)),
          vital_signs_respiratory_rate_c: patientData.vital_signs_respiratory_rate_c || (patientData.vitalSigns && parseInt(patientData.vitalSigns.respiratoryRate)),
          vital_signs_oxygen_saturation_c: patientData.vital_signs_oxygen_saturation_c || (patientData.vitalSigns && parseInt(patientData.vitalSigns.oxygenSaturation))
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} patient records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, patientData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: patientData.name_c || patientData.name,
          id_c: patientData.id_c,
          name_c: patientData.name_c || patientData.name,
          date_of_birth_c: patientData.date_of_birth_c || patientData.dateOfBirth,
          gender_c: patientData.gender_c || patientData.gender,
          contact_c: patientData.contact_c || patientData.contact,
          emergency_contact_c: patientData.emergency_contact_c || patientData.emergencyContact,
          blood_type_c: patientData.blood_type_c || patientData.bloodType,
          allergies_c: Array.isArray(patientData.allergies_c || patientData.allergies) 
            ? (patientData.allergies_c || patientData.allergies).join('\n')
            : (patientData.allergies_c || patientData.allergies || ''),
          current_ward_c: patientData.current_ward_c || patientData.currentWard,
          bed_number_c: patientData.bed_number_c || patientData.bedNumber,
          status_c: patientData.status_c || patientData.status,
          admission_date_c: patientData.admission_date_c || patientData.admissionDate,
          chief_complaint_c: patientData.chief_complaint_c || patientData.chiefComplaint,
          triage_priority_c: patientData.triage_priority_c || patientData.triagePriority,
          vital_signs_blood_pressure_c: patientData.vital_signs_blood_pressure_c || (patientData.vitalSigns && patientData.vitalSigns.bloodPressure),
          vital_signs_heart_rate_c: patientData.vital_signs_heart_rate_c || (patientData.vitalSigns && parseInt(patientData.vitalSigns.heartRate)),
          vital_signs_temperature_c: patientData.vital_signs_temperature_c || (patientData.vitalSigns && parseFloat(patientData.vitalSigns.temperature)),
          vital_signs_respiratory_rate_c: patientData.vital_signs_respiratory_rate_c || (patientData.vitalSigns && parseInt(patientData.vitalSigns.respiratoryRate)),
          vital_signs_oxygen_saturation_c: patientData.vital_signs_oxygen_saturation_c || (patientData.vitalSigns && parseInt(patientData.vitalSigns.oxygenSaturation))
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} patient records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} patient records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error);
      return false;
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "name_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "id_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "contact_c", "operator": "Contains", "values": [query]}], "operator": ""}
          ]
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching patients:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patients by status:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new PatientService();