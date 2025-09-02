import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const PatientCard = ({ patient, onView, onEdit }) => {
  const statusVariant = {
    "Critical": "critical",
    "Stable": "stable", 
    "Discharged": "discharged"
  }[patient.status] || "default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
<h3 className="font-semibold text-lg text-gray-900">{patient.name_c || patient.Name}</h3>
              <p className="text-sm text-gray-500">ID: {patient.id_c}</p>
            </div>
            <Badge variant={statusVariant}>
              {patient.status_c}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" size={16} />
              <span>DOB: {patient.date_of_birth_c ? new Date(patient.date_of_birth_c).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Phone" size={16} />
              <span>{patient.contact_c || 'N/A'}</span>
            </div>
            {patient.current_ward_c && (
              <div className="flex items-center space-x-2">
                <ApperIcon name="MapPin" size={16} />
                <span>{patient.current_ward_c} - Bed {patient.bed_number_c}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => onView(patient)}>
              <ApperIcon name="Eye" size={16} className="mr-1" />
              View
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(patient)}>
              <ApperIcon name="Edit" size={16} className="mr-1" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PatientCard;