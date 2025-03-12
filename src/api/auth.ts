
import { userInstance } from "./axiosInstance/userAxiosInstance"
export const registerUser = async(data:any)=>{
    const response = await userInstance.post("/signup",data)
    return response.data
}

export const signinUser = async(data:any)=>{
    const response = await userInstance.post("/signin",data)
    return response.data
}

   


export const profileInfo = async(data:any)=>{
    const response = await userInstance.post("/get-profile-info",data)
    return response.data
}

   