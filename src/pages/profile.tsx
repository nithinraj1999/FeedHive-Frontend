import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../state/store";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaList, FaEdit, FaSave } from "react-icons/fa";
import { logout, setUser } from "../state/slices/authSlice";
import { editProfile } from "../api/userApi";
import NavBar from "../components/NavBar";
import { getAllCategories } from "../api/userApi";
import { z } from "zod";

interface Category{
  _id:string,
  categoryName:string,
}


const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters")
  .regex(/^(?!\s*$).+/, "First name cannot be empty or only spaces"),
  lastName: z.string().min(2, "Last name must be at least 2 characters")
  .regex(/^(?!\s*$).+/, "lastName cannot be empty or only spaces"),
  email: z.string().email("Invalid email address")
  .regex(/^(?!\s*$).+/, "email cannot be empty or only spaces"),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10-15 digits")
  .regex(/^(?!\s*$).+/, "phone cannot be empty or only spaces"),
  dob: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  preferences: z.array(
    z.object({
      _id: z.string(),
      categoryName: z.string(),
    })
  ).min(1, "At least one preference must be selected"),  
});


const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [editableFields, setEditableFields] = useState<Record<string, string>>({});
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<{ _id: string; categoryName: string }[]>(user?.preferences || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [availableCategories,setAvailableCategories] = useState<Category[]>([])
  if (!user) {
    return <p className="text-center text-gray-500">No user data available.</p>;
  }
  
  

  useEffect(()=>{
    async function fetchCategories(){
      const response = await getAllCategories()
      if(response.success){
        setAvailableCategories(response.allCategories)
      }
    }
    fetchCategories()
  },[])


  const handleSave = async (field: keyof typeof profileSchema.shape) => {
    const data = {
      userId: user._id,
      [field]: editableFields[field]
    };
    const fieldSchema = profileSchema.shape[field];
    const result = fieldSchema.safeParse(editableFields[field]);

    console.log(".......",result);
    
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Invalid input";
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: errorMessage,
      }));
  
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
  
      console.log("Validation successful!", result.data);
      const response = await editProfile(data);
    if (response.success) {
      dispatch(setUser({ ...user, [field]: editableFields[field] }));
      setEditableFields((prev) => {
        const updatedFields = { ...prev };
        delete updatedFields[field];
        return updatedFields;
      });
    }
    }
        
  };

  const handleSavePreferences = async () => {
    const result = profileSchema.shape.preferences.safeParse(selectedCategories);
  
    if (!result.success) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        preferences: "At least one preference must be selected",
      }));
      return;
    }
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      preferences: "", // Clear error when input is valid
    }));
  
    const data = {
      userId: user._id,
      preferences: selectedCategories
    };
  
    const response = await editProfile(data);
    if (response.success) {
      dispatch(setUser({ ...user, preferences: data.preferences }));
      setIsEditingPreferences(false);
    }
  };
  

  const handleCategoryToggle = (category:any) => {
    const isSelected = selectedCategories.some((c) => c._id === category._id);
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter((c) => c._id !== category._id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">My Profile</h2>

        <div className="space-y-5">
          <ProfileField 
            icon={<FaUser />} 
            label="First Name" 
            value={user.firstName} 
            field="firstName"
            editableFields={editableFields}
            setEditableFields={setEditableFields}
            onSave={handleSave}
            errors={errors}
          />
          <>
          </>
          <ProfileField 
            icon={<FaUser />} 
            label="Last Name" 
            value={user.lastName} 
            field="lastName"
            editableFields={editableFields}
            setEditableFields={setEditableFields}
            onSave={handleSave}
            errors={errors}

          />
          <ProfileField 
            icon={<FaEnvelope />} 
            label="Email" 
            value={user.email} 
            field="email"
            editableFields={editableFields}
            setEditableFields={setEditableFields}
            onSave={handleSave}
            errors={errors}

          />
          <ProfileField 
            icon={<FaPhone />} 
            label="Phone" 
            value={user.phone} 
            field="phone"
            editableFields={editableFields}
            setEditableFields={setEditableFields}
            onSave={handleSave}
            errors={errors}

          />
          <ProfileField 
            icon={<FaBirthdayCake />} 
            label="Date of Birth" 
            value={user.dob.toString()} 
            field="dob"
            editableFields={editableFields}
            setEditableFields={setEditableFields}
            onSave={handleSave}
            errors={errors}

          />

          {/* Preferences Section with Editing Mode */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaList className="text-blue-500" />
              <span>Preferences</span>
            </div>

            {isEditingPreferences ? (
              <div className="flex flex-col gap-2">
                {/* Category Selection */}
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <label key={category._id} className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm border border-gray-300">
                      <input
                        type="checkbox"
                        checked={selectedCategories.some((c) => c._id === category._id)}
                        onChange={() => handleCategoryToggle(category)}
                      />
                      <span>{category.categoryName}</span>
                    </label>
                  ))}
                </div>

                {/* Save Button */}
                <button 
                  onClick={handleSavePreferences} 
                  className="text-green-500 hover:text-green-700 transition flex items-center gap-1 mt-2"
                >
                  <FaSave /> 
                  {errors.preferences}
                </button>
              </div>
            ) : (
              <div>
                {selectedCategories.length ? (
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    {selectedCategories.map((pref) => (
                      <li key={pref._id}>{pref.categoryName}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No preferences set</p>
                )}

                <button 
                  onClick={() => setIsEditingPreferences(true)} 
                  className="text-blue-500 hover:text-blue-700 transition flex items-center gap-1 mt-2"
                >
                  <FaEdit /> Edit Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  field: keyof typeof profileSchema.shape;
  editableFields: Record<string, string>;
  setEditableFields: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSave: (field: keyof typeof profileSchema.shape) => void;
  errors:Record<string, string>
 }
  
const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value, field, editableFields, setEditableFields, onSave,errors }) => {
  const isEditing = editableFields.hasOwnProperty(field);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="text-blue-500">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {isEditing ? (
            <>
              <input
              type="text"
              value={editableFields[field] ?? value}
              onChange={(e) =>
                setEditableFields((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-400"
            />
                 {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}

            </>
           
          ) : (
            <p className="text-lg font-medium text-gray-800">{value}</p>
          )}
        </div>
      </div>
      {isEditing ? (
        <button onClick={() => onSave(field)} className="text-green-500 hover:text-green-700 transition">
          <FaSave />
        </button>
      ) : (
        <button onClick={() => setEditableFields((prev) => ({ ...prev, [field]: value }))} className="text-blue-500 hover:text-blue-700 transition">
          <FaEdit />
        </button>
      )}
    </div>
  );
};

export default Profile;
