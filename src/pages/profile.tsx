import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../state/store";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaList, FaEdit, FaSave } from "react-icons/fa";
import { setUser } from "../state/slices/authSlice";
import { editProfile } from "../api/userApi";
import NavBar from "../components/NavBar";
const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [editableFields, setEditableFields] = useState<Record<string, string>>({});

  if (!user) {
    return <p className="text-center text-gray-500">No user data available.</p>;
  }

  const handleSave = async(field: string) => {
    const data = {
      userId:user._id,
      [field]: editableFields[field]
    }
    const response = await editProfile(data)
    if(response.success){
      dispatch(setUser({ ...user, [field]: editableFields[field] }));
      setEditableFields((prev) => {
        const updatedFields = { ...prev };
        delete updatedFields[field];
        return updatedFields;
      });
    }

  
    // Remove the field from editableFields after saving
   
  };

  return (
    <>
    
    <NavBar/>
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
        />
        <ProfileField 
          icon={<FaUser />} 
          label="Last Name" 
          value={user.lastName} 
          field="lastName"
          editableFields={editableFields}
          setEditableFields={setEditableFields}
          onSave={handleSave}
        />
        <ProfileField 
          icon={<FaEnvelope />} 
          label="Email" 
          value={user.email} 
          field="email"
          editableFields={editableFields}
          setEditableFields={setEditableFields}
          onSave={handleSave}
        />
        <ProfileField 
          icon={<FaPhone />} 
          label="Phone" 
          value={user.phone} 
          field="phone"
          editableFields={editableFields}
          setEditableFields={setEditableFields}
          onSave={handleSave}
        />
        <ProfileField 
          icon={<FaBirthdayCake />} 
          label="Date of Birth" 
          value={user.dob.toString()} 
          field="dob"
          editableFields={editableFields}
          setEditableFields={setEditableFields}
          onSave={handleSave}
        />


        {/* <div className="p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <FaList className="text-blue-500" />
            <span>Preferences</span>
          </div>
          {user.preferences.length ? (
            <ul className="list-disc pl-5 text-gray-600">
              {user.preferences.map((pref, index) => (
                <li key={index}>{pref}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No preferences set</p>
          )}
        </div> */}
      </div>
    </div>
    </>

  );
};

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  field: string;
  editableFields: Record<string, string>;
  setEditableFields: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSave: (field: string) => void;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value, field, editableFields, setEditableFields, onSave }) => {
  const isEditing = editableFields.hasOwnProperty(field);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="text-blue-500">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {isEditing ? (
            <input
              type="text"
              value={editableFields[field] ?? value}
              onChange={(e) =>
                setEditableFields((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-400"
            />
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
        <button
          onClick={() => setEditableFields((prev) => ({ ...prev, [field]: value }))}
          className="text-blue-500 hover:text-blue-700 transition"
        >
          <FaEdit />
        </button>
      )}
    </div>
  );
};

export default Profile;
