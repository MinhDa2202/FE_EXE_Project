import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { showAlert } from "src/Features/alertsSlice";
import { updateUserData } from "src/Features/userSlice";
import { updateProfile } from "src/Functions/apiFunctions";
import EditProfileInput from "./EditProfileInput";
import s from "./EditProfileInputs.module.scss";

const MyProfileInputs = ({ onSubmit }) => {
  const { loginInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { username, emailOrPhone, address, token, gender: reduxGender, dateOfBirth: reduxDateOfBirth } = loginInfo;

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const [fullName, setFullName] = useState(username);
  const [addressState, setAddress] = useState(address);
  const [gender, setGender] = useState(reduxGender || "Nam");
  const [dateOfBirth, setDateOfBirth] = useState(formatDate(reduxDateOfBirth));
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const profileData = {
        FullName: fullName.trim() || null,
        Address: addressState.trim() || null,
        Gender: gender || null,
        DateOfBirth: dateOfBirth || null
      };

      // Get token from Redux state
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const result = await updateProfile(profileData, token, (updatedData) => {
        // Update Redux store with fresh profile data
        dispatch(updateUserData({
          updatedUserData: {
            username: updatedData.fullName,
            emailOrPhone: emailOrPhone,
            address: updatedData.address,
            gender: updatedData.gender,
            dateOfBirth: formatDate(updatedData.dateOfBirth)
          }
        }));
      });

      // Show success message
      dispatch(showAlert({
        alertText: "Profile updated successfully",
        alertState: "success",
        alertType: "alert"
      }));

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      dispatch(showAlert({
        alertText: error.message || "Failed to update profile",
        alertState: "error",
        alertType: "alert"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={s.inputs}>
      <section className={s.wrapper}>
        <EditProfileInput
          inputData={{
            label: "Full Name",
            name: "fullName",
            value: fullName,
            setValue: setFullName,
            placeholder: "Enter your full name",
            required: true,
          }}
        />

        <EditProfileInput
          inputData={{
            label: t("inputsLabels.email"),
            name: "email",
            value: emailOrPhone,
            setValue: () => {}, // Email không được chỉnh sửa
            placeholder: "example@gmail.com",
            disabled: true,
          }}
        />

        <EditProfileInput
          inputData={{
            label: "Gender",
            name: "gender",
            value: gender,
            setValue: setGender,
            required: false,
            options: [
              { value: "Nam", label: "Nam" },
              { value: "Nữ", label: "Nữ" }
            ]
          }}
        />

        <EditProfileInput
          inputData={{
            type: "date",
            label: "Date of Birth",
            name: "dateOfBirth",
            value: dateOfBirth,
            setValue: setDateOfBirth,
            placeholder: "Select your date of birth",
          }}
        />

        <EditProfileInput
          inputData={{
            label: t("inputsLabels.address"),
            name: "address",
            value: addressState,
            setValue: setAddress,
            placeholder: t("inputsPlaceholders.address"),
          }}
        />
      </section>

      <div className={s.buttonContainer}>
        <button
          type="submit"
          disabled={isLoading}
          className={s.submitButton}
          onClick={handleSubmit}
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </section>
  );
};
export default MyProfileInputs;